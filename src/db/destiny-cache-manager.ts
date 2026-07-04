import { eq, and, gte, lt, desc, sql } from 'drizzle-orm';
import { getDrizzleDb } from './index';
import { destinyMatrixResults, destinyUserHistory } from './destiny-schema';
import type { DestinyMatrix } from '@core/destiny-matrix/types';

class DestinyCacheManager {
  private static instance: DestinyCacheManager;

  private constructor() {}

  static getInstance(): DestinyCacheManager {
    if (!DestinyCacheManager.instance) {
      DestinyCacheManager.instance = new DestinyCacheManager();
    }
    return DestinyCacheManager.instance;
  }

  async getCachedMatrix(userId: string, birthDate: string): Promise<DestinyMatrix | null> {
    try {
      const db = await getDrizzleDb();
      const cached = await db
        .select()
        .from(destinyMatrixResults)
        .where(
          and(
            eq(destinyMatrixResults.userId, userId),
            eq(destinyMatrixResults.birthDate, birthDate),
            gte(destinyMatrixResults.expiresAt, new Date())
          )
        )
        .limit(1);

      if (cached.length === 0) return null;

      const row = cached[0];
      return {
        version: row.version,
        calculatedAt: row.calculatedAt.toISOString(),
        input: { birthDate: row.birthDate },
        points: JSON.parse(row.pointsJson),
      };
    } catch (error) {
      console.warn('[DestinyCache] Read error:', error);
      return null;
    }
  }

  async cacheMatrix(userId: string, matrix: DestinyMatrix): Promise<number> {
    const db = await getDrizzleDb();
    const result = await db
      .insert(destinyMatrixResults)
      .values({
        userId,
        birthDate: matrix.input.birthDate,
        pointsJson: JSON.stringify(matrix.points),
        version: matrix.version,
      })
      .returning({ id: destinyMatrixResults.id });

    return result[0]?.id ?? 0;
  }

  async logAction(
    userId: string,
    actionType: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const db = await getDrizzleDb();
    await db.insert(destinyUserHistory).values({
      userId,
      actionType,
      metadataJson: metadata ? JSON.stringify(metadata) : null,
    });
  }

  async getHistory(userId: string, limit: number = 50): Promise<typeof destinyUserHistory.$inferSelect[]> {
    const db = await getDrizzleDb();
    return db
      .select()
      .from(destinyUserHistory)
      .where(eq(destinyUserHistory.userId, userId))
      .orderBy(desc(destinyUserHistory.createdAt))
      .limit(limit);
  }

  async cleanupExpired(): Promise<number> {
    const db = await getDrizzleDb();
    const result = await db
      .delete(destinyMatrixResults)
      .where(lt(destinyMatrixResults.expiresAt, new Date()));

    return result.changes ?? 0;
  }

  async clearAllCache(): Promise<void> {
    const db = await getDrizzleDb();
    await db.delete(destinyMatrixResults);
    await db.delete(destinyUserHistory);
  }

  async getCacheStats(): Promise<{ totalMatrices: number; totalHistory: number }> {
    const db = await getDrizzleDb();
    const [matrices] = await db.select({ count: sql<number>`count(*)` }).from(destinyMatrixResults);
    const [history] = await db.select({ count: sql<number>`count(*)` }).from(destinyUserHistory);

    return {
      totalMatrices: matrices?.count ?? 0,
      totalHistory: history?.count ?? 0,
    };
  }
}

export const destinyCacheManager = DestinyCacheManager.getInstance();
