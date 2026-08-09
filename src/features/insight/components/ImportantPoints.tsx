import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeStore } from '@store/theme-store';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@constants/theme';

import { InsightCard } from './shared/InsightCard';
import type { ArcanaDefinition } from '@core/arcana/types';

export interface ImportantPointItem {
  key: string;
  label: string;
  arcana?: ArcanaDefinition;
  interpretation: string;
}

interface Props {
  points: ImportantPointItem[];
}

// 🎯 FIX 1: Peta Sinkronisasi Kode Geometri Kompas Sejati (Mesin -> Spasial)
const GEOMETRIC_KEY_MAP: Record<string, string> = {
  // Pilar Utama
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  // Jalur Langit & Tengah
  J: 'A2',
  K: 'B2',
  L: 'C2',
  M: 'D2',
  // Jalur Leluhur Diagonal
  I: 'A3',
  F: 'B3',
  G: 'C3',
  H: 'D3',
  // Satelit Makro Terluar
  Q: 'A1',
  R: 'B1',
  S: 'C1',
  T: 'D1',
  // Ekstensi Karma
  N: 'E1',
  O: 'E2',
  P: 'E3',
};

const ARCANA_NAMES_FALLBACK: Record<number, string> = {
  0: 'The Fool',
  1: 'The Magician',
  2: 'The High Priestess',
  3: 'The Empress',
  4: 'The Emperor',
  5: 'The Hierophant',
  6: 'The Lovers',
  7: 'The Chariot',
  8: 'Justice',
  9: 'The Hermit',
  10: 'Wheel of Fortune',
  11: 'Strength',
  12: 'The Hanged Man',
  13: 'Death',
  14: 'Temperance',
  15: 'The Devil',
  16: 'The Tower',
  17: 'The Star',
  18: 'The Moon',
  19: 'The Sun',
  20: 'Judgement',
  21: 'The World',
  22: 'The Fool',
};

export function ImportantPoints({ points }: Props) {
  const colors = useThemeStore(state => state.getColors());

  if (!points || points.length === 0) {
    return null;
  }

  return (
    <InsightCard icon="📍" title="Interpretasi Titik Utama">
      {points.map((point, index) => {
        const cardId = point.arcana?.id;

        const resolvedTarotName =
          point.arcana?.tarotName ||
          (point.arcana as { name?: string } | undefined)?.name ||
          (typeof cardId === 'number' ? ARCANA_NAMES_FALLBACK[cardId] : '') ||
          'Arcana Rahasia';

        const matrixName = point.arcana?.matrixName;
        const displayId = cardId;

        // 🎯 FIX 2: Ubah kode kunci mesin menjadi kode peta spasial yang ramah pengguna
        const spatialKey = GEOMETRIC_KEY_MAP[point.key] || point.key;

        return (
          <View
            key={`important-point-${point.key}-${index}`}
            style={[
              styles.item,
              {
                borderColor: colors.border,
                backgroundColor: colors.backgroundLight + '60',
              },
            ]}
          >
            <View style={styles.header}>
              <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                {/* 🎯 Menampilkan kode spasial (misal: A, B, A2, A3) alih-alih J atau I */}
                <Text style={[styles.badgeText, { color: colors.primary }]}>{spatialKey}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.text }]}>
                  {point.label || 'Titik Energi'}
                </Text>

                <Text style={[styles.card, { color: colors.primary, fontWeight: '600' }]}>
                  Arcana {displayId !== undefined ? `${displayId} • ` : ''}
                  {resolvedTarotName}
                  {matrixName ? ` ("${matrixName}")` : ''}
                </Text>
              </View>
            </View>

            <Text style={[styles.interpretation, { color: colors.textSecondary }]}>
              {point.interpretation || 'Analisis energi sedang diselaraskan...'}
            </Text>
          </View>
        );
      })}
    </InsightCard>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  badgeText: { fontWeight: '800', fontSize: 12 },
  label: { fontWeight: '700', fontSize: FONT_SIZE.md },
  card: { fontSize: FONT_SIZE.sm, marginTop: 2, lineHeight: 18 },
  interpretation: { fontSize: FONT_SIZE.sm, lineHeight: 22 },
});

export default ImportantPoints;
