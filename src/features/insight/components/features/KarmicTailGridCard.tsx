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

  // 🔍 Deteksi rumpun secara dinamis untuk mengambil ikon asli
  const displayTriad = analysis?.triad || `${analysis?.values?.C}-${analysis?.values?.C1}-${analysis?.values?.C2}`;
  const rumpun = analysis ? findRumpunByTriad(displayTriad) : null;
  
  // Gunakan ikon dari rumpun dinamis, jika kustom/tidak ketemu gunakan default 🎭
  const cardIcon = rumpun?.icon || '🎭';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        {/* 🌟 Ikon sekarang berubah dinamis sesuai rumpun karma */}
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
          {/* 🛡️ Safe-guard optional chaining untuk triad kustom */}
          <Text style={[styles.triadText, { color: colors.primary }]}>
            {analysis.values?.C ?? '?'} → {analysis.values?.C1 ?? '?'} → {analysis.values?.C2 ?? '?'}
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
 