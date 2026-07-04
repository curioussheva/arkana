import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';

// ─── Matrix Results ─────────────────────────────────────────────
export const matrixResults = sqliteTable('matrix_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().default('default'),
  birthDate: text('birth_date').notNull(),
  name: text('name').notNull(),
  lifePath: integer('life_path').notNull(),
  destiny: integer('destiny').notNull(),
  soulUrge: integer('soul_urge').notNull(),
  personality: integer('personality').notNull(),
  expression: integer('expression').notNull(),
  birthday: integer('birthday').notNull(),
  maturity: integer('maturity').notNull(),
  personalYear: integer('personal_year').notNull(),
  personalMonth: integer('personal_month').notNull(),
  personalDay: integer('personal_day').notNull(),
  challengeJson: text('challenge_json').notNull(),
  pinnacleJson: text('pinnacle_json').notNull(),
  energyGridJson: text('energy_grid_json').notNull(),
  arkanaCard: text('arkana_card').notNull(),
  arkanaNumber: integer('arkana_number').notNull(),
  calculatedAt: integer('calculated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).$defaultFn(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }),
}, (table) => [
  index('idx_matrix_user_date').on(table.userId, table.birthDate),
  index('idx_matrix_name').on(table.userId, table.name),
  index('idx_matrix_calculated').on(table.calculatedAt),
]);

// ─── AI Insights ────────────────────────────────────────────────
export const aiInsights = sqliteTable('ai_insights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  matrixId: integer('matrix_id').references(() => matrixResults.id, { onDelete: 'cascade' }).notNull(),
  narrative: text('narrative').notNull(),
  recommendationsJson: text('recommendations_json').notNull(),
  confidence: real('confidence').notNull(),
  modelVersion: text('model_version').notNull().default('1.0.0'),
  generatedAt: integer('generated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('idx_insight_matrix').on(table.matrixId),
]);

// ─── Arkana Readings ────────────────────────────────────────────
export const arkanaReadings = sqliteTable('arkana_readings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  matrixId: integer('matrix_id').references(() => matrixResults.id, { onDelete: 'cascade' }).notNull(),
  cardName: text('card_name').notNull(),
  cardNumber: integer('card_number').notNull(),
  element: text('element').notNull(),
  uprightMeaning: text('upright_meaning').notNull(),
  reversedMeaning: text('reversed_meaning'),
  keywordsJson: text('keywords_json').notNull(),
  drawnAt: integer('drawn_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  isReversed: integer('is_reversed', { mode: 'boolean' }).notNull().default(false),
}, (table) => [
  index('idx_arkana_matrix').on(table.matrixId),
]);

// ─── User History ───────────────────────────────────────────────
export const userHistory = sqliteTable('user_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().default('default'),
  actionType: text('action_type').notNull(),
  metadataJson: text('metadata_json'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('idx_history_user_time').on(table.userId, table.createdAt),
  index('idx_history_action').on(table.userId, table.actionType),
]);

// ─── User Preferences ───────────────────────────────────────────
export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().default('default').unique(),
  theme: text('theme').notNull().default('system'),
  language: text('language').notNull().default('id'),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).notNull().default(true),
  dailyReminderTime: text('daily_reminder_time').default('08:00'),
  aiModelVersion: text('ai_model_version').default('1.0.0'),
  cacheDurationDays: integer('cache_duration_days').notNull().default(30),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ─── Schema Metadata (for migration tracking) ────────────────────
export const schemaMeta = sqliteTable('schema_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// ─── Types for TypeScript ───────────────────────────────────────
export type MatrixResult = typeof matrixResults.$inferSelect;
export type NewMatrixResult = typeof matrixResults.$inferInsert;
export type AIInsight = typeof aiInsights.$inferSelect;
export type NewAIInsight = typeof aiInsights.$inferInsert;
export type ArkanaReading = typeof arkanaReadings.$inferSelect;
export type NewArkanaReading = typeof arkanaReadings.$inferInsert;
export type UserHistory = typeof userHistory.$inferSelect;
export type NewUserHistory = typeof userHistory.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
export type SchemaMeta = typeof schemaMeta.$inferSelect;
export type NewSchemaMeta = typeof schemaMeta.$inferInsert;
 