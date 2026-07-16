// src/store/app-store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DestinyMatrix } from '@core/destiny-matrix';
import {
  generateInsight,
  type DestinyInsight,
} from '@core/destiny-matrix';

const DEFAULT_PROFILE_ID = 'default';
const DEFAULT_PROFILE_NAME = 'Profil Utama';

/**
 * 🔴 PENTING: Naikkan versi ini SETIAP KALI skema ArcanaDefinition,
 * DestinyMatrix, atau struktur titik (points) berubah.
 * Ini satu-satunya cara memaksa `migrate()` membuang data lama yang stale.
 */
const PERSIST_VERSION = 6;

interface AppState {
  currentMatrix: DestinyMatrix | null;

  /**
   * Derived state.
   * Tidak dipersist, selalu diregenerasi.
   */
  insight: DestinyInsight | null;

  activeProfileId: string;
  activeProfileName: string;

  isCalculating: boolean;

  lastCalculatedAt: string | null;

  error: string | null;

  setMatrix(matrix: DestinyMatrix | null): void;

  regenerateInsight(): void;

  clearMatrix(): void;

  setCalculating(value: boolean): void;

  setError(error: string | null): void;

  clearError(): void;

  setActiveProfile(id: string, name: string): void;

  reset(): void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentMatrix: null,
      insight: null,

      activeProfileId: DEFAULT_PROFILE_ID,
      activeProfileName: DEFAULT_PROFILE_NAME,

      isCalculating: false,
      lastCalculatedAt: null,

      error: null,

      setMatrix: (matrix) =>
        set({
          currentMatrix: matrix,
          insight: matrix ? generateInsight(matrix) : null,
          lastCalculatedAt: matrix
            ? new Date().toISOString()
            : null,
          error: null,
        }),

      regenerateInsight: () => {
        const matrix = get().currentMatrix;

        set({
          insight: matrix ? generateInsight(matrix) : null,
        });
      },

      clearMatrix: () =>
        set({
          currentMatrix: null,
          insight: null,
          lastCalculatedAt: null,
        }),

      setCalculating: (isCalculating) =>
        set({
          isCalculating,
        }),

      setError: (error) =>
        set({
          error,
          isCalculating: false,
        }),

      clearError: () =>
        set({
          error: null,
        }),

      setActiveProfile: (id, name) =>
        set({
          activeProfileId: id,
          activeProfileName: name,

          currentMatrix: null,
          insight: null,
          lastCalculatedAt: null,

          error: null,
        }),

      reset: () =>
        set({
          currentMatrix: null,
          insight: null,

          isCalculating: false,
          lastCalculatedAt: null,

          error: null,
        }),
    }),
    {
      name: 'destiny-matrix-app-storage',

      version: PERSIST_VERSION,

      storage: createJSONStorage(() => AsyncStorage),

      /**
       * 🔴 FIX UTAMA:
       * Setiap kali versi tersimpan di disk LEBIH RENDAH dari PERSIST_VERSION saat ini,
       * kita TIDAK BOLEH mempercayai `currentMatrix` yang lama — terutama field
       * `arcana` di dalam setiap titik, karena skema ArcanaDefinition bisa saja
       * sudah berubah total sejak data itu disimpan (mismatch field seperti
       * 'card'/'number' vs 'tarotName'/'id' menyebabkan crash runtime yang sulit dilacak).
       *
       * Solusi paling aman: buang currentMatrix sepenuhnya dan paksa
       * regenerasi/kalkulasi ulang dari input lahir user, alih-alih mencoba
       * "menyembuhkan" struktur lama secara manual.
       */
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<AppState>;

        if (version < PERSIST_VERSION) {
          if (__DEV__) {
            console.warn(
              `[AppStore] 🔄 Migrasi dari versi ${version} ke ${PERSIST_VERSION}. ` +
              `currentMatrix lama dibuang untuk mencegah stale-schema crash.`
            );
          }

          return {
            ...state,
            currentMatrix: null,
            insight: null,
            lastCalculatedAt: null,
          };
        }

        return {
          ...state,
          insight: null,
          lastCalculatedAt: null,
        };
      },

      partialize: (state) => ({
        /**
         * Hanya persist source of truth.
         */
        currentMatrix: state.currentMatrix,

        activeProfileId: state.activeProfileId,
        activeProfileName: state.activeProfileName,
      }),
    }
  )
);

// ---------------- Selectors ----------------

export const selectMatrix = (state: AppState) =>
  state.currentMatrix;

export const selectInsight = (state: AppState) =>
  state.insight;

export const selectAdvancedAnalysis = (state: AppState) =>
  state.insight?.advanced ?? null;

export const selectNarrative = (state: AppState) =>
  state.insight?.narrative ?? null;

export const selectElements = (state: AppState) =>
  state.insight?.elements ?? null;

export const selectNamedLines = (state: AppState) =>
  state.insight?.namedLines ?? null;

export const selectIsCalculating = (state: AppState) =>
  state.isCalculating;

export const selectError = (state: AppState) =>
  state.error;

export const selectActiveProfileId = (state: AppState) =>
  state.activeProfileId;

export const selectActiveProfileName = (state: AppState) =>
  state.activeProfileName;

export const selectLastCalculatedAt = (state: AppState) =>
  state.lastCalculatedAt; 