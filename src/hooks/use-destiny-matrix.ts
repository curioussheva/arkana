import { useCallback } from 'react';
import { useAppStore } from '@store/app-store';
import { getDestinyMatrixEngine } from '@core/destiny-matrix/engine';
import { destinyCacheManager } from '@db/destiny-cache-manager';
import type { DestinyMatrix, DestinyMatrixInput } from '@core/destiny-matrix/types';

export function useDestinyMatrix() {
  const store = useAppStore();

  const calculate = useCallback(
    async (input: DestinyMatrixInput, userId: string = 'default'): Promise<DestinyMatrix> => {
      store.setCalculating(true);
      store.clearError();

      try {
        // 1. Check cache first — Destiny Matrix results never change for a
        // given birth date, so a cache hit is always safe to reuse as-is.
        const cached = await destinyCacheManager.getCachedMatrix(userId, input.birthDate);
        if (cached) {
          console.log('[DestinyMatrix] Cache hit');
          store.setMatrix(cached);
          return cached;
        }

        // 2. Calculate new matrix
        console.log('[DestinyMatrix] Calculating new matrix...');
        const engine = getDestinyMatrixEngine();
        const result = engine.calculate(input);

        // 3. Cache result
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
  };
}
