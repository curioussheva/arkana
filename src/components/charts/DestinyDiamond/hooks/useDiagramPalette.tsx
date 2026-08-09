// src/components/charts/DestinyDiamond/hooks/useDiagramPalette.ts
import { useMemo } from 'react';
import { useThemeStore } from '@store/theme-store';

const VICTORIA = {
  goldPrimary: '#D4AF37',
  goldLight: '#F3E5AB',
  goldDark: '#8C6D23',
  goldGlow: 'rgba(212, 175, 55, 0.45)',
  lineStrokeDark: 'rgba(212, 175, 55, 0.35)',
  lineStrokeLight: 'rgba(140, 109, 35, 0.45)',
  borderGoldDark: 'rgba(212, 175, 55, 0.25)',
  borderGoldLight: 'rgba(140, 109, 35, 0.3)',
  maleLine: 'rgba(138, 66, 184, 0.7)',
  femaleLine: 'rgba(216, 67, 21, 0.7)',
  loveMoneyDash: 'rgba(212, 175, 55, 0.55)',
  moneySymbol: '#84cc16',
  loveSymbol: '#ef4444',
  centerNode: ['#FFF066', '#FFD700'] as [string, string],
  topNode: ['#A066C5', '#8A42B8'] as [string, string],
  spark: 'rgba(255, 255, 255, 0.22)',
};

export function useDiagramPalette() {
  const themeColors = useThemeStore(state => state.getColors());
  const isDark = useThemeStore(state => state.isDark());

  return useMemo(() => {
    return {
      isDark,
      background: themeColors.background,
      surface: themeColors.surface,
      text: themeColors.text,
      textMuted: themeColors.textMuted,
      textSecondary: themeColors.textSecondary ?? themeColors.textMuted,
      primary: themeColors.primary,
      border: themeColors.border,

      // --- Node Fill Colors ---
      nodeBg: isDark
        ? (['#1F1D27', '#0A090D'] as [string, string])
        : ([themeColors.surfaceLight || '#E8E4F0', themeColors.surfaceDark || '#D0CBD8'] as [
            string,
            string,
          ]),
      centerNode: VICTORIA.centerNode,
      topNode: VICTORIA.topNode,

      // --- Node Text Colors (Kontras Tinggi) ---
      centerNodeText: '#1A1500', // Teks pada node kuning tengah
      topNodeText: '#FFFFFF', // Teks pada node ungu atas
      defaultNodeText: isDark ? VICTORIA.goldLight : '#1E1B18', // Teks pada node biasa

      // --- Diagram Frame & Lines ---
      goldPrimary: VICTORIA.goldPrimary,
      goldLight: VICTORIA.goldLight,
      goldDark: isDark ? VICTORIA.goldDark : '#6E551A',
      goldGlow: VICTORIA.goldGlow,
      lineStroke: isDark ? VICTORIA.lineStrokeDark : VICTORIA.lineStrokeLight,
      borderGold: isDark ? VICTORIA.borderGoldDark : VICTORIA.borderGoldLight,
      maleLine: VICTORIA.maleLine,
      femaleLine: VICTORIA.femaleLine,
      loveMoneyDash: VICTORIA.loveMoneyDash,
      moneySymbol: VICTORIA.moneySymbol,
      loveSymbol: VICTORIA.loveSymbol,
      spark: VICTORIA.spark,

      // --- Drop Shadows ---
      labelShadow: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',

      // --- Elements Palette ---
      elements: themeColors.elements || {
        fire: '#EF4444',
        water: '#3B82F6',
        air: '#94A3B8',
        earth: '#10B981',
      },
    };
  }, [themeColors, isDark]);
}
