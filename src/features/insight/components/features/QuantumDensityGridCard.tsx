// Berkas: src/features/insight/components/features/QuantumDensityGridCard.tsx

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';

interface Props {
  stats: {
    totalPoints: number;
    avgValue: number;
    dominantElement: string;
  } | null;
  onPress?: () => void;
}

// 🗺️ TRANSLATION & ICON LAYER: Diselaraskan penuh dengan legenda di MatrixScreen & QuantumDensityDetailModal
const ELEMENT_MAP_ID: Record<string, { label: string; icon: string }> = {
  Fire: { label: 'Api', icon: '🔥' },
  Water: { label: 'Air', icon: '💧' },
  Air: { label: 'Udara', icon: '💨' },
  Earth: { label: 'Bumi', icon: '🌍' },
  Murni: { label: 'Murni', icon: '✨' },
};

export function QuantumDensityGridCard({ stats, onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  // Ambil pelokalan data elemen yang aman
  const elementData = stats?.dominantElement
    ? ELEMENT_MAP_ID[stats.dominantElement] || { label: stats.dominantElement, icon: '✨' }
    : { label: 'Murni', icon: '✨' };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={styles.icon}>📊</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
          <Text style={[styles.tagText, { color: colors.primary }]}>DENSITAS ENERGI</Text>
        </View>
      </View>

      {/* Judul Konten */}
      <View>
        <Text style={[styles.title, { color: colors.text }]}>Kerapatan Kuantum</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Keseimbangan Elemen & Nilai
        </Text>
      </View>

      {/* Rincian Ringkas Data */}
      {stats ? (
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
              Elemen Dominan
            </Text>
            <Text style={[styles.statItemValue, { color: colors.primary }]}>
              {elementData.icon} {elementData.label}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
              Rataan Getaran
            </Text>
            <Text style={[styles.statItemValue, { color: colors.text }]}>
              {stats.avgValue} <Text style={{ fontSize: 9, fontWeight: '400' }}>/22</Text>
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Menghitung energi...</Text>
        </View>
      )}

      {/* Petunjuk Aksi */}
      <Text style={[styles.actionPrompt, { color: colors.primary }]}>Buka cetak biru elemen →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 210,
    marginHorizontal: SPACING.xs,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 16 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: FONT_SIZE.md, fontWeight: '700', marginTop: SPACING.sm },
  subtitle: { fontSize: 11, marginTop: 1 },
  statsContainer: { marginVertical: SPACING.xs, gap: SPACING.sm },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statItemLabel: { fontSize: 11, fontWeight: '500' },
  statItemValue: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  emptyText: { fontSize: 10, fontStyle: 'italic' },
  actionPrompt: { fontSize: 10, fontWeight: '700', marginTop: SPACING.xs },
});
