import { eq, and, gte, lt, desc, sql } from 'drizzle-orm';
import { getDrizzleDb } from './index';
import { matrixResults, aiInsights, userHistory, arkanaReadings } from '@db/schema';
import type { EnergyMatrix, AIInsight } from '@core/numerology/types';

// EnergyMatrix.version isn't persisted yet (matrix_results has no version
// column). Defaulted here on read; add a schema column + migration if
// version needs to survive cache round-trips exactly.
const DEFAULT_MATRIX_VERSION = '1.0.0';

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
      const db = await getDrizzleDb();
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

      const arkanaRows = await db
        .select()
        .from(arkanaReadings)
        .where(eq(arkanaReadings.matrixId, row.id))
        .limit(1);
      const arkanaRow = arkanaRows[0];

      return {
        version: DEFAULT_MATRIX_VERSION,
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
          element: (arkanaRow?.element as 'Fire' | 'Water' | 'Air' | 'Earth') ?? 'Fire',
          keywords: arkanaRow ? JSON.parse(arkanaRow.keywordsJson) : [],
          uprightMeaning: arkanaRow?.uprightMeaning ?? '',
          reversedMeaning: arkanaRow?.reversedMeaning ?? '',
        },
        calculatedAt: row.calculatedAt.toISOString(),
      };
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  }

  async cacheMatrix(userId: string, matrix: EnergyMatrix): Promise<number> {
    const db = await getDrizzleDb();
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

    const matrixId = result[0]?.id ?? 0;

    if (matrixId) {
      await db.insert(arkanaReadings).values({
        matrixId,
        cardName: matrix.arkana.card,
        cardNumber: matrix.arkana.number,
        element: matrix.arkana.element,
        uprightMeaning: matrix.arkana.uprightMeaning,
        reversedMeaning: matrix.arkana.reversedMeaning,
        keywordsJson: JSON.stringify(matrix.arkana.keywords),
      });
    }

    return matrixId;
  }

  // ─── AI Insight Cache ─────────────────────────────────────────

  async getCachedInsight(matrixId: number): Promise<AIInsight | null> {
    const db = await getDrizzleDb();
    const cached = await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.matrixId, matrixId))
      .limit(1);

    if (cached.length === 0) return null;

    const row = cached[0];
    return {
      narrative: row.narrative,
      recommendations: JSON.parse(row.recommendationsJson),
      confidence: row.confidence,
      modelVersion: row.modelVersion,
      generatedAt: row.generatedAt.toISOString(),
    };
  }

  async cacheInsight(
    matrixId: number,
    narrative: string,
    recommendations: unknown[],
    confidence: number,
    modelVersion: string = '1.0.0'
  ): Promise<void> {
    const db = await getDrizzleDb();
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
    const db = await getDrizzleDb();
    await db.insert(userHistory).values({
      userId,
      actionType,
      metadataJson: metadata ? JSON.stringify(metadata) : null,
    });
  }

  async getHistory(userId: string, limit: number = 50): Promise<typeof userHistory.$inferSelect[]> {
    const db = await getDrizzleDb();
    return db
      .select()
      .from(userHistory)
      .where(eq(userHistory.userId, userId))
      .orderBy(desc(userHistory.createdAt))
      .limit(limit);
  }

  // ─── Cache Management ─────────────────────────────────────────

  async cleanupExpired(): Promise<number> {
    const db = await getDrizzleDb();
    const result = await db
      .delete(matrixResults)
      .where(lt(matrixResults.expiresAt, new Date()));

    return result.changes ?? 0;
  }

  async clearAllCache(): Promise<void> {
    const db = await getDrizzleDb();
    await db.delete(matrixResults);
    await db.delete(aiInsights);
    await db.delete(userHistory);
  }

  async getCacheStats(): Promise<{ totalMatrices: number; totalInsights: number; totalHistory: number }> {
    const db = await getDrizzleDb();
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
 