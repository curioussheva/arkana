// src/store/theme-store.ts
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
  
  // Actions
  setTheme: (theme: ThemeVariant) => void;
  toggleUseSystemTheme: () => void;
  getTheme: () => Theme;
  getColors: () => Theme['colors'];
  isDark: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: DEFAULT_THEME,
      customThemes: {},
      useSystemTheme: false,
      
      setTheme: (theme) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        set({ currentTheme: theme });
      },
      
      toggleUseSystemTheme: () => {
        set(state => ({ useSystemTheme: !state.useSystemTheme }));
      },
      
      getTheme: () => {
        const { currentTheme, customThemes } = get();
        const baseTheme = THEMES[currentTheme];
        const customOverrides = customThemes[currentTheme] || {};
        return { ...baseTheme, ...customOverrides } as Theme;
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
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        useSystemTheme: state.useSystemTheme,
      }),
    }
  )
);