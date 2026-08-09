// Berkas: src/features/insight/components/features/ArcanaStatisticsGridCard.tsx

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card';

export interface ArcanaStatsData {
  totalPoints: number;
  avgValue: number;
  stdDev: number;
  dominantElement: string;
  uniqueCount: number;
  diversityRatio: number;
  representativeCard: { id: number; count: number; points: string[]; cardName: string } | null;
}

interface Props {
  stats: ArcanaStatsData | null;
  onPress?: () => void;
}

export function ArcanaStatisticsGridCard({ stats, onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  // 🃏 EVALUASI RESONANSI KARTU HARIAN DENGAN DOMINANT CARD
  const dailyResonance = useMemo(() => {
    if (!stats?.representativeCard) return false;
    try {
      const dailyCard = getRandomDailyCard();
      if (!dailyCard) return false;
      const dailyId = dailyCard.id === 0 ? 22 : dailyCard.id;
      const repId = stats.representativeCard.id === 0 ? 22 : stats.representativeCard.id;
      return dailyId === repId;
    } catch {
      return false;
    }
  }, [stats]);

  // 🛡️ Safe ID Interceptor untuk Representative Card
  const repCard = useMemo(() => {
    if (!stats?.representativeCard) return null;
    const rawId = stats.representativeCard.id;
    return {
      ...stats.representativeCard,
      displayId: rawId === 0 ? 22 : rawId,
    };
  }, [stats]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: dailyResonance ? colors.primary : colors.border,
          borderLeftColor: dailyResonance ? colors.primary : colors.border,
          borderLeftWidth: dailyResonance ? 4 : 1,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={styles.icon}>📊</Text>
        </View>
        <View
          style={[
            styles.tag,
            { backgroundColor: dailyResonance ? colors.primary + '20' : colors.primary + '10' },
          ]}
        >
          <Text style={[styles.tagText, { color: colors.primary }]}>
            {dailyResonance ? '⚡ RESONANSI HARIAN' : 'STATISTIK ARKANA'}
          </Text>
        </View>
      </View>

      {/* Judul Konten */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.text }]}>Statistik Arkana</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {stats ? `Pola & Sebaran ${stats.totalPoints} Titik` : 'Analisis Sebaran Energi'}
        </Text>
      </View>

      {/* Rincian Ringkas Data */}
      {stats ? (
        <View style={styles.statsContainer}>
          <View style={[styles.statRow, { borderBottomColor: colors.border + '40' }]}>
            <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>Rata-rata</Text>
            <Text style={[styles.statItemValue, { color: colors.text }]}>
              {stats.avgValue} <Text style={styles.denomText}>/22</Text>
            </Text>
          </View>

          <View style={[styles.statRow, { borderBottomColor: colors.border + '40' }]}>
            <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
              Sebaran (Deviasi)
            </Text>
            <Text style={[styles.statItemValue, { color: colors.text }]}>±{stats.stdDev}</Text>
          </View>

          {repCard && repCard.count > 1 && (
            <View style={[styles.statRow, { borderBottomColor: 'transparent' }]}>
              <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                Paling Berulang
              </Text>
              <Text style={[styles.statItemValue, { color: colors.primary }]}>
                #{repCard.displayId} ×{repCard.count}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Menghitung statistik...
          </Text>
        </View>
      )}

      {/* Petunjuk Aksi */}
      <Text style={[styles.actionPrompt, { color: colors.primary }]}>Buka analisis lengkap →</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  titleSection: {
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  statsContainer: {
    marginVertical: SPACING.xs,
    gap: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
  },
  statItemLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statItemValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  denomText: {
    fontSize: 9,
    fontWeight: '400',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  actionPrompt: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
});

export default ArcanaStatisticsGridCard;
