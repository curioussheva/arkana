import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { NamedLines } from '@core/destiny-matrix';

interface Props {
  data?: NamedLines;
  onPress?: () => void;
}

export function NamedLinesGridCard({ data, onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={styles.icon}>🔗</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
          <Text style={[styles.tagText, { color: colors.primary }]}>GARIS</Text>
        </View>
      </View>

      <View>
        <Text style={[styles.title, { color: colors.text }]}>Garis Energi</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Kehidupan & Cinta</Text>
      </View>

      {data ? (
        <View style={styles.previewRow}>
          <View style={[styles.previewChip, { backgroundColor: '#ec489915' }]}>
            <Text style={styles.previewIcon}>💖</Text>
            <Text style={[styles.previewLabel, { color: '#ec4899' }]}>Love</Text>
          </View>
          <View style={[styles.previewChip, { backgroundColor: '#f59e0b15' }]}>
            <Text style={styles.previewIcon}>💰</Text>
            <Text style={[styles.previewLabel, { color: '#f59e0b' }]}>Money</Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>Menunggu kalkulasi...</Text>
      )}

      <Text style={[styles.actionPrompt, { color: colors.primary }]}>Buka rincian garis →</Text>
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
  previewRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: SPACING.sm,
  },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    gap: 4,
  },
  previewIcon: { fontSize: 13 },
  previewLabel: { fontSize: 11, fontWeight: '700' },
  emptyText: { fontSize: 11, marginVertical: SPACING.sm },
  actionPrompt: { fontSize: 10, fontWeight: '700', marginTop: SPACING.md },
});

export default NamedLinesGridCard;
