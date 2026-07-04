import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DestinyMatrix } from '@core/destiny-matrix/types';

type AppLanguage = 'id' | 'en';

interface AppState {
  // Current data
  currentMatrix: DestinyMatrix | null;

  // UI State
  isCalculating: boolean;
  error: string | null;

  // Settings
  language: AppLanguage;

  // Actions
  setMatrix: (matrix: DestinyMatrix | null) => void;
  setCalculating: (isCalculating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLanguage: (language: AppLanguage) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentMatrix: null,
      isCalculating: false,
      error: null,
      language: 'id',

      setMatrix: (matrix) => set({ currentMatrix: matrix, error: null }),
      setCalculating: (isCalculating) => set({ isCalculating }),
      setError: (error) => set({ error, isCalculating: false }),
      clearError: () => set({ error: null }),
      setLanguage: (language) => set({ language }),
      reset: () =>
        set({
          currentMatrix: null,
          isCalculating: false,
          error: null,
        }),
    }),
    {
      name: 'destiny-matrix-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentMatrix: state.currentMatrix,
        language: state.language,
      }),
    }
  )
);

export const selectMatrix = (state: AppState) => state.currentMatrix;
export const selectIsLoading = (state: AppState) => state.isCalculating;
export const selectError = (state: AppState) => state.error;
export const selectLanguage = (state: AppState) => state.language;
