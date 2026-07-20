// Berkas: src/features/insight/components/features/ImportantPointsGridCard.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';

interface Props {
  onPress: () => void;
}

export function ImportantPointsGridCard({ onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>⏳</Text>
        <Text style={[styles.tag, { color: '#10b981', backgroundColor: '#10b98112' }]}>
          Siklus
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        Roda Takdir & Aksi Pengembangan
      </Text>

      <Text style={[styles.cycleText, { color: colors.textSecondary }]}>
        Peta Jalan Harian
      </Text>

      <Text style={[styles.actionPrompt, { color: colors.textSecondary }]}>
        Buka rencana aksi →
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
  cycleText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  actionPrompt: {
    fontSize: 10,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: SPACING.md,
  },
});
