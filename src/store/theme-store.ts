import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { THEMES, DEFAULT_THEME } from '@constants/themes';
import type { ThemeVariant, Theme } from '../types/theme';

interface ThemeState {
  currentTheme: ThemeVariant;
  customThemes: Record<string, Partial<Theme>>;
  useSystemTheme: boolean;

  setTheme: (theme: ThemeVariant) => void;
  toggleUseSystemTheme: () => void;
  getTheme: () => Theme;
  getColors: () => Theme['colors'];
  isDark: () => boolean;
  syncSystemTheme: (colorScheme: 'light' | 'dark') => void; // ← tambahkan ini
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: DEFAULT_THEME,
      customThemes: {},
      useSystemTheme: false,

      setTheme: theme => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        set({ currentTheme: theme });
      },

      toggleUseSystemTheme: () => {
        set(state => {
          const newUse = !state.useSystemTheme;
          return { useSystemTheme: newUse };
        });
      },

      // Fungsi yang akan dipanggil dari App.tsx
      syncSystemTheme: (colorScheme: 'light' | 'dark') => {
        const state = get();
        if (state.useSystemTheme) {
          const matchingTheme = Object.values(THEMES).find(t => t.mode === colorScheme);
          if (matchingTheme) {
            set({ currentTheme: matchingTheme.id });
          }
        }
      },

      getTheme: () => {
        const { currentTheme } = get();
        return THEMES[currentTheme];
      },

      getColors: () => {
        return get().getTheme().colors;
      },

      isDark: () => {
        return get().getTheme().mode === 'dark';
      },
    }),
    {
      name: 'arkana-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        currentTheme: state.currentTheme,
        useSystemTheme: state.useSystemTheme,
      }),
    }
  )
);
