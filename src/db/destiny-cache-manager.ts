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
        // 🔴 FIX UTAMA: tanpa orderBy, SQLite mengembalikan baris sesuai insertion
        // order (rowid), sehingga baris TERLAMA yang selalu ditemukan duluan —
        // bukan baris terbaru hasil kalkulasi ulang setelah version bump.
        // Ini menyebabkan cache selalu tampak "stale" meski baris valid sudah ada.
        .orderBy(desc(destinyMatrixResults.calculatedAt))
        .limit(1);

      if (cached.length === 0) return null;

      const row = cached[0];

      let parsedMatrix: DestinyMatrix;
      try {
        parsedMatrix = JSON.parse(row.pointsJson) as DestinyMatrix;
      } catch {
        console.warn('[DestinyCache] Corrupt JSON, treating as cache miss');
        return null;
      }

      // Validasi versi skema — mencegah data arcana/struktur lama
      // (dari sebelum migrasi skema) menyebabkan crash di hilir.
      if (!parsedMatrix || parsedMatrix.version !== MATRIX_VERSION) {
        console.log('[DestinyCache] Stale version, treating as cache miss — deleting stale row');
        // 🔴 FIX: hapus baris usang ini alih-alih membiarkannya menumpuk selamanya
        // di tabel (baris lama tidak pernah otomatis expired hingga 1 tahun).
        try {
          await db.delete(destinyMatrixResults).where(eq(destinyMatrixResults.id, row.id));
        } catch (deleteErr) {
          console.warn('[DestinyCache] Gagal menghapus baris stale:', deleteErr);
        }
        return null;
      }

      // Validasi struktural minimal — pastikan field wajib benar-benar ada.
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

    // 🔴 FIX: hapus baris lama untuk kombinasi userId+birthDate yang sama
    // sebelum insert baris baru — mencegah penumpukan banyak baris duplikat
    // untuk profil yang sama tiap kali dihitung ulang (mis. tiap version bump).
    try {
      await db
        .delete(destinyMatrixResults)
        .where(
          and(
            eq(destinyMatrixResults.userId, userId),
            eq(destinyMatrixResults.birthDate, matrix.input.birthDate)
          )
        );
    } catch (cleanupErr) {
      console.warn('[DestinyCache] Gagal membersihkan baris lama sebelum insert:', cleanupErr);
    }

    const result = await db
      .insert(destinyMatrixResults)
      .values({
        userId,
        birthDate: matrix.input.birthDate,
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

  async getHistory(
    userId: string,
    limit: number = 50
  ): Promise<(typeof destinyUserHistory.$inferSelect)[]> {
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
   * Hapus semua cache yang bukan versi skema saat ini.
   * Berguna dipanggil sekali saat startup setelah migrasi skema besar,
   * untuk membersihkan baris-baris lama daripada dibiarkan menumpuk
   * (mereka akan tetap diabaikan oleh getCachedMatrix, tapi tidak pernah terhapus
   * kecuali lewat jalur delete-on-read yang baru ditambahkan di atas).
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
