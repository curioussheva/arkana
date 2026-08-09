// src/components/charts/DestinyDiamond/components/LegendControls.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LegendItem } from './LegendItem';
import { resolveCategoryColor } from '../utils/nodeColor';
import type { ArcanaDefinition } from '@core/arcana/types';

export type LegendCategory = 'element' | 'chakra' | 'planet' | 'zodiac';

export interface LegendCategoryConfig {
  key: LegendCategory;
  label: string;
  icon: string;
  extract: (arcana: ArcanaDefinition) => string | undefined;
}

export const LEGEND_CATEGORIES: LegendCategoryConfig[] = [
  { key: 'element', label: 'Elemen', icon: '✦', extract: a => a.element },
  { key: 'chakra', label: 'Chakra', icon: '◎', extract: a => a.chakra },
  { key: 'planet', label: 'Planet', icon: '◐', extract: a => a.planet },
  { key: 'zodiac', label: 'Zodiak', icon: '✧', extract: a => a.zodiac },
];

interface LegendControlsProps {
  activeCategory: LegendCategory;
  onSelectCategory: (category: LegendCategory) => void;
  activeFilterValue: string | null;
  onSelectFilterValue: (value: string) => void;
  uniqueFilterValues: string[];
  palette: any;
}

export const LegendControls: React.FC<LegendControlsProps> = ({
  activeCategory,
  onSelectCategory,
  activeFilterValue,
  onSelectFilterValue,
  uniqueFilterValues,
  palette,
}) => {
  return (
    <View style={styles.container}>
      {/* Scroll View Pilihan Kategori */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {LEGEND_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => onSelectCategory(cat.key)}
            style={[
              styles.categoryChip,
              { borderColor: palette.borderGold },
              activeCategory === cat.key && {
                backgroundColor: palette.goldGlow,
                borderColor: palette.goldPrimary,
              },
            ]}
          >
            <Text style={[styles.categoryIcon, { color: palette.goldLight }]}>{cat.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                { color: palette.textMuted },
                activeCategory === cat.key && {
                  color: palette.goldLight,
                  fontWeight: '700',
                },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid Chips Item Legend — warna swatch sekarang konsisten dengan
          border node (resolveCategoryColor yang sama), bukan cuma benar
          untuk tab Element. */}
      <View style={styles.legendItems}>
        {uniqueFilterValues.map(value => {
          const color = resolveCategoryColor(
            activeCategory,
            value,
            palette.elements as Record<string, string> | undefined,
            palette.goldPrimary
          );

          return (
            <LegendItem
              key={value}
              color={color}
              label={value}
              isHighlighted={activeFilterValue === value}
              onPress={() => onSelectFilterValue(value)}
              textMuted={palette.textMuted}
              goldPrimary={palette.goldPrimary}
              goldGlow={palette.goldGlow}
              pillBackground={palette.surface ?? 'rgba(19, 18, 24, 0.75)'}
              pillBorder={palette.border ?? palette.borderGold}
              textOnPill={palette.text ?? palette.textMuted}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 0.8,
  },
  categoryIcon: {
    fontSize: 11,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
});
