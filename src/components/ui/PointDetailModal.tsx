import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { ArkanaInfo } from '@core/numerology/types';

// Structurally compatible with DestinyPoint (and anything else with this
// shape, e.g. PersonalYearArcana adapted to it) — kept generic on purpose
// so this modal can be reused beyond the 13 core A-M points.
export interface DetailablePoint {
  key: string;
  label: string;
  value: number;
  arcana: ArkanaInfo;
}

interface Props {
  point: DetailablePoint | null;
  onClose: () => void;
}

export function PointDetailModal({ point, onClose }: Props) {
  return (
    <Modal visible={point !== null} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.card} onPress={(e) => e.stopPropagation()}>
          {point && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={styles.keyBadge}>
                  <Text style={styles.keyText}>{point.key}</Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.label}>{point.label}</Text>
                  <Text style={styles.value}>Nilai: {point.value}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.cardName}>{point.arcana.card}</Text>
              <Text style={styles.element}>Elemen: {point.arcana.element}</Text>

              <View style={styles.keywordsWrap}>
                {point.arcana.keywords.map((kw) => (
                  <View key={kw} style={styles.keywordChip}>
                    <Text style={styles.keywordText}>{kw}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionLabel}>Makna Upright</Text>
              <Text style={styles.meaning}>{point.arcana.uprightMeaning}</Text>

              <Text style={styles.sectionLabel}>Makna Reversed</Text>
              <Text style={styles.meaning}>{point.arcana.reversedMeaning}</Text>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxHeight: '80%',
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  keyBadge: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  keyText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerInfo: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  cardName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  element: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryLight,
    marginBottom: SPACING.md,
  },
  keywordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  keywordChip: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  keywordText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  meaning: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
