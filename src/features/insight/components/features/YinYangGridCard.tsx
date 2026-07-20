import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { YinYangAnalysis } from '@core/destiny-matrix';

interface Props {
  data?: YinYangAnalysis;
  onPress?: () => void;
}

export function YinYangGridCard({ data, onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  const dominantColor = data?.dominant === 'Yang'
    ? '#ef4444'
    : data?.dominant === 'Yin'
    ? '#3b82f6'
    : '#10b981';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={styles.icon}>☯️</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
          <Text style={[styles.tagText, { color: colors.primary }]}>ENERGI</Text>
        </View>
      </View>

      <View>
        <Text style={[styles.title, { color: colors.text }]}>Profil Yin • Yang</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Keseimbangan Energi</Text>
      </View>

      {data ? (
        <View style={styles.miniBarContainer}>
          <View style={[styles.miniYin, { flex: data.yinPercentage, backgroundColor: '#3b82f6' }]} />
          <View style={[styles.miniYang, { flex: data.yangPercentage, backgroundColor: '#ef4444' }]} />
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>Menunggu kalkulasi...</Text>
      )}

      <View style={[styles.badge, { backgroundColor: dominantColor + '20' }]}>
        <Text style={[styles.badgeText, { color: dominantColor }]}>
          {data?.dominant ?? '—'}
        </Text>
      </View>

      <Text style={[styles.actionPrompt, { color: colors.primary }]}>
        Lihat detail energi →
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
  miniBarContainer: {
    flexDirection: 'row', height: 10,
    borderRadius: BORDER_RADIUS.sm, overflow: 'hidden',
    marginVertical: SPACING.sm,
  },
  miniYin: {},
  miniYang: {},
  emptyText: { fontSize: 11, marginVertical: SPACING.sm },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm, paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  actionPrompt: { fontSize: 10, fontWeight: '700', marginTop: SPACING.md },
});

export default YinYangGridCard; 