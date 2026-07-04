import { useCallback, useState } from 'react';
import { useAppStore } from '@store/app-store';
import { getEngine } from '@core/numerology/engine';
import { getAI } from '@ai/onnx-engine';
import { cacheManager } from '@db/cache-manager';
import type { NumerologyInput, EnergyMatrix, AIInsight } from '@core/numerology/types';

export function useNumerology() {
  const store = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const calculate = useCallback(
    async (input: NumerologyInput, userId: string = 'default'): Promise<EnergyMatrix> => {
      setIsLoading(true);
      store.setCalculating(true);
      store.clearError();

      try {
        // 1. Check cache first
        const cached = await cacheManager.getCachedMatrix(userId, input.birthDate, input.name);
        if (cached) {
          console.log('[Numerology] Cache hit');
          store.setMatrix(cached);
          store.setCalculating(false);
          setIsLoading(false);
          return cached;
        }

        // 2. Calculate new matrix
        console.log('[Numerology] Calculating new matrix...');
        const engine = getEngine(store.options);
        const matrix = engine.calculate(input);

        // 3. Cache result
        await cacheManager.cacheMatrix(userId, matrix);
        await cacheManager.logAction(userId, 'calculate', {
          birthDate: input.birthDate,
          name: input.name,
        });

        store.setMatrix(matrix);
        return matrix;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Calculation failed';
        store.setError(message);
        throw error;
      } finally {
        store.setCalculating(false);
        setIsLoading(false);
      }
    },
    [store]
  );

  const generateInsight = useCallback(
    // TODO: userId will be needed once cacheInsight() is wired up below
    // with a real matrixId lookup. Prefixed with `_` until then.
    async (matrix: EnergyMatrix, _userId: string = 'default'): Promise<AIInsight> => {
      store.setGeneratingInsight(true);
      store.clearError();

      try {
        // 1. Check cache
        // Note: We need matrix ID from cache, simplified here
        // In production, retrieve matrix ID from cacheManager

        // 2. Generate new insight
        console.log('[Numerology] Generating AI insight...');
        const ai = getAI();
        await ai.initialize();
        const insight = await ai.interpret(matrix);

        // 3. Cache insight (simplified - would need matrix ID)
        // await cacheManager.cacheInsight(matrixId, ...);

        store.setInsight(insight);
        return insight;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Insight generation failed';
        store.setError(message);
        throw error;
      } finally {
        store.setGeneratingInsight(false);
      }
    },
    [store]
  );

  const calculateWithInsight = useCallback(
    async (input: NumerologyInput, userId: string = 'default') => {
      const matrix = await calculate(input, userId);
      const insight = await generateInsight(matrix, userId);
      return { matrix, insight };
    },
    [calculate, generateInsight]
  );

  return {
    calculate,
    generateInsight,
    calculateWithInsight,
    isLoading,
    matrix: store.currentMatrix,
    insight: store.currentInsight,
    error: store.error,
    options: store.options,
    setOptions: store.setOptions,
  };
}
 