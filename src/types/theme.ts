// src/types/theme.ts
export type ThemeMode = 'dark' | 'light';

export type ThemeVariant = 
  | 'mysticMidnight'   // Default - deep purple dark
  | 'celestialGold'    // Luxury gold dark
  | 'etherealLight'    // Soft pastel light
  | 'voidAbyss'        // Pure black
  | 'forestWisdom'     // Earth tones dark
  | 'oceanMystery'     // Deep blue dark
  | 'crystalDawn'      // Crystal light
  | 'crimsonShadow';   // Red dark

export interface ThemeColors {
  // Core
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Background
  background: string;
  backgroundLight: string;
  backgroundLighter: string;
  
  // Surface
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Border
  border: string;
  borderLight: string;
  
  // Status
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Energy
  energy: {
    low: string;
    medium: string;
    high: string;
    peak: string;
  };
  
  // Elements
  elements: {
    fire: string;
    water: string;
    air: string;
    earth: string;
  };
  
  // Tarot-specific
  tarot: {
    majorArcana: string;
    minorArcana: string;
    cardBorder: string;
    mysticalGlow: string;
  };
  
  // Gradient pairs
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