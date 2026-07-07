import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// A "profile" is just a named birth date the user wants to save and
// switch back to (themselves, family, friends). The profile's `id` is
// reused as the `userId` value in destiny_matrix_results and
// destiny_user_history — no separate join table needed.
export const destinyProfiles = sqliteTable('destiny_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  birthDate: text('birth_date').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type DestinyProfile = typeof destinyProfiles.$inferSelect;
export type NewDestinyProfile = typeof destinyProfiles.$inferInsert;
