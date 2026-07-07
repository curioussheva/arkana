// src/components/ui/PointDetailModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { getArkanaImage } from '@constants/arkana-images';
import type { ArkanaInfo } from '@core/numerology/types';

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
  const { width, height } = useWindowDimensions();
  const colors = useThemeStore(state => state.getColors());
  if (!point) return null;

  const maxCardWidth = width - SPACING.lg * 4;
  const cardWidth = Math.min(maxCardWidth, 280);
  const imageHeight = cardWidth / 0.6;
  const cardImage = getArkanaImage(point.arcana.card);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.card, { maxHeight: height * 0.8, backgroundColor: colors.surface }]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces
          >
            {cardImage ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={cardImage}
                  style={[styles.cardImage, { width: cardWidth, height: imageHeight }]}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={[styles.imagePlaceholder, { width: cardWidth, height: imageHeight }]}>
                <Text style={{ color: colors.textMuted }}>🃏</Text>
              </View>
            )}
            <View style={styles.header}>
              <View style={[styles.keyBadge, { backgroundColor: colors.backgroundLight }]}>
                <Text style={[styles.keyText, { color: colors.primary }]}>{point.key}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>{point.label}</Text>
                <Text style={[styles.value, { color: colors.text }]}>Nilai: {point.value}</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.cardName, { color: colors.text }]}>{point.arcana.card}</Text>
            <View style={styles.elementRow}>
              <View style={[styles.elementDot, { backgroundColor: colors.primaryLight }]} />
              <Text style={[styles.element, { color: colors.primaryLight }]}>
                Elemen: {point.arcana.element}
              </Text>
            </View>
            <View style={styles.keywordsWrap}>
              {point.arcana.keywords.map(kw => (
                <View key={kw} style={[styles.keywordChip, { backgroundColor: colors.backgroundLight }]}>
                  <Text style={[styles.keywordText, { color: colors.textSecondary }]}>{kw}</Text>
                </View>
              ))}
            </View>
            <View style={styles.meaningSection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>✨ Makna Upright</Text>
              <Text style={[styles.meaning, { color: colors.text }]}>{point.arcana.uprightMeaning}</Text>
            </View>
            <View style={styles.meaningSection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>🔄 Makna Reversed</Text>
              <Text style={[styles.meaning, { color: colors.text }]}>{point.arcana.reversedMeaning}</Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Memastikan tidak ada glitch touch yang tembus ke belakang modal
    backgroundColor: 'transparent', 
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    width: '90%',
    // 💡 SOLUSI: Menggunakan minHeight agar ScrollView tidak mengkerut ke ukuran 0
    minHeight: 150, 
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
    zIndex: 1,
    elevation: 5,
    // Memastikan child views (termasuk ScrollView) ter-layout dengan aman
    flexDirection: 'column', 
  },
  scrollView: {
    // 💡 SOLUSI: Menggunakan flexGrow agar ScrollView fleksibel mengikuti konten
    flexGrow: 0, 
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardImage: {
    borderRadius: BORDER_RADIUS.lg,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    alignSelf: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  keyText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZE.md,
  },
  value: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  cardName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  elementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  elementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  element: {
    fontSize: FONT_SIZE.sm,
  },
  keywordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  keywordChip: {
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  keywordText: {
    fontSize: FONT_SIZE.xs,
  },
  meaningSection: {
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  meaning: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  closeButton: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
 