import { create } from 'zustand';
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
