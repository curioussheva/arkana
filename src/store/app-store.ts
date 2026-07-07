import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DestinyMatrix } from '@core/destiny-matrix/types';

const DEFAULT_PROFILE_ID = 'default';
const DEFAULT_PROFILE_NAME = 'Profil Utama';

// Bump this whenever DestinyMatrix's shape changes incompatibly (e.g.
// adding new points). Old persisted matrices that don't match get
// discarded automatically instead of crashing the app on load.
const PERSIST_VERSION = 2;

interface AppState {
  currentMatrix: DestinyMatrix | null;
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
      activeProfileId: DEFAULT_PROFILE_ID,
      activeProfileName: DEFAULT_PROFILE_NAME,
      isCalculating: false,
      error: null,

      setMatrix: (matrix) => set({ currentMatrix: matrix, error: null }),
      setCalculating: (isCalculating) => set({ isCalculating }),
      setError: (error) => set({ error, isCalculating: false }),
      clearError: () => set({ error: null }),
      setActiveProfile: (id, name) =>
        set({ activeProfileId: id, activeProfileName: name, currentMatrix: null }),
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
      version: PERSIST_VERSION,
      // Any version mismatch (including very old un-versioned state,
      // which zustand treats as version 0) is treated as incompatible.
      // Rather than trying to patch old point shapes, we just drop the
      // stale matrix — it's a cache, cheap to recalculate.
      migrate: (persistedState) => {
        return {
          ...(persistedState as AppState),
          currentMatrix: null,
        };
      },
      partialize: (state) => ({
        currentMatrix: state.currentMatrix,
        activeProfileId: state.activeProfileId,
        activeProfileName: state.activeProfileName,
      }),
    }
  )
);

export const selectMatrix = (state: AppState) => state.currentMatrix;
export const selectIsLoading = (state: AppState) => state.isCalculating;
export const selectError = (state: AppState) => state.error;
export const selectActiveProfileId = (state: AppState) => state.activeProfileId;
export const selectActiveProfileName = (state: AppState) => state.activeProfileName;
