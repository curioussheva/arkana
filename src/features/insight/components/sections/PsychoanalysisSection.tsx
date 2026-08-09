import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { ElementType } from '@core/destiny-matrix/utils/element';
import { getPsychoAnalysis } from '@core/destiny-matrix/utils/psychoMapper';
import { PsychologicalDetailModal } from '../features/detail-modals/PsychologicalDetailModal';

interface Props {
  dominantElement?: ElementType;
  coreElement?: ElementType;
}

export function PsychoanalysisSection({ dominantElement = 'Fire', coreElement = 'Water' }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const [modalVisible, setModalVisible] = useState(false);
  const { dominantProfile, summaryNarrative } = getPsychoAnalysis(dominantElement, coreElement);

  return (
    <View style={styles.container}>
      {/* ─── BANNER UTAMA PROFIL ─── */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.badge, { color: colors.primary }]}>PROFIL PSIKOANALISIS HARIAN</Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          {dominantProfile.temperament.name}
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.primary }]}>
          {dominantProfile.temperament.label}
        </Text>

        <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>{summaryNarrative}</Text>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>🔍 EKSPLORASI DETAIL PROFIL</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ─── GRID RINGKAS TIPE BEPERILAKU ─── */}
      <View style={styles.gridRow}>
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.gridCol, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={styles.microBadge}>ARKETIPE JUNGIAN</Text>
          <Text style={[styles.colTitle, { color: colors.text }]}>
            {dominantProfile.jungian.functionName}
          </Text>
          <Text style={[styles.colSub, { color: colors.textSecondary }]}>
            {dominantProfile.jungian.focus}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={[styles.gridCol, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={styles.microBadge}>TIPE KERJA (DISC)</Text>
          <Text style={[styles.colTitle, { color: colors.text }]}>{dominantProfile.disc.type}</Text>
          <Text style={[styles.colSub, { color: colors.textSecondary }]}>
            {dominantProfile.disc.archetype}
          </Text>
        </Animated.View>
      </View>

      {/* ─── KARTU SISI TERANG & AREA PERTUMBUHAN ─── */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>🌱 Area Pertumbuhan Diri</Text>
        <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
          {dominantProfile.disc.growthArea}
        </Text>
      </Animated.View>

      {/* MODAL DETAIL */}
      <PsychologicalDetailModal
        visible={modalVisible}
        dominantElement={dominantElement}
        coreElement={coreElement}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.md },
  heroCard: { padding: SPACING.lg, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, ...SHADOWS.sm },
  badge: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  heroTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800' },
  heroSubtitle: { fontSize: FONT_SIZE.xs, fontWeight: '700', marginBottom: SPACING.sm },
  heroDesc: { fontSize: FONT_SIZE.sm, lineHeight: 20, marginBottom: SPACING.md },

  actionBtn: { paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, alignItems: 'center' },
  actionBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  gridRow: { flexDirection: 'row', gap: SPACING.md },
  gridCol: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  microBadge: { fontSize: 9, fontWeight: '800', color: '#888', marginBottom: 2 },
  colTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  colSub: { fontSize: 11, marginTop: 2 },

  card: { padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, ...SHADOWS.sm },
  cardTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800', marginBottom: 4 },
  cardBody: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
});
