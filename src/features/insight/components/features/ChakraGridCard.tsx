import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
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

const CHAKRA_ICON: Record<ChakraData['name'], string> = {
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
  const chakras = Array.isArray(data) ? data : [];

  const balancedCount = chakras.filter(c => c.status === 'Balanced').length;

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
        <View style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
          <Text style={[styles.tagText, { color: colors.primary }]}>CHAKRA</Text>
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
          {chakras.map((chakra, idx) => (
            <View
              key={`${chakra.name}-${idx}`}
              style={[
                styles.chakraDot,
                { borderColor: STATUS_COLOR[chakra.status] + '60' },
              ]}
            >
              <Text style={styles.chakraDotIcon}>{CHAKRA_ICON[chakra.name]}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>Menunggu kalkulasi...</Text>
      )}

      <Text style={[styles.actionPrompt, { color: colors.primary }]}>
        Lihat rincian chakra →
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
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  icon: { fontSize: 16 },
  tag: {
    paddingHorizontal: 8, paddingVertical: 3,
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
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center',
  },
  chakraDotIcon: { fontSize: 12 },
  emptyText: { fontSize: 11, marginVertical: SPACING.sm },
  actionPrompt: { fontSize: 10, fontWeight: '700', marginTop: SPACING.md },
});

export default ChakraGridCard; 