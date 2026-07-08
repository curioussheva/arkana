// src/store/app-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DestinyMatrix } from '@core/destiny-matrix/types';
import { analyzeAdvancedInsights, AdvancedAnalysisResult } from '@core/destiny-matrix/advanced-analysis';

const DEFAULT_PROFILE_ID = 'default';
const DEFAULT_PROFILE_NAME = 'Profil Utama';

// Kita naikkan versi menjadi 3 karena ada penambahan struktur data baru (advancedAnalysis)
const PERSIST_VERSION = 3;

interface AppState {
  currentMatrix: DestinyMatrix | null;
  advancedAnalysis: AdvancedAnalysisResult | null; // Tambahan state analisis mendalam
  activeProfileId: string;
  activeProfileName: string;
  isCalculating: boolean;
  error: string | null;

  setMatrix: (matrix: DestinyMatrix | null) => void;
  setCalculating: (isCalculating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setActiveProfile: (id: string, name: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentMatrix: null,
      advancedAnalysis: null,
      activeProfileId: DEFAULT_PROFILE_ID,
      activeProfileName: DEFAULT_PROFILE_NAME,
      isCalculating: false,
      error: null,

      // Otomatis menghitung advanced analysis ketika matrix diset
      setMatrix: (matrix) => set({ 
        currentMatrix: matrix, 
        advancedAnalysis: matrix ? analyzeAdvancedInsights(matrix) : null,
        error: null 
      }),
      setCalculating: (isCalculating) => set({ isCalculating }),
      setError: (error) => set({ error, isCalculating: false }),
      clearError: () => set({ error: null }),
      setActiveProfile: (id, name) =>
        set({ activeProfileId: id, activeProfileName: name, currentMatrix: null, advancedAnalysis: null }),
      reset: () =>
        set({
          currentMatrix: null,
          advancedAnalysis: null,
          isCalculating: false,
          error: null,
        }),
    }),
    {
      name: 'destiny-matrix-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: PERSIST_VERSION,
      migrate: (persistedState) => {
        return {
          ...(persistedState as AppState),
          currentMatrix: null,
          advancedAnalysis: null, // Reset aman jika ada ketidakcocokan versi storage lama
        };
      },
      partialize: (state) => ({
        currentMatrix: state.currentMatrix,
        advancedAnalysis: state.advancedAnalysis, // Pastikan ikut dipersist
        activeProfileId: state.activeProfileId,
        activeProfileName: state.activeProfileName,
      }),
    }
  )
);

export const selectMatrix = (state: AppState) => state.currentMatrix;
export const selectAdvancedAnalysis = (state: AppState) => state.advancedAnalysis;
export const selectIsLoading = (state: AppState) => state.isCalculating;
export const selectError = (state: AppState) => state.error;
export const selectActiveProfileId = (state: AppState) => state.activeProfileId;
export const selectActiveProfileName = (state: AppState) => state.activeProfileName;
 