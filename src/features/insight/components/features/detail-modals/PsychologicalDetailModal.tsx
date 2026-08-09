import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { ElementType } from '@core/destiny-matrix/utils/element';
import { getPsychoAnalysis } from '@core/destiny-matrix/utils/psychoMapper';

interface Props {
  visible: boolean;
  dominantElement: ElementType;
  coreElement?: ElementType;
  onClose: () => void;
}

export function PsychologicalDetailModal({
  visible,
  dominantElement,
  coreElement,
  onClose,
}: Props) {
  const colors = useThemeStore(state => state.getColors());
  const { dominantProfile, coreProfile, isAligned, summaryNarrative } = getPsychoAnalysis(
    dominantElement,
    coreElement
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header Modal */}
        <View
          style={[
            styles.modalHeader,
            { borderBottomColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Detail Profil Psikoanalisis
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.border + '40' }]}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.text, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Ringkasan Keselarasan */}
          <Animated.View
            entering={FadeInDown.duration(350)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.cardTitle, { color: colors.primary }]}>
              🔮 Integrasi Metafisika &amp; Sains Perilaku
            </Text>
            <Text style={[styles.bodyText, { color: colors.text, marginTop: SPACING.xs }]}>
              {summaryNarrative}
            </Text>
          </Animated.View>

          {/* 1. Temperamen Klasik */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(350)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.badge, { color: colors.primary }]}>TEMPERAMEN DASAR</Text>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {dominantProfile.temperament.name}
            </Text>
            <Text style={[styles.subHeading, { color: colors.primary }]}>
              {dominantProfile.temperament.label}
            </Text>
            <Text style={[styles.bodyText, { color: colors.textSecondary, marginTop: SPACING.xs }]}>
              {dominantProfile.temperament.description}
            </Text>

            <View style={styles.tagContainer}>
              {dominantProfile.temperament.keyTraits.map(trait => (
                <View key={trait} style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>• {trait}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* 2. Arketipe Jungian & MBTI */}
          <Animated.View
            entering={FadeInDown.delay(150).duration(350)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.badge, { color: colors.primary }]}>
              FUNGSI JUNGIAN &amp; MBTI MATCH
            </Text>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {dominantProfile.jungian.functionName}
            </Text>
            <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
              {dominantProfile.jungian.mbtiMatch}
            </Text>
            <Text style={[styles.bodyText, { color: colors.text, marginTop: SPACING.xs }]}>
              <Text style={{ fontWeight: '700' }}>Fokus Kesadaran:</Text>{' '}
              {dominantProfile.jungian.focus}
            </Text>
            <Text style={[styles.bodyText, { color: colors.textSecondary, marginTop: 4 }]}>
              {dominantProfile.jungian.description}
            </Text>
          </Animated.View>

          {/* 3. Gaya Perilaku Kerja (DISC) */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(350)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.badge, { color: colors.primary }]}>
              PROFILE DISC &amp; PERILAKU KERJA
            </Text>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {dominantProfile.disc.type} - {dominantProfile.disc.archetype}
            </Text>

            <Text style={[styles.subHeading, { color: colors.text, marginTop: SPACING.xs }]}>
              Kekuatan Alami:
            </Text>
            {dominantProfile.disc.strengths.map(s => (
              <Text key={s} style={[styles.bodyText, { color: colors.textSecondary }]}>
                ✓ {s}
              </Text>
            ))}

            <View
              style={[
                styles.growthBox,
                { backgroundColor: colors.backgroundLight, marginTop: SPACING.md },
              ]}
            >
              <Text style={[styles.growthTitle, { color: colors.primary }]}>
                🌱 Area Pertumbuhan (Growth Area):
              </Text>
              <Text style={[styles.bodyText, { color: colors.text }]}>
                {dominantProfile.disc.growthArea}
              </Text>
            </View>
          </Animated.View>

          {/* 4. Blind Spot & Gaya Komunikasi */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(350)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.badge, { color: colors.primary }]}>
              INTERAKSI SOSIAL &amp; BLIND SPOT
            </Text>

            <View style={{ marginBottom: SPACING.sm }}>
              <Text style={[styles.subHeading, { color: colors.text }]}>🗣️ Gaya Komunikasi:</Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                {dominantProfile.communicationStyle}
              </Text>
            </View>

            <View>
              <Text style={[styles.subHeading, { color: colors.text }]}>
                ⚠️ Titik Kebutaan (Blind Spot):
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                {dominantProfile.blindSpot}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 0.5,
  },
  modalTitle: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  closeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xl },

  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  badge: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  sectionHeading: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  subHeading: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  bodyText: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
  cardTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800' },

  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SPACING.sm },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  tagText: { fontSize: 11, fontWeight: '700' },

  growthBox: { padding: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  growthTitle: { fontSize: 12, fontWeight: '800', marginBottom: 2 },
});
