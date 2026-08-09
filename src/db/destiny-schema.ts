import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

// ─── Destiny Matrix Results ──────────────────────────────────────
// One row per calculated matrix. The 13 points (A-M) are stored as JSON
// since each point is a small object (key, label, value, arcana) rather
// than 13 separate columns — simpler to evolve if point definitions change.
export const destinyMatrixResults = sqliteTable(
  'destiny_matrix_results',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().default('default'),
    birthDate: text('birth_date').notNull(),
    pointsJson: text('points_json').notNull(), // serialized DestinyMatrixPoints
    version: text('version').notNull().default('1.0.0'),
    calculatedAt: integer('calculated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).$defaultFn(() => {
      // Destiny Matrix results never change for a given birth date (unlike
      // classical numerology's personalYear/Month/Day), so this cache can
      // live much longer — 1 year as a generous default, mainly to allow
      // periodic recalculation if the engine's formula is ever refined.
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      return d;
    }),
  },
  table => [
    index('idx_destiny_user_date').on(table.userId, table.birthDate),
    index('idx_destiny_calculated').on(table.calculatedAt),
  ]
);

// ─── User History (shared with classical numerology if reintroduced) ────
export const destinyUserHistory = sqliteTable(
  'destiny_user_history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().default('default'),
    actionType: text('action_type').notNull(),
    metadataJson: text('metadata_json'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  table => [index('idx_destiny_history_user_time').on(table.userId, table.createdAt)]
);

// ─── Schema Metadata (migration tracking, same pattern as before) ───────
export const destinySchemaMeta = sqliteTable('destiny_schema_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// ─── Types for TypeScript ───────────────────────────────────────
export type DestinyMatrixResultRow = typeof destinyMatrixResults.$inferSelect;
export type NewDestinyMatrixResultRow = typeof destinyMatrixResults.$inferInsert;
export type DestinyUserHistory = typeof destinyUserHistory.$inferSelect;
export type NewDestinyUserHistory = typeof destinyUserHistory.$inferInsert;
