import os

# Perbaikan: Menggunakan penyimpanan lokal Termux yang aman dari Permission Error
project_root = "/data/data/com.termux/files/home/arkana/numerology-engine"


# Create drizzle.config.ts
drizzle_config = """import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
  dbCredentials: {
    url: 'file:numerology.db',
  },
  verbose: true,
  strict: true,
});
"""

with open(f"{project_root}/drizzle.config.ts", "w") as f:
    f.write(drizzle_config)

# Create src/db/schema.ts
schema_ts = """import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Matrix Results ─────────────────────────────────────────────
export const matrixResults = sqliteTable('matrix_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().default('default'),
  birthDate: text('birth_date').notNull(), // ISO 8601: YYYY-MM-DD
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
  challengeJson: text('challenge_json').notNull(), // JSON array
  pinnacleJson: text('pinnacle_json').notNull(), // JSON array
  energyGridJson: text('energy_grid_json').notNull(), // Full grid JSON
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
  recommendationsJson: text('recommendations_json').notNull(), // JSON array of micro-tasks
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
  actionType: text('action_type').notNull(), // 'calculate' | 'view_insight' | 'export_pdf' | 'export_png' | 'share' | 'arkana_draw'
  metadataJson: text('metadata_json'), // Flexible JSON for context
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('idx_history_user_time').on(table.userId, table.createdAt),
  index('idx_history_action').on(table.userId, table.actionType),
]);

// ─── User Preferences ───────────────────────────────────────────
export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().default('default').unique(),
  theme: text('theme').notNull().default('system'), // 'light' | 'dark' | 'system'
  language: text('language').notNull().default('id'), // 'id' | 'en'
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).notNull().default(true),
  dailyReminderTime: text('daily_reminder_time').default('08:00'),
  aiModelVersion: text('ai_model_version').default('1.0.0'),
  cacheDurationDays: integer('cache_duration_days').notNull().default(30),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
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
"""

with open(f"{project_root}/src/db/schema.ts", "w") as f:
    f.write(schema_ts)

# Create src/db/index.ts
db_index = """import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

// Singleton database instance
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabase() {
  if (!dbInstance) {
    const expoDb = openDatabaseSync('numerology.db');
    dbInstance = drizzle(expoDb, { schema });
  }
  return dbInstance;
}

export const db = getDatabase();

// Re-export schema for convenience
export * from './schema';
"""

with open(f"{project_root}/src/db/index.ts", "w") as f:
    f.write(db_index)

# Create src/db/cache-manager.ts
cache_manager = """import { eq, and, gte, lt, desc, sql } from 'drizzle-orm';
import { db } from './index';
import { matrixResults, aiInsights, userHistory, type EnergyMatrix } from '@core/numerology/types';

class CacheManager {
  private static instance: CacheManager;
  
  private constructor() {}
  
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // ─── Matrix Cache ─────────────────────────────────────────────
  
  async getCachedMatrix(
    userId: string,
    birthDate: string,
    name: string
  ): Promise<EnergyMatrix | null> {
    try {
      const cached = await db
        .select()
        .from(matrixResults)
        .where(
          and(
            eq(matrixResults.userId, userId),
            eq(matrixResults.birthDate, birthDate),
            eq(matrixResults.name, name),
            gte(matrixResults.expiresAt, new Date())
          )
        )
        .limit(1);

      if (cached.length === 0) return null;

      const row = cached[0];
      return {
        input: { birthDate: row.birthDate, name: row.name },
        matrix: {
          lifePath: row.lifePath,
          destiny: row.destiny,
          soulUrge: row.soulUrge,
          personality: row.personality,
          expression: row.expression,
          birthday: row.birthday,
          maturity: row.maturity,
          personalYear: row.personalYear,
          personalMonth: row.personalMonth,
          personalDay: row.personalDay,
          challenge: JSON.parse(row.challengeJson),
          pinnacle: JSON.parse(row.pinnacleJson),
        },
        energyGrid: JSON.parse(row.energyGridJson),
        arkana: {
          card: row.arkanaCard,
          number: row.arkanaNumber,
        },
        calculatedAt: row.calculatedAt.toISOString(),
      };
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  }

  async cacheMatrix(userId: string, matrix: EnergyMatrix): Promise<number> {
    const result = await db
      .insert(matrixResults)
      .values({
        userId,
        birthDate: matrix.input.birthDate,
        name: matrix.input.name,
        lifePath: matrix.matrix.lifePath,
        destiny: matrix.matrix.destiny,
        soulUrge: matrix.matrix.soulUrge,
        personality: matrix.matrix.personality,
        expression: matrix.matrix.expression,
        birthday: matrix.matrix.birthday,
        maturity: matrix.matrix.maturity,
        personalYear: matrix.matrix.personalYear,
        personalMonth: matrix.matrix.personalMonth,
        personalDay: matrix.matrix.personalDay,
        challengeJson: JSON.stringify(matrix.matrix.challenge),
        pinnacleJson: JSON.stringify(matrix.matrix.pinnacle),
        energyGridJson: JSON.stringify(matrix.energyGrid),
        arkanaCard: matrix.arkana.card,
        arkanaNumber: matrix.arkana.number,
      })
      .returning({ id: matrixResults.id });

    return result[0]?.id ?? 0;
  }

  // ─── AI Insight Cache ─────────────────────────────────────────
  
  async getCachedInsight(matrixId: number): Promise<AIInsight | null> {
    const cached = await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.matrixId, matrixId))
      .limit(1);

    return cached[0] ?? null;
  }

  async cacheInsight(
    matrixId: number,
    narrative: string,
    recommendations: unknown[],
    confidence: number,
    modelVersion: string = '1.0.0'
  ): Promise<void> {
    await db.insert(aiInsights).values({
      matrixId,
      narrative,
      recommendationsJson: JSON.stringify(recommendations),
      confidence,
      modelVersion,
    });
  }

  // ─── User History ─────────────────────────────────────────────
  
  async logAction(
    userId: string,
    actionType: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await db.insert(userHistory).values({
      userId,
      actionType,
      metadataJson: metadata ? JSON.stringify(metadata) : null,
    });
  }

  async getHistory(userId: string, limit: number = 50): Promise<typeof userHistory.$inferSelect[]> {
    return db
      .select()
      .from(userHistory)
      .where(eq(userHistory.userId, userId))
      .orderBy(desc(userHistory.createdAt))
      .limit(limit);
  }

  // ─── Cache Management ─────────────────────────────────────────
  
  async cleanupExpired(): Promise<number> {
    const result = await db
      .delete(matrixResults)
      .where(lt(matrixResults.expiresAt, new Date()));
    
    return result.changes ?? 0;
  }

  async clearAllCache(): Promise<void> {
    await db.delete(matrixResults);
    await db.delete(aiInsights);
    await db.delete(userHistory);
  }

  async getCacheStats(): Promise<{ totalMatrices: number; totalInsights: number; totalHistory: number }> {
    const [matrices] = await db.select({ count: sql<number>`count(*)` }).from(matrixResults);
    const [insights] = await db.select({ count: sql<number>`count(*)` }).from(aiInsights);
    const [history] = await db.select({ count: sql<number>`count(*)` }).from(userHistory);

    return {
      totalMatrices: matrices?.count ?? 0,
      totalInsights: insights?.count ?? 0,
      totalHistory: history?.count ?? 0,
    };
  }
}

export const cacheManager = CacheManager.getInstance();
"""

with open(f"{project_root}/src/db/cache-manager.ts", "w") as f:
    f.write(cache_manager)

print("✅ Database layer created:")
print("   - drizzle.config.ts")
print("   - src/db/schema.ts (6 tables)")
print("   - src/db/index.ts")
print("   - src/db/cache-manager.ts")