import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import type { KarmicTailAnalysis } from '@core/destiny-matrix';
import { findRumpunByTriad } from '@core/destiny-matrix/data/karmic-tails';

interface Props {
  analysis?: KarmicTailAnalysis;
  onPress: () => void;
}

export function KarmicTailGridCard({ analysis, onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  // 1. Dapatkan angka D, D1, D2 dari analisis
  const d = analysis?.values?.D;
  const d1 = analysis?.values?.D1;
  const d2 = analysis?.values?.D2;

  // 2. Susun triad dengan separator strip (-) agar sinkron dengan findRumpunByTriad
  const fallbackTriad =
    d !== undefined && d1 !== undefined && d2 !== undefined ? `${d}-${d1}-${d2}` : '';
  const displayTriad =
    analysis?.triad || `${analysis?.values?.D}-${analysis?.values?.M}-${analysis?.values?.T}`;

  // 🔍 Deteksi rumpun secara dinamis untuk mengambil ikon asli
  const rumpun = displayTriad ? findRumpunByTriad(displayTriad) : null;

  // Gunakan ikon dari rumpun dinamis, jika kustom/tidak ketemu gunakan default 🎭
  const cardIcon = rumpun?.icon || '🎭';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        {/* 🌟 Ikon berubah dinamis sesuai rumpun karma */}
        <Text style={styles.icon}>{cardIcon}</Text>
        <Text style={[styles.tag, { color: colors.error, backgroundColor: colors.error + '12' }]}>
          Karma
        </Text>
      </View>

      {analysis ? (
        <>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {analysis.title ? analysis.title.split('(')[0].trim() : 'Custom Karmic Pattern'}
          </Text>
          {/* 🛡️ Tampilan presisi menggunakan D → D1 → D2 */}
          <Text style={[styles.triadText, { color: colors.primary }]}>
            D:{analysis.values?.D ?? '?'} → D1:{analysis.values?.T ?? '?'} → D2:
            {analysis.values?.M ?? '?'}
          </Text>
        </>
      ) : (
        <Text style={[styles.title, { color: colors.textMuted }]}>Menunggu kalkulasi...</Text>
      )}

      <Text style={[styles.actionPrompt, { color: colors.textSecondary }]}>
        Ketuk untuk deep-dive →
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: FONT_SIZE.lg,
  },
  tag: {
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
  triadText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  actionPrompt: {
    fontSize: 10,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: SPACING.md,
  },
});
