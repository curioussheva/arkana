// src/hooks/useDestinyMatrix.ts

import { useCallback } from 'react';
import { useAppStore } from '@store/app-store';
import { getDestinyMatrixEngine } from '@core/destiny-matrix/engine';
import { MATRIX_VERSION } from '@core/destiny-matrix/constants';
import { destinyCacheManager } from '@db/destiny-cache-manager';
import type { DestinyMatrix, DestinyMatrixInput } from '@core/destiny-matrix/types';
 
export function useDestinyMatrix() {
  const store = useAppStore();

  const calculate = useCallback(
    async (input: DestinyMatrixInput, userId: string = 'default'): Promise<DestinyMatrix> => {
      store.setCalculating(true);
      store.clearError();

      try {
        const cached = await destinyCacheManager.getCachedMatrix(userId, input.birthDate);

        // 🔴 Validasi tambahan di layer hook, sebagai lapis pertahanan kedua
        // selain validasi yang sudah dilakukan di dalam destinyCacheManager.
        if (cached && cached.version === MATRIX_VERSION) {
          console.log('[DestinyMatrix] Cache hit');
          store.setMatrix(cached);
          return cached;
        }

        if (cached) {
          console.log('[DestinyMatrix] Cache stale (version mismatch), recalculating...');
        } else {
          console.log('[DestinyMatrix] Cache miss, calculating new matrix...');
        }

        const engine = getDestinyMatrixEngine();
        const result = engine.calculate(input);

        await destinyCacheManager.cacheMatrix(userId, result);
        await destinyCacheManager.logAction(userId, 'calculate', {
          birthDate: input.birthDate,
        });

        store.setMatrix(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Calculation failed';
        store.setError(message);
        throw err;
      } finally {
        store.setCalculating(false);
      }
    },
    [store]
  );

  return {
    calculate,
    isLoading: store.isCalculating,
    matrix: store.currentMatrix,
    error: store.error,

    // ==========================================================
    // TAMBAHAN DATA NARASI DAN WAWASAN MENDALAM (INSIGHT)
    // ==========================================================
    insight: store.insight,
    narrative: store.insight?.narrative ?? null,
    advancedAnalysis: store.insight?.advanced ?? null,
    namedLines: store.insight?.namedLines ?? null,
    elements: store.insight?.elements ?? null,
    activeProfileName: store.activeProfileName,
  };
}