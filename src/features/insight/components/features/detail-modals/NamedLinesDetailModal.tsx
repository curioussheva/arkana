// Berkas: src/features/insight/components/features/detail-modals/NamedLinesDetailModal.tsx

import React, { useMemo } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { NamedLines } from '@core/destiny-matrix';
import { useAppStore } from '@store/app-store';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card';

interface Props {
  visible: boolean;
  data?: NamedLines;
  onClose: () => void;
}

export function NamedLinesDetailModal({ visible, data, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const matrix = useAppStore(state => state.currentMatrix);

  // 🃏 1. EVALUASI RESONANSI HARIAN TAROT PADA GARIS ENERGI
  const dailyLineImpact = useMemo(() => {
    try {
      const currentCard = getRandomDailyCard();
      if (!currentCard) return null;

      const cardId = currentCard.id === 0 ? 22 : currentCard.id;
      const element = currentCard.element;

      // Logika Penentuan Pengaruh pada Love Line / Money Line
      if (element === 'Water' || cardId === 6 || cardId === 3) {
        return {
          target: 'LoveLine',
          title: '💖 Magnetisme Asmara Meningkat',
          body: `Getaran ${currentCard.tarotName} (#${cardId}) melapisi Love Line kamu. Hari ini sangat baik untuk komunikasi terbuka dan mempererat ikatan emosional.`,
          color: '#ec4899',
          icon: '✨',
        };
      } else if (element === 'Earth' || cardId === 4 || cardId === 10 || cardId === 8) {
        return {
          target: 'MoneyLine',
          title: '💰 Akselerasi Kanal Rezeki',
          body: `Getaran ${currentCard.tarotName} (#${cardId}) menyuntikkan stimulasi material pada Money Line. Waktu yang tepat untuk eksekusi peluang dan keputusan finansial logis.`,
          color: '#f59e0b',
          icon: '⚡',
        };
      } else {
        return {
          target: 'General',
          title: '🌀 Harmoni Aliran Energi',
          body: `Kartu ${currentCard.tarotName} (#${cardId}) menjaga stabilitas keseimbangan antara ruang relasi dan pencapaian finansialmu.`,
          color: colors.primary,
          icon: '🔮',
        };
      }
    } catch (e) {
      return null;
    }
  }, [visible, colors.primary]);

  // 🌀 2. DYNAMIC NODAL ENGINE: Temukan Arkana pelindung paling dominan di 20 titik batin
  const dominantArcana = useMemo(() => {
    if (!matrix?.points) return null;
    const rawPoints = matrix.points as Record<string, any>;
    const VALID_20_KEYS = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
    ];

    const frequencyMap: Record<number, number> = {};
    let maxCount = 0;
    let mostDominantId = 0;

    VALID_20_KEYS.forEach(key => {
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

    const arcanaNames: Record<number, string> = {
      1: 'The Magician',
      2: 'The High Priestess',
      3: 'The Empress',
      4: 'The Emperor',
      5: 'The Hierophant',
      6: 'The Lovers',
      7: 'The Chariot',
      8: 'Justice',
      9: 'The Hermit',
      10: 'Wheel of Fortune',
      11: 'Strength',
      12: 'The Hanged Man',
      13: 'Death',
      14: 'Temperance',
      15: 'The Devil',
      16: 'The Tower',
      17: 'The Star',
      18: 'The Moon',
      19: 'The Sun',
      20: 'Judgement',
      21: 'The World',
      22: 'The Fool',
    };

    return {
      id: mostDominantId,
      name: arcanaNames[mostDominantId] || `Arkana #${mostDominantId}`,
      count: maxCount,
    };
  }, [matrix]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            🔗 Garis Energi Kehidupan
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.border + '40' }]}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.text, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {data ? (
            <Animated.View layout={LinearTransition.springify()}>
              {/* ─── BANNER RESONANSI HARIAN TAROT ─── */}
              {dailyLineImpact && (
                <Animated.View
                  entering={FadeInDown.duration(400)}
                  style={[
                    styles.impactBanner,
                    {
                      borderColor: dailyLineImpact.color + '40',
                      backgroundColor: dailyLineImpact.color + '08',
                    },
                  ]}
                >
                  <Text style={styles.impactIcon}>{dailyLineImpact.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.impactTitle, { color: dailyLineImpact.color }]}>
                      {dailyLineImpact.title}
                    </Text>
                    <Text style={[styles.impactBody, { color: colors.textSecondary }]}>
                      {dailyLineImpact.body}
                    </Text>
                  </View>
                </Animated.View>
              )}

              {/* ─── BANNER NODAL ARKANIC DOMINANCE ─── */}
              {dominantArcana && (
                <Animated.View
                  entering={FadeInDown.delay(50).duration(400)}
                  style={[
                    styles.nodalBanner,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>👑</Text>
                  <Text style={[styles.nodalText, { color: colors.textSecondary }]}>
                    Pengawal Inti Metrik:{' '}
                    <Text style={{ fontWeight: '800', color: colors.primary }}>
                      {dominantArcana.name} (#{dominantArcana.id})
                    </Text>{' '}
                    — Menaungi {dominantArcana.count} koordinat takdirmu.
                  </Text>
                </Animated.View>
              )}

              {/* ─── LOVE LINE BLOCK ─── */}
              <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                style={[
                  styles.block,
                  {
                    borderColor: dailyLineImpact?.target === 'LoveLine' ? '#ec4899' : colors.border,
                    backgroundColor: colors.surface,
                    borderLeftColor: '#ec4899',
                    borderLeftWidth: 5,
                  },
                ]}
              >
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { color: '#ec4899' }]}>
                    💖 Love Line (Garis Asmara & Relasi)
                  </Text>
                  {dailyLineImpact?.target === 'LoveLine' && (
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>⚡ HOT RESONANCE</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.text, { color: colors.textSecondary }]}>
                  {data.loveLine?.meaning}
                </Text>

                <View style={[styles.subBox, { backgroundColor: colors.backgroundLight }]}>
                  <Text style={[styles.label, { color: '#ec4899' }]}>Pelajaran Jiwa & Relasi</Text>
                  <Text style={[styles.text, { color: colors.text }]}>
                    {data.loveLine?.keyLesson}
                  </Text>
                </View>
              </Animated.View>

              {/* ─── MONEY LINE BLOCK ─── */}
              <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                style={[
                  styles.block,
                  {
                    borderColor:
                      dailyLineImpact?.target === 'MoneyLine' ? '#f59e0b' : colors.border,
                    backgroundColor: colors.surface,
                    borderLeftColor: '#f59e0b',
                    borderLeftWidth: 5,
                  },
                ]}
              >
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { color: '#f59e0b' }]}>
                    💰 Money Line (Garis Rezeki & Karir)
                  </Text>
                  {dailyLineImpact?.target === 'MoneyLine' && (
                    <View
                      style={[
                        styles.liveBadge,
                        { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' },
                      ]}
                    >
                      <Text style={[styles.liveBadgeText, { color: '#f59e0b' }]}>
                        ⚡ HOT RESONANCE
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.text, { color: colors.textSecondary }]}>
                  {data.moneyLine.meaning}
                </Text>

                <View style={[styles.subBox, { backgroundColor: colors.backgroundLight }]}>
                  <Text style={[styles.label, { color: '#f59e0b' }]}>
                    Saran Strategi Pengembangan Karir
                  </Text>
                  <Text style={[styles.text, { color: colors.text }]}>{data.moneyLine.advice}</Text>
                </View>
              </Animated.View>
            </Animated.View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Menunggu kalkulasi garis energi...
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  closeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },

  impactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
  },
  impactIcon: { fontSize: 24 },
  impactTitle: { fontSize: 12, fontWeight: '800' },
  impactBody: { fontSize: 11, lineHeight: 15, marginTop: 1 },

  nodalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  nodalText: { fontSize: 11, flex: 1, lineHeight: 16 },

  block: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    flexWrap: 'wrap',
    gap: 6,
  },
  blockTitle: { fontSize: FONT_SIZE.md, fontWeight: '800' },

  liveBadge: {
    backgroundColor: '#ec489920',
    borderColor: '#ec4899',
    borderWidth: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: { fontSize: 8, fontWeight: '900', color: '#ec4899' },

  subBox: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md },
  label: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  text: { fontSize: FONT_SIZE.sm, lineHeight: 22 },
  emptyText: { fontSize: FONT_SIZE.sm, textAlign: 'center', marginTop: SPACING.xl },
});

export default NamedLinesDetailModal;
