// Berkas: src/features/insight/components/shared/CoreEssenceGridCard.tsx

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { getDailyElementSummary } from '@core/destiny-matrix/daily-resonance';

interface Props {
  onPress?: () => void;
}

export function CoreEssenceGridCard({ onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  // 🃏 Ambil Pengaruh Energi Elemen Harian dari Daily Card
  const dailyData = useMemo(() => getDailyElementSummary(), []);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: dailyData.color + '40',
          borderLeftColor: dailyData.color,
          borderLeftWidth: 4,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: dailyData.color + '15' }]}>
          <Text style={styles.icon}>{dailyData.icon}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: '#ffd70020' }]}>
          <Text style={[styles.tagText, { color: '#b69100' }]}>⚡ DAILY AURA</Text>
        </View>
      </View>

      {/* Title & Subtitle */}
      <View>
        <Text style={[styles.title, { color: colors.text }]}>Esensi & Vibe Harian</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Elemen {dailyData.name} • {dailyData.cardName} (#{dailyData.cardId})
        </Text>
      </View>

      {/* Widget Pratinjau Ringkas: Totem & Kristal */}
      <View style={[styles.essenceRow, { backgroundColor: colors.backgroundLight }]}>
        <View style={styles.essenceItem}>
          <Text style={styles.essenceLabel}>TOTEM HARIAN</Text>
          <Text style={[styles.essenceValue, { color: colors.text }]} numberOfLines={1}>
            {dailyData.totem}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.essenceItem}>
          <Text style={styles.essenceLabel}>KRISTAL HOKI</Text>
          <Text style={[styles.essenceValue, { color: colors.text }]} numberOfLines={1}>
            {dailyData.gem}
          </Text>
        </View>
      </View>

      {/* Action Prompt */}
      <Text style={[styles.actionPrompt, { color: colors.primary }]}>
        Buka kompilasi & panduan harian →
      </Text>
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
    minHeight: 185,
    marginHorizontal: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
    fontWeight: '500',
  },
  essenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.xs,
  },
  essenceItem: {
    flex: 1,
  },
  essenceLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 0.5,
  },
  essenceValue: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: SPACING.xs,
  },
  actionPrompt: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
});

export default CoreEssenceGridCard;
