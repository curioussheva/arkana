import os

# Perbaikan: Menggunakan penyimpanan lokal Termux yang aman dari Permission Error
project_root = "/data/data/com.termux/files/home/arkana/numerology-engine"


# Create src/store/app-store.ts
store_ts = """import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EnergyMatrix, AIInsight, CalculationOptions } from '@core/numerology/types';

// ─── State Interface ────────────────────────────────────────────

interface AppState {
  // Current data
  currentMatrix: EnergyMatrix | null;
  currentInsight: AIInsight | null;
  
  // UI State
  isCalculating: boolean;
  isGeneratingInsight: boolean;
  error: string | null;
  
  // Settings
  options: CalculationOptions;
  
  // Actions
  setMatrix: (matrix: EnergyMatrix | null) => void;
  setInsight: (insight: AIInsight | null) => void;
  setCalculating: (isCalculating: boolean) => void;
  setGeneratingInsight: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setOptions: (options: Partial<CalculationOptions>) => void;
  clearError: () => void;
  reset: () => void;
}

// ─── Default Options ────────────────────────────────────────────

const defaultOptions: CalculationOptions = {
  system: 'pythagorean',
  includeMasterNumbers: true,
  includeKarmicDebt: true,
  language: 'id',
};

// ─── Store ──────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentMatrix: null,
      currentInsight: null,
      isCalculating: false,
      isGeneratingInsight: false,
      error: null,
      options: defaultOptions,
      
      // Actions
      setMatrix: (matrix) => set({ currentMatrix: matrix, error: null }),
      setInsight: (insight) => set({ currentInsight: insight, error: null }),
      setCalculating: (isCalculating) => set({ isCalculating }),
      setGeneratingInsight: (isGeneratingInsight) => set({ isGeneratingInsight }),
      setError: (error) => set({ error, isCalculating: false, isGeneratingInsight: false }),
      setOptions: (newOptions) =>
        set((state) => ({
          options: { ...state.options, ...newOptions },
        })),
      clearError: () => set({ error: null }),
      reset: () =>
        set({
          currentMatrix: null,
          currentInsight: null,
          isCalculating: false,
          isGeneratingInsight: false,
          error: null,
        }),
    }),
    {
      name: 'numerology-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        options: state.options,
      }),
    }
  )
);

// ─── Selectors ──────────────────────────────────────────────────

export const selectMatrix = (state: AppState) => state.currentMatrix;
export const selectInsight = (state: AppState) => state.currentInsight;
export const selectIsLoading = (state: AppState) =>
  state.isCalculating || state.isGeneratingInsight;
export const selectError = (state: AppState) => state.error;
export const selectOptions = (state: AppState) => state.options;
"""

with open(f"{project_root}/src/store/app-store.ts", "w") as f:
    f.write(store_ts)

# Create src/store/index.ts
store_index = """export * from './app-store';
"""

with open(f"{project_root}/src/store/index.ts", "w") as f:
    f.write(store_index)

# Create src/hooks/use-numerology.ts
use_numerology = """import { useCallback, useState } from 'react';
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
    async (matrix: EnergyMatrix, userId: string = 'default'): Promise<AIInsight> => {
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
"""

with open(f"{project_root}/src/hooks/use-numerology.ts", "w") as f:
    f.write(use_numerology)

# Create src/hooks/use-timeline.ts
use_timeline = """import { useMemo } from 'react';
import { getEngine } from '@core/numerology/engine';
import { generateTimelineDates } from '@core/utils/date-utils';
import type { TimelineData, NumerologyInput } from '@core/numerology/types';

export function useTimeline(input: NumerologyInput, days: number = 30): TimelineData[] {
  return useMemo(() => {
    const engine = getEngine();
    const dates = generateTimelineDates(days);
    
    return dates.map((date) => {
      // Calculate numerology for this specific date
      const dateStr = date.toISOString().split('T')[0];
      const matrix = engine.calculate({
        ...input,
        birthDate: dateStr, // Override with timeline date for calculation
      });
      
      return {
        date: dateStr,
        personalYear: matrix.matrix.personalYear,
        personalMonth: matrix.matrix.personalMonth,
        personalDay: matrix.matrix.personalDay,
        intensity: matrix.energyGrid.summary.intensity,
      };
    });
  }, [input.birthDate, input.name, days]);
}
"""

with open(f"{project_root}/src/hooks/use-timeline.ts", "w") as f:
    f.write(use_timeline)

# Create src/hooks/index.ts
hooks_index = """export * from './use-numerology';
export * from './use-timeline';
"""

with open(f"{project_root}/src/hooks/index.ts", "w") as f:
    f.write(hooks_index)

print("✅ Store and hooks created:")
print("   - src/store/app-store.ts (Zustand + persist)")
print("   - src/store/index.ts")
print("   - src/hooks/use-numerology.ts")
print("   - src/hooks/use-timeline.ts")
print("   - src/hooks/index.ts")