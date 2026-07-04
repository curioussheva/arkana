import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { useAppStore } from '@store/app-store';
import { DestinyDiamond } from '@components/charts';
import type { DestinyPoint } from '@core/destiny-matrix/types';

export function MatrixScreen() {
  const matrix = useAppStore((state) => state.currentMatrix);

  if (!matrix) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Belum Ada Matriks</Text>
          <Text style={styles.emptyText}>Pergi ke Beranda untuk menghitung Destiny Matrix Anda</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Matriks Takdir</Text>
        <DestinyDiamond matrix={matrix} />
        <View style={{ height: SPACING.lg }} />
        {Object.values(matrix.points).map((point: DestinyPoint) => (
          <View key={point.key} style={styles.pointRow}>
            <View style={styles.pointKeyBadge}>
              <Text style={styles.pointKeyText}>{point.key}</Text>
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>{point.label}</Text>
              <Text style={styles.pointValue}>
                {point.value} — {point.arcana.card}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyTitle: { fontSize: FONT_SIZE.xl, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center' },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pointKeyBadge: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  pointKeyText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary },
  pointInfo: { flex: 1 },
  pointLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  pointValue: { fontSize: FONT_SIZE.md, color: COLORS.text, fontWeight: '600' },
});
