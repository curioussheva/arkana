// Berkas: src/features/insight/components/features/detail-modals/KarmicTailDetailModal.tsx

import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { KarmicTailAnalysis } from '@core/destiny-matrix';
import { findRumpunByTriad } from '@core/destiny-matrix/data/karmic-tails';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card';
import { ALL_POINT_KEYS } from '@core/destiny-matrix/constants';

// Kamus Ringkasan Komparatif Intra-Rumpun untuk Edukasi User di UI
const RUMPUN_COMPARATIVE_SUMMARY: Record<string, string> = {
  '🔮': '• 9-9-18 (Wizard): Fobia tampil karena merasa ilmunya belum sempurna.\n• 18-9-9 (Witchcraft): Cemas berlebih karena trauma persekusi masa lalu.\n• 18-9-18 (Illusionist): Kabur ke dunia imajinasi karena takut realitas sosial.',
  '🔥': '• 15-5-8 (Wealth): Siklus finansial naik-turun ekstrem akibat keserakahan ego.\n• 15-11-8 (Strength): Magnet konflik fisik atau ledakan amarah yang intens.\n• 9-15-6 (Passions): Terjebak hubungan toksik demi mencari kesenangan instan.',
  '🌳': '• 15-20-5 (Rebel): Merasa jadi kambing hitam & terasing dari klan keluarga.\n• 19-10-1 (Father): Konflik internal akut dengan figur otoritas atau atasan.\n• 3-6-21 (Mother): Kekosongan kasih ibu, sulit merawat diri atau manja.',
  '🕊️': '• 22-4-8 (Prisoner): Takut berkomitmen karena menganggapnya seperti penjara.\n• 21-10-14 (Wanderer): Sesak dengan rutinitas, selalu ingin kabur berpindah tempat.\n• 21-7-4 (Oppressed): Benci diatur orang lain, tapi jadi control freak pada diri sendiri.',
};

interface Props {
  visible: boolean;
  analysis?: KarmicTailAnalysis;
  onClose: () => void;
}

export function KarmicTailDetailModal({ visible, analysis, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const matrix = useAppStore(state => state.currentMatrix);
  const [isRumpunExpanded, setIsRumpunExpanded] = useState(false);

  // 🃏 1. EVALUASI RESONANSI HARIAN TAROT PADA BEBAN KARMA
  const dailyKarmaImpact = useMemo(() => {
    try {
      const currentCard = getRandomDailyCard();
      if (!currentCard) return null;
      const cardId = currentCard.id === 0 ? 22 : currentCard.id;

      const triadValues = [analysis?.values?.N, analysis?.values?.O, analysis?.values?.P];
      const isDirectMatch = triadValues.includes(cardId);

      return {
        cardId,
        cardName: currentCard.tarotName,
        isDirectMatch,
        element: currentCard.element,
      };
    } catch (e) {
      return null;
    }
  }, [visible, analysis]);

  // 🌀 2. DYNAMIC NODAL ENGINE: Temukan Arkana pelindung paling dominan di 20 titik batin
  const dominantArcana = useMemo(() => {
    if (!matrix?.points) return null;
    const rawPoints = matrix.points as unknown as Record<
      string,
      { arcana?: { id?: number }; value?: number }
    >;

    const frequencyMap: Record<number, number> = {};
    let maxCount = 0;
    let mostDominantId = 0;

    ALL_POINT_KEYS.forEach(key => {
      const pt = rawPoints[key];
      const id = pt?.arcana?.id ?? pt?.value ?? 0;
      const finalId = id === 0 ? 22 : id;
      frequencyMap[finalId] = (frequencyMap[finalId] || 0) + 1;
      if (frequencyMap[finalId] > maxCount) {
        maxCount = frequencyMap[finalId];
        mostDominantId = finalId;
      }
    });

    if (maxCount === 0) return null;

    return { id: mostDominantId, count: maxCount };
  }, [matrix]);

  if (!analysis) return null;

  const rumpun = findRumpunByTriad(analysis.triad);
  const displayTriad =
    analysis.triad || `${analysis.values?.N}-${analysis.values?.O}-${analysis.values?.P}`;
  const isCustomTriad = rumpun ? !rumpun.variations.some(v => v.triad === displayTriad) : false;

  const finalVariations = rumpun
    ? isCustomTriad
      ? [...rumpun.variations, { triad: displayTriad, title: analysis.title }]
      : rumpun.variations
    : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Modal Navigation Top Bar */}
        <View
          style={[
            styles.modalHeader,
            { borderBottomColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Ekor Karma • Beban Masa Lalu
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
          <Animated.View layout={LinearTransition.springify()}>
            {/* ─── BANNER PEMICU KARMA HARIAN TAROT ─── */}
            {dailyKarmaImpact && (
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={[
                  styles.karmaImpactBanner,
                  {
                    borderColor: dailyKarmaImpact.isDirectMatch
                      ? colors.error
                      : colors.primary + '40',
                    backgroundColor: dailyKarmaImpact.isDirectMatch
                      ? colors.error + '10'
                      : colors.primary + '08',
                  },
                ]}
              >
                <Text style={{ fontSize: 22 }}>{dailyKarmaImpact.isDirectMatch ? '⚡' : '🔮'}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.karmaImpactTitle,
                      { color: dailyKarmaImpact.isDirectMatch ? colors.error : colors.primary },
                    ]}
                  >
                    {dailyKarmaImpact.isDirectMatch
                      ? 'Aktivasi Bayangan Karma Harian!'
                      : 'Status Transit Getaran Karma'}
                  </Text>
                  <Text style={[styles.karmaImpactBody, { color: colors.textSecondary }]}>
                    Transit Kartu{' '}
                    <Text style={{ fontWeight: '800' }}>
                      {dailyKarmaImpact.cardName} (#{dailyKarmaImpact.cardId})
                    </Text>{' '}
                    {dailyKarmaImpact.isDirectMatch
                      ? 'sedang memicu jebakan emosional dari Ekor Karmamu hari ini. Waspadai reaksi impulsif!'
                      : 'memberikan kesadaran ekstra untuk melunasi hutang masa lalu.'}
                  </Text>
                </View>
              </Animated.View>
            )}

            {/* Triad Code Badge */}
            <View style={[styles.codeContainer, { backgroundColor: colors.primary + '12' }]}>
              <Text style={[styles.code, { color: colors.primary }]}>
                D:{analysis.values?.D ?? '?'} → D1:{analysis.values?.T ?? '?'} → D2:
                {analysis.values?.M ?? '?'}
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.error }]}>{analysis.title}</Text>

            {/* Past Life Debt */}
            {analysis.pastLifeDebt && (
              <Animated.View
                entering={FadeInDown.delay(50).duration(400)}
                style={[
                  styles.block,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  ⏳ Akar Hutang Karma (Masa Lalu)
                </Text>
                <Text style={[styles.text, { color: colors.textSecondary, fontStyle: 'italic' }]}>
                  {analysis.pastLifeDebt}
                </Text>
              </Animated.View>
            )}

            {/* Current Manifestation */}
            {analysis.manifestation && (
              <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                style={[
                  styles.block,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.label, { color: colors.primary }]}>
                  👁️ Manifestasi Saat Ini
                </Text>
                <Text style={[styles.text, { color: colors.text }]}>{analysis.manifestation}</Text>
              </Animated.View>
            )}

            {/* Shadow Triggers */}
            {analysis.currentTriggers && (
              <Animated.View
                entering={FadeInDown.delay(150).duration(400)}
                style={[
                  styles.block,
                  { borderColor: colors.error + '30', backgroundColor: colors.error + '05' },
                ]}
              >
                <Text style={[styles.label, { color: colors.error }]}>
                  ⚠️ Jebakan Harian (Shadow Triggers)
                </Text>
                <Text style={[styles.text, { color: colors.text }]}>
                  {analysis.currentTriggers}
                </Text>
              </Animated.View>
            )}

            {/* Healing Way */}
            {analysis.healingWay && (
              <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                style={[
                  styles.block,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.label, { color: '#10b981' }]}>🌱 Jalan Penyelarasan</Text>
                <Text style={[styles.text, { color: colors.text }]}>{analysis.healingWay}</Text>
              </Animated.View>
            )}

            {/* 🔗 Rumpun Keterkaitan Karmic Accordion */}
            {rumpun && (
              <Animated.View
                entering={FadeInDown.delay(250).duration(400)}
                style={[
                  styles.rumpunContainer,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsRumpunExpanded(!isRumpunExpanded)}
                  style={styles.rumpunHeader}
                >
                  <View style={{ flex: 1, marginRight: SPACING.sm }}>
                    <Text style={[styles.rumpunMetaLabel, { color: colors.textSecondary + 'aa' }]}>
                      RUMPUN KETERKAITAN KARMIC
                    </Text>
                    <Text style={[styles.rumpunName, { color: colors.primary }]}>
                      {rumpun.icon} {rumpun.name}
                    </Text>
                  </View>
                  <Text
                    style={{ color: colors.primary, fontSize: FONT_SIZE.xs, fontWeight: '700' }}
                  >
                    {isRumpunExpanded ? 'Sembunyikan ▲' : 'Lihat Variasi ▼'}
                  </Text>
                </TouchableOpacity>

                {isRumpunExpanded && (
                  <View style={styles.rumpunContent}>
                    <Text style={[styles.rumpunDescription, { color: colors.textSecondary }]}>
                      {rumpun.description}
                    </Text>

                    {/* 📊 SEKSI: Ringkasan Komparatif Intra Rumpun */}
                    {RUMPUN_COMPARATIVE_SUMMARY[rumpun.icon] && (
                      <View
                        style={[
                          styles.summaryBox,
                          { backgroundColor: colors.backgroundLight, borderColor: colors.border },
                        ]}
                      >
                        <Text style={[styles.summaryBoxTitle, { color: colors.primary }]}>
                          PETA KONTEKS PERBEDAAN ENERGI:
                        </Text>
                        <Text style={[styles.summaryBoxText, { color: colors.textSecondary }]}>
                          {RUMPUN_COMPARATIVE_SUMMARY[rumpun.icon]}
                        </Text>
                      </View>
                    )}

                    <Text
                      style={[
                        styles.variationLabel,
                        { color: colors.textSecondary, marginTop: SPACING.md },
                      ]}
                    >
                      Daftar Variasi Triad Serumpun:
                    </Text>

                    {finalVariations.map(v => {
                      const isCurrent = v.triad === displayTriad;
                      return (
                        <View
                          key={v.triad}
                          style={[
                            styles.variationRow,
                            isCurrent && {
                              backgroundColor: colors.primary + '15',
                              borderColor: colors.primary + '40',
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.variationBadge,
                              { backgroundColor: isCurrent ? colors.primary : colors.border },
                            ]}
                          >
                            <Text
                              style={[
                                styles.variationBadgeText,
                                { color: isCurrent ? '#fff' : colors.textSecondary },
                              ]}
                            >
                              {v.triad}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.variationTitle,
                              {
                                color: isCurrent ? colors.text : colors.textSecondary,
                                fontWeight: isCurrent ? '700' : '400',
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {v.title} {isCurrent && '• (Milikmu)'}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </Animated.View>
            )}

            {/* Affirmation Soul Mantra */}
            {analysis.affirmation && (
              <Animated.View
                entering={FadeInDown.delay(300).duration(400)}
                style={[
                  styles.quoteBox,
                  { backgroundColor: colors.primary + '08', borderColor: colors.primary + '40' },
                ]}
              >
                <Text style={[styles.quoteTitle, { color: colors.primary }]}>
                  ✨ Mantra Penyelaras Jiwa
                </Text>
                <Text style={[styles.quoteText, { color: colors.text }]}>
                  &ldquo;{analysis.affirmation}&rdquo;
                </Text>
              </Animated.View>
            )}
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

  karmaImpactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
  },
  karmaImpactTitle: { fontSize: 12, fontWeight: '800' },
  karmaImpactBody: { fontSize: 11, lineHeight: 15, marginTop: 1 },

  codeContainer: {
    alignSelf: 'center',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  code: { fontSize: FONT_SIZE.lg, fontWeight: '800', letterSpacing: 1 },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  block: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '800', marginBottom: SPACING.xs },
  text: { fontSize: FONT_SIZE.sm, lineHeight: 22 },
  quoteBox: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderLeftWidth: 4,
    marginTop: SPACING.xs,
  },
  quoteTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  quoteText: { fontSize: FONT_SIZE.sm, fontStyle: 'italic', lineHeight: 22 },

  rumpunContainer: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  rumpunHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rumpunMetaLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  rumpunName: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  rumpunContent: {
    marginTop: SPACING.md,
    borderTopWidth: 0.5,
    borderTopColor: '#00000015',
    paddingTop: SPACING.md,
  },
  rumpunDescription: { fontSize: FONT_SIZE.xs, lineHeight: 18, marginBottom: SPACING.sm },
  summaryBox: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  summaryBoxTitle: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  summaryBoxText: { fontSize: 11, lineHeight: 16 },
  variationLabel: { fontSize: 10, fontWeight: '800', marginBottom: SPACING.sm },
  variationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    padding: 6,
    marginBottom: 4,
  },
  variationBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  variationBadgeText: { fontSize: 10, fontWeight: '800' },
  variationTitle: { fontSize: FONT_SIZE.xs, flex: 1 },
});
