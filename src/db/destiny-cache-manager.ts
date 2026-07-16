// src/db/destiny-cache-manager.ts

import { eq, and, gte, lt, desc, sql } from 'drizzle-orm';
import { getDrizzleDb } from './index';
import { destinyMatrixResults, destinyUserHistory } from './destiny-schema';
import { MATRIX_VERSION } from '@core/destiny-matrix/constants';
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

      // 🔴 FIX: pointsJson sekarang menyimpan SELURUH objek DestinyMatrix,
      // bukan hanya `matrix.points`. Baris lama (format lama) akan gagal
      // divalidasi di bawah dan otomatis diperlakukan sebagai cache miss.
      let parsedMatrix: DestinyMatrix;
      try {
        parsedMatrix = JSON.parse(row.pointsJson) as DestinyMatrix;
      } catch {
        console.warn('[DestinyCache] Corrupt JSON, treating as cache miss');
        return null;
      }

      // 🔴 Validasi versi skema — mencegah data arcana/struktur lama
      // (dari sebelum migrasi skema) menyebabkan crash di hilir.
      if (!parsedMatrix || parsedMatrix.version !== MATRIX_VERSION) {
        console.log('[DestinyCache] Stale version, treating as cache miss');
        return null;
      }

      // 🔴 Validasi struktural minimal — pastikan field wajib benar-benar ada.
      if (!parsedMatrix.points || !parsedMatrix.destinies || !parsedMatrix.namedLines) {
        console.warn('[DestinyCache] Incomplete cached matrix, treating as cache miss');
        return null;
      }

      return parsedMatrix;
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
        // 🔴 FIX: simpan SELURUH matrix (points + destinies + namedLines + version, dst),
        // bukan hanya matrix.points seperti sebelumnya.
        pointsJson: JSON.stringify(matrix),
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
 
  /**
   * 🆕 Hapus semua cache yang bukan versi skema saat ini.
   * Berguna dipanggil sekali saat startup setelah migrasi skema besar,
   * untuk membersihkan baris-baris lama daripada dibiarkan menumpuk
   * (mereka akan tetap diabaikan oleh getCachedMatrix, tapi tidak pernah terhapus).
   */
  async cleanupStaleVersions(): Promise<number> {
    const db = await getDrizzleDb();
    const result = await db
      .delete(destinyMatrixResults)
      .where(sql`${destinyMatrixResults.version} != ${MATRIX_VERSION}`);

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