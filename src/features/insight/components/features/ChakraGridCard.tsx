// Berkas: src/features/insight/components/shared/ChakraGridCard.tsx
import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card'; // 🃏 Impor kartu harian
import { getChakraImpactFromDailyCard } from '@core/destiny-matrix/utils/chakra-transformer'; // 🧠 Impor transformer
import type { ChakraData } from '@core/destiny-matrix';

interface Props {
  data?: ChakraData[];
  onPress?: () => void;
}

const STATUS_COLOR = {
  Balanced: '#10b981',
  Overactive: '#f59e0b',
  Blocked: '#ef4444',
} as const;

const CHAKRA_ICON: Record<string, string> = {
  Crown: '👑',
  'Third Eye': '👁️',
  Throat: '🗣️',
  Heart: '💚',
  'Solar Plexus': '☀️',
  Sacral: '🟠',
  Root: '🌍',
};

export function ChakraGridCard({ data, onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const rawChakras = Array.isArray(data) ? data : [];

  // 🃏 1. Ambil kartu harian saat ini dan kalkulasi dampak dinamis fluktuatifnya
  const dailyChakraImpact = useMemo(() => {
    try {
      const currentCard = getRandomDailyCard();
      if (!currentCard) return null;
      return getChakraImpactFromDailyCard(currentCard);
    } catch (e) {
      return null;
    }
  }, []);

  // 🔄 2. OVERRIDE ENGINE: Samakan kalkulasi status agar sinkron dengan yang tampil di modal detail
  const chakras = useMemo(() => {
    if (!dailyChakraImpact) return rawChakras;

    return rawChakras.map(chakra => {
      if (chakra.name === dailyChakraImpact.chakraName) {
        return {
          ...chakra,
          status: dailyChakraImpact.status,
        };
      }
      return chakra;
    });
  }, [rawChakras, dailyChakraImpact]);

  const balancedCount = useMemo(() => {
    return chakras.filter(c => c.status === 'Balanced').length;
  }, [chakras]);

  // Cek apakah ada intervensi kartu aktif hari ini untuk mengubah salinan teks subtitle
  const hasDailyImpact = dailyChakraImpact !== null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={styles.icon}>🧘</Text>
        </View>
        <View
          style={[
            styles.tag,
            { backgroundColor: hasDailyImpact ? '#ffd70020' : colors.primary + '10' },
          ]}
        >
          <Text style={[styles.tagText, { color: hasDailyImpact ? '#b69100' : colors.primary }]}>
            {hasDailyImpact ? '⚡ LIVE RESONANCE' : 'CHAKRA'}
          </Text>
        </View>
      </View>

      <View>
        <Text style={[styles.title, { color: colors.text }]}>Analisis 7 Chakra</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {chakras.length > 0 ? `${balancedCount}/7 seimbang` : 'Keselarasan Energi'}
        </Text>
      </View>

      {chakras.length > 0 ? (
        <View style={styles.iconRow}>
          {chakras.map((chakra, idx) => {
            const chakraName = chakra.name || 'unknown';
            const currentStatus = chakra.status || 'Balanced';
            const isTargetedToday = dailyChakraImpact?.chakraName === chakraName;
            const statusColor = STATUS_COLOR[currentStatus];

            return (
              <View
                key={`${chakraName}-${idx}`}
                style={[
                  styles.chakraDot,
                  {
                    borderColor: statusColor,
                    backgroundColor: isTargetedToday ? statusColor + '15' : 'transparent',
                    borderWidth: isTargetedToday ? 2 : 1.5,
                    // Efek visual cincin tebal kosmik jika chakra sedang bermutasi karena kartu harian
                    shadowColor: statusColor,
                    shadowOpacity: isTargetedToday ? 0.4 : 0,
                    shadowRadius: isTargetedToday ? 3 : 0,
                    elevation: isTargetedToday ? 2 : 0,
                  },
                ]}
              >
                <Text
                  style={[styles.chakraDotIcon, { opacity: currentStatus === 'Blocked' ? 0.6 : 1 }]}
                >
                  {CHAKRA_ICON[chakraName] || '✨'}
                </Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>Menunggu kalkulasi...</Text>
      )}

      <Text style={[styles.actionPrompt, { color: colors.primary }]}>
        {hasDailyImpact ? 'Buka cuaca energi harian →' : 'Lihat rincian chakra →'}
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
  icon: { fontSize: 16 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: FONT_SIZE.md, fontWeight: '700', marginTop: SPACING.xs },
  subtitle: { fontSize: 11, marginTop: 1 },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginVertical: SPACING.sm,
  },
  chakraDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chakraDotIcon: { fontSize: 12 },
  emptyText: { fontSize: 11, marginVertical: SPACING.sm },
  actionPrompt: { fontSize: 10, fontWeight: '700', marginTop: SPACING.md },
});

export default ChakraGridCard;
