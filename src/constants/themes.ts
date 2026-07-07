// src/constants/themes.ts
import type { Theme, ThemeVariant } from '../types/theme';

export const THEMES: Record<ThemeVariant, Theme> = {
  mysticMidnight: {
    id: 'mysticMidnight',
    name: 'Mystic Midnight',
    mode: 'dark',
    colors: {
      primary: '#8B5CF6',
      primaryLight: '#A78BFA',
      primaryDark: '#7C3AED',
      secondary: '#EC4899',
      secondaryLight: '#F472B6',
      secondaryDark: '#DB2777',
      accent: '#F59E0B',
      accentLight: '#FBBF24',
      accentDark: '#D97706',
      
      background: '#0F172A',
      backgroundLight: '#1E293B',
      backgroundLighter: '#334155',
      
      surface: '#1E293B',
      surfaceLight: '#334155',
      surfaceDark: '#0F172A',
      
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#64748B',
      
      border: '#334155',
      borderLight: '#475569',
      
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      
      energy: {
        low: '#60A5FA',
        medium: '#FBBF24',
        high: '#F87171',
        peak: '#A78BFA',
      },
      
      elements: {
        fire: '#F87171',
        water: '#60A5FA',
        air: '#94A3B8',
        earth: '#34D399',
      },
      
      tarot: {
        majorArcana: '#C084FC',
        minorArcana: '#94A3B8',
        cardBorder: '#4C1D95',
        mysticalGlow: 'rgba(139, 92, 246, 0.3)',
      },
      
      gradients: {
        cardGradient: ['#1E1B4B', '#312E81'],
        headerGradient: ['#2E1065', '#1E1B4B'],
        buttonGradient: ['#8B5CF6', '#7C3AED'],
      },
    },
    metadata: {
      description: 'Deep purple night with mystical energy',
      icon: '🌙',
      preview: '#8B5CF6',
      planet: 'Neptune',
      crystal: 'Amethyst',
    },
  },
  
  celestialGold: {
    id: 'celestialGold',
    name: 'Celestial Gold',
    mode: 'dark',
    colors: {
      primary: '#D4AF37',
      primaryLight: '#E5C158',
      primaryDark: '#B8960F',
      secondary: '#B8860B',
      secondaryLight: '#DAA520',
      secondaryDark: '#8B6508',
      accent: '#FFD700',
      accentLight: '#FFE44D',
      accentDark: '#CCA600',
      
      background: '#1A1110',
      backgroundLight: '#2C1810',
      backgroundLighter: '#3D2015',
      
      surface: '#2C1810',
      surfaceLight: '#3D2015',
      surfaceDark: '#1A1110',
      
      text: '#FFF8DC',
      textSecondary: '#DAA520',
      textMuted: '#8B7355',
      
      border: '#3D2015',
      borderLight: '#5C3A28',
      
      success: '#228B22',
      warning: '#DAA520',
      error: '#8B0000',
      info: '#4169E1',
      
      energy: {
        low: '#4169E1',
        medium: '#DAA520',
        high: '#DC143C',
        peak: '#D4AF37',
      },
      
      elements: {
        fire: '#DC143C',
        water: '#4169E1',
        air: '#C0C0C0',
        earth: '#228B22',
      },
      
      tarot: {
        majorArcana: '#FFD700',
        minorArcana: '#C0C0C0',
        cardBorder: '#D4AF37',
        mysticalGlow: 'rgba(212, 175, 55, 0.4)',
      },
      
      gradients: {
        cardGradient: ['#2C1810', '#1A1110'],
        headerGradient: ['#3D2015', '#2C1810'],
        buttonGradient: ['#D4AF37', '#B8960F'],
      },
    },
    metadata: {
      description: 'Luxurious gold with ancient wisdom',
      icon: '✨',
      preview: '#D4AF37',
      planet: 'Sun',
      crystal: 'Citrine',
    },
  },
  
  etherealLight: {
    id: 'etherealLight',
    name: 'Ethereal Light',
    mode: 'light',
    colors: {
      primary: '#C084FC',
      primaryLight: '#D8B4FE',
      primaryDark: '#A855F7',
      secondary: '#F9A8D4',
      secondaryLight: '#FBCFE8',
      secondaryDark: '#EC4899',
      accent: '#FDE68A',
      accentLight: '#FEF3C7',
      accentDark: '#F59E0B',
      
      background: '#FAF5FF',
      backgroundLight: '#F3E8FF',
      backgroundLighter: '#E9D5FF',
      
      surface: '#FFFFFF',
      surfaceLight: '#FAF5FF',
      surfaceDark: '#F3E8FF',
      
      text: '#4A1D96',
      textSecondary: '#7C3AED',
      textMuted: '#A78BFA',
      
      border: '#E9D5FF',
      borderLight: '#D8B4FE',
      
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
      
      energy: {
        low: '#60A5FA',
        medium: '#FBBF24',
        high: '#F87171',
        peak: '#A78BFA',
      },
      
      elements: {
        fire: '#EF4444',
        water: '#3B82F6',
        air: '#9CA3AF',
        earth: '#10B981',
      },
      
      tarot: {
        majorArcana: '#8B5CF6',
        minorArcana: '#9CA3AF',
        cardBorder: '#C084FC',
        mysticalGlow: 'rgba(192, 132, 252, 0.3)',
      },
      
      gradients: {
        cardGradient: ['#F3E8FF', '#E9D5FF'],
        headerGradient: ['#E9D5FF', '#D8B4FE'],
        buttonGradient: ['#C084FC', '#A855F7'],
      },
    },
    metadata: {
      description: 'Soft pastel with angelic presence',
      icon: '🕊️',
      preview: '#C084FC',
      planet: 'Venus',
      crystal: 'Rose Quartz',
    },
  },
  
  voidAbyss: {
    id: 'voidAbyss',
    name: 'Void Abyss',
    mode: 'dark',
    colors: {
      primary: '#6B21A8',
      primaryLight: '#7E22CE',
      primaryDark: '#581C87',
      secondary: '#4C1D95',
      secondaryLight: '#5B21B6',
      secondaryDark: '#3B0764',
      accent: '#A855F7',
      accentLight: '#C084FC',
      accentDark: '#7E22CE',
      
      background: '#000000',
      backgroundLight: '#09090B',
      backgroundLighter: '#18181B',
      
      surface: '#09090B',
      surfaceLight: '#18181B',
      surfaceDark: '#000000',
      
      text: '#FAFAFA',
      textSecondary: '#A1A1AA',
      textMuted: '#52525B',
      
      border: '#27272A',
      borderLight: '#3F3F46',
      
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      info: '#3B82F6',
      
      energy: {
        low: '#3B82F6',
        medium: '#EAB308',
        high: '#EF4444',
        peak: '#A855F7',
      },
      
      elements: {
        fire: '#EF4444',
        water: '#3B82F6',
        air: '#71717A',
        earth: '#22C55E',
      },
      
      tarot: {
        majorArcana: '#A855F7',
        minorArcana: '#71717A',
        cardBorder: '#6B21A8',
        mysticalGlow: 'rgba(107, 33, 168, 0.4)',
      },
      
      gradients: {
        cardGradient: ['#09090B', '#000000'],
        headerGradient: ['#18181B', '#09090B'],
        buttonGradient: ['#6B21A8', '#581C87'],
      },
    },
    metadata: {
      description: 'Pure darkness with purple void energy',
      icon: '🕳️',
      preview: '#6B21A8',
      planet: 'Pluto',
      crystal: 'Obsidian',
    },
  },
  
  forestWisdom: {
    id: 'forestWisdom',
    name: 'Forest Wisdom',
    mode: 'dark',
    colors: {
      primary: '#059669',
      primaryLight: '#10B981',
      primaryDark: '#047857',
      secondary: '#65A30D',
      secondaryLight: '#84CC16',
      secondaryDark: '#4D7C0F',
      accent: '#D97706',
      accentLight: '#F59E0B',
      accentDark: '#B45309',
      
      background: '#0F1F0F',
      backgroundLight: '#1A2E1A',
      backgroundLighter: '#243524',
      
      surface: '#1A2E1A',
      surfaceLight: '#243524',
      surfaceDark: '#0F1F0F',
      
      text: '#ECFDF5',
      textSecondary: '#A7F3D0',
      textMuted: '#6EE7B7',
      
      border: '#064E3B',
      borderLight: '#065F46',
      
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      
      energy: {
        low: '#6EE7B7',
        medium: '#FCD34D',
        high: '#FCA5A5',
        peak: '#10B981',
      },
      
      elements: {
        fire: '#EF4444',
        water: '#3B82F6',
        air: '#9CA3AF',
        earth: '#059669',
      },
      
      tarot: {
        majorArcana: '#34D399',
        minorArcana: '#6B7280',
        cardBorder: '#047857',
        mysticalGlow: 'rgba(5, 150, 105, 0.3)',
      },
      
      gradients: {
        cardGradient: ['#1A2E1A', '#0F1F0F'],
        headerGradient: ['#064E3B', '#065F46'],
        buttonGradient: ['#059669', '#047857'],
      },
    },
    metadata: {
      description: 'Ancient forest with earthly wisdom',
      icon: '🌲',
      preview: '#059669',
      planet: 'Earth',
      crystal: 'Moss Agate',
    },
  },
  
  oceanMystery: {
    id: 'oceanMystery',
    name: 'Ocean Mystery',
    mode: 'dark',
    colors: {
      primary: '#0369A1',
      primaryLight: '#0284C7',
      primaryDark: '#075985',
      secondary: '#0EA5E9',
      secondaryLight: '#38BDF8',
      secondaryDark: '#0284C7',
      accent: '#06B6D4',
      accentLight: '#22D3EE',
      accentDark: '#0891B2',
      
      background: '#0F1729',
      backgroundLight: '#1E3A5F',
      backgroundLighter: '#1E4D6B',
      
      surface: '#1E3A5F',
      surfaceLight: '#1E4D6B',
      surfaceDark: '#0F1729',
      
      text: '#F0F9FF',
      textSecondary: '#BAE6FD',
      textMuted: '#7DD3FC',
      
      border: '#0C4A6E',
      borderLight: '#0369A1',
      
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
      
      energy: {
        low: '#7DD3FC',
        medium: '#FCD34D',
        high: '#F87171',
        peak: '#0EA5E9',
      },
      
      elements: {
        fire: '#EF4444',
        water: '#0EA5E9',
        air: '#94A3B8',
        earth: '#10B981',
      },
      
      tarot: {
        majorArcana: '#22D3EE',
        minorArcana: '#6B7280',
        cardBorder: '#0369A1',
        mysticalGlow: 'rgba(3, 105, 161, 0.4)',
      },
      
      gradients: {
        cardGradient: ['#1E3A5F', '#0F1729'],
        headerGradient: ['#0C4A6E', '#075985'],
        buttonGradient: ['#0369A1', '#075985'],
      },
    },
    metadata: {
      description: 'Deep ocean with hidden knowledge',
      icon: '🌊',
      preview: '#0369A1',
      planet: 'Moon',
      crystal: 'Aquamarine',
    },
  },
  
  crystalDawn: {
    id: 'crystalDawn',
    name: 'Crystal Dawn',
    mode: 'light',
    colors: {
      primary: '#0284C7',
      primaryLight: '#38BDF8',
      primaryDark: '#0369A1',
      secondary: '#7C3AED',
      secondaryLight: '#A78BFA',
      secondaryDark: '#6D28D9',
      accent: '#F59E0B',
      accentLight: '#FCD34D',
      accentDark: '#D97706',
      
      background: '#F0F9FF',
      backgroundLight: '#E0F2FE',
      backgroundLighter: '#BAE6FD',
      
      surface: '#FFFFFF',
      surfaceLight: '#F0F9FF',
      surfaceDark: '#E0F2FE',
      
      text: '#0C4A6E',
      textSecondary: '#0369A1',
      textMuted: '#38BDF8',
      
      border: '#BAE6FD',
      borderLight: '#7DD3FC',
      
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      
      energy: {
        low: '#60A5FA',
        medium: '#FBBF24',
        high: '#F87171',
        peak: '#A78BFA',
      },
      
      elements: {
        fire: '#EF4444',
        water: '#3B82F6',
        air: '#9CA3AF',
        earth: '#10B981',
      },
      
      tarot: {
        majorArcana: '#7C3AED',
        minorArcana: '#9CA3AF',
        cardBorder: '#0284C7',
        mysticalGlow: 'rgba(2, 132, 199, 0.25)',
      },
      
      gradients: {
        cardGradient: ['#E0F2FE', '#BAE6FD'],
        headerGradient: ['#7DD3FC', '#38BDF8'],
        buttonGradient: ['#0284C7', '#0369A1'],
      },
    },
    metadata: {
      description: 'Morning crystal with clarity & focus',
      icon: '💎',
      preview: '#0284C7',
      planet: 'Mercury',
      crystal: 'Clear Quartz',
    },
  },
  
  crimsonShadow: {
    id: 'crimsonShadow',
    name: 'Crimson Shadow',
    mode: 'dark',
    colors: {
      primary: '#DC2626',
      primaryLight: '#EF4444',
      primaryDark: '#B91C1C',
      secondary: '#991B1B',
      secondaryLight: '#B91C1C',
      secondaryDark: '#7F1D1D',
      accent: '#F97316',
      accentLight: '#FB923C',
      accentDark: '#EA580C',
      
      background: '#1A0A0A',
      backgroundLight: '#2D0F0F',
      backgroundLighter: '#3F1515',
      
      surface: '#2D0F0F',
      surfaceLight: '#3F1515',
      surfaceDark: '#1A0A0A',
      
      text: '#FEF2F2',
      textSecondary: '#FECACA',
      textMuted: '#FCA5A5',
      
      border: '#450A0A',
      borderLight: '#7F1D1D',
      
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#3B82F6',
      
      energy: {
        low: '#60A5FA',
        medium: '#FBBF24',
        high: '#EF4444',
        peak: '#F97316',
      },
      
      elements: {
        fire: '#EF4444',
        water: '#3B82F6',
        air: '#9CA3AF',
        earth: '#22C55E',
      },
      
      tarot: {
        majorArcana: '#F87171',
        minorArcana: '#9CA3AF',
        cardBorder: '#991B1B',
        mysticalGlow: 'rgba(220, 38, 38, 0.4)',
      },
      
      gradients: {
        cardGradient: ['#2D0F0F', '#1A0A0A'],
        headerGradient: ['#450A0A', '#2D0F0F'],
        buttonGradient: ['#DC2626', '#B91C1C'],
      },
    },
    metadata: {
      description: 'Passionate red with shadow energy',
      icon: '🌹',
      preview: '#DC2626',
      planet: 'Mars',
      crystal: 'Garnet',
    },
  },
};

export const DEFAULT_THEME: ThemeVariant = 'mysticMidnight';