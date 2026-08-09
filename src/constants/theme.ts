// src/constants/theme.ts

export const LIGHT_COLORS = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  backgroundLight: '#FFFFFF',
  backgroundLighter: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  surfaceDark: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  border: '#E2E8F0',
  borderLight: '#CBD5E1',
};

export const DARK_COLORS = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#0F172A',
  backgroundLight: '#1E293B',
  backgroundLighter: '#334155',
  surface: '#1E293B',
  surfaceLight: '#334155',
  surfaceDark: '#0F172A',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#334155',
  borderLight: '#475569',
};

export const COMMON_COLORS = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  energy: {
    low: '#3B82F6',
    medium: '#F59E0B',
    high: '#EF4444',
    peak: '#8B5CF6',
  },
  elements: {
    fire: '#EF4444',
    water: '#3B82F6',
    air: '#94A3B8',
    earth: '#10B981',
  },
  tarot: {
    mysticalGlow: 'rgba(212, 175, 55, 0.45)',
  },
};

export const COLORS = {
  ...DARK_COLORS,
  ...COMMON_COLORS,
  fire: COMMON_COLORS.elements.fire,
  water: COMMON_COLORS.elements.water,
  air: COMMON_COLORS.elements.air,
  earth: COMMON_COLORS.elements.earth,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
  '3xl': 32,
  '4xl': 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
  '2xl': 20,
  '3xl': 28,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'easeInOut' as const,
    bounce: 'bounce' as const,
    spring: 'spring' as const,
  },
};
