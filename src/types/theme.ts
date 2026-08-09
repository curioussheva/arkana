// src/types/theme.ts
export type ThemeMode = 'dark' | 'light';

export type ThemeVariant =
  | 'mysticMidnight'
  | 'celestialGold'
  | 'etherealLight'
  | 'voidAbyss'
  | 'forestWisdom'
  | 'oceanMystery'
  | 'crystalDawn'
  | 'crimsonShadow'
  | 'goldenDawn'
  | 'springBloom'
  | 'roseQuartz'
  | 'azureMist'
  | 'warmSand'
  | 'lilacHaze'
  | 'auroraNight'
  | 'victoriaGold';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  background: string;
  backgroundLight: string;
  backgroundLighter: string;
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  energy: {
    low: string;
    medium: string;
    high: string;
    peak: string;
  };
  elements: {
    fire: string;
    water: string;
    air: string;
    earth: string;
  };
  tarot: {
    majorArcana: string;
    minorArcana: string;
    cardBorder: string;
    mysticalGlow: string;
  };
  gradients: {
    cardGradient: [string, string];
    headerGradient: [string, string];
    buttonGradient: [string, string];
  };
}

export interface Theme {
  id: ThemeVariant;
  name: string;
  mode: ThemeMode;
  colors: ThemeColors;
  metadata: {
    description: string;
    icon: string;
    preview: string;
    planet: string;
    crystal: string;
  };
}
