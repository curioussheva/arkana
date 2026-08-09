// src/hooks/useDestinyMatrix.ts

import { useCallback } from 'react';
import {
  useAppStore,
  selectMatrix,
  selectInsight,
  selectActiveProfileName,
  selectIsCalculating,
  selectError,
} from '@store/app-store';
import { getDestinyMatrixEngine } from '@core/destiny-matrix/engine';
import { MATRIX_VERSION } from '@core/destiny-matrix/constants';
import { destinyCacheManager } from '@db/destiny-cache-manager';
import type { DestinyMatrix, DestinyMatrixInput } from '@core/destiny-matrix/types';

export function useDestinyMatrix() {
  const matrix = useAppStore(selectMatrix);
  const insight = useAppStore(selectInsight);
  const isLoading = useAppStore(selectIsCalculating);
  const error = useAppStore(selectError);
  const activeProfileName = useAppStore(selectActiveProfileName);

  const setMatrix = useAppStore(state => state.setMatrix);
  const setCalculating = useAppStore(state => state.setCalculating);
  const setError = useAppStore(state => state.setError);
  const clearError = useAppStore(state => state.clearError);

  const calculate = useCallback(
    async (input: DestinyMatrixInput, userId: string = 'default'): Promise<DestinyMatrix> => {
      if (!input?.birthDate) {
        const validationError = 'Tanggal lahir wajib diisi (YYYY-MM-DD).';
        setError(validationError);
        throw new Error(validationError);
      }

      setCalculating(true);
      clearError();

      try {
        // 1. Coba baca dari Cache (dengan penanganan error storage terisolasi)
        let cached: DestinyMatrix | null = null;
        try {
          cached = await destinyCacheManager.getCachedMatrix(userId, input.birthDate);
        } catch (cacheReadError) {
          console.warn(
            '[DestinyMatrix] Gagal membaca cache, melanjutkan kalkulasi langsung:',
            cacheReadError
          );
        }

        // 2. Evaluasi Validitas Cache
        if (cached && cached.version === MATRIX_VERSION) {
          console.log('[DestinyMatrix] Cache Hit');
          setMatrix(cached);
          return cached;
        }

        if (cached) {
          console.log('[DestinyMatrix] Cache usang (perbedaan versi), menghitung ulang...');
        } else {
          console.log('[DestinyMatrix] Cache Miss, menghitung matriks baru...');
        }

        // 3. Kalkulasi Matriks menggunakan Singleton Engine
        const engine = getDestinyMatrixEngine();
        const result = engine.calculate(input);

        // 4. Simpan ke Cache dan Log Aktivitas secara Asinkron (Non-blocking)
        destinyCacheManager.cacheMatrix(userId, result).catch(err => {
          console.warn('[DestinyMatrix] Gagal menyimpan hasil ke cache:', err);
        });

        destinyCacheManager
          .logAction(userId, 'calculate', {
            birthDate: input.birthDate,
          })
          .catch(err => {
            console.warn('[DestinyMatrix] Gagal mencatat log aktivitas:', err);
          });

        // 5. Update Global Store State
        setMatrix(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Kalkulasi Matriks Takdir gagal.';
        setError(message);
        throw err;
      } finally {
        setCalculating(false);
      }
    },
    [setMatrix, setCalculating, setError, clearError]
  );

  return {
    calculate,
    isLoading,
    matrix,
    error,

    // DATA INSIGHT & NARASI UNTUK REUSABLE UI
    insight,
    narrative: insight?.narrative ?? null,
    advancedAnalysis: insight?.advanced ?? null,
    namedLines: insight?.namedLines ?? null,
    elements: insight?.elements ?? null,
    activeProfileName,
  };
}
