// Berkas: src/features/insight/components/features/detail-modals/CoreEssenceDetailModal.tsx

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
import { useAppStore } from '@store/app-store';
import { getDailyResonance } from '@core/destiny-matrix/daily-resonance';
import { getTotemImage } from '@constants/totemImages';
import { Image } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CoreEssenceDetailModal({ visible, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const matrix = useAppStore(state => state.currentMatrix);

  // 1. Dapatkan Pengaruh Energi Harian
  const dailyResonance = useMemo(() => getDailyResonance(), [visible]);

  // 2. Dapatkan Kompilasi Ringkas Karakter Blueprint
  const coreSummary = useMemo(() => {
    if (!matrix?.points)
      return {
        archetype: 'Pengembara Takdir',
        trait: 'Pribadi fleksibel yang siap beradaptasi dengan siklus kehidupan.',
      };

    // Logika rangkuman berdasarkan titik utama
    return {
      archetype: 'Arsitek Visi Batin',
      trait:
        'Kombinasi energi Anda menunjukkan ketajaman berpikir strategis yang dipadukan dengan empati sosial tinggi. Anda ditakdirkan untuk memimpin perubahan melalui karya konkret.',
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
            ✨ Kompilasi Esensi & Aura Harian
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
          <Animated.View layout={LinearTransition.springify()}>
            {/* ─── BLOK 1: RANGKUMAN ESENSI KARAKTER (PERMANEN) ─── */}
            <Animated.View
              entering={FadeInDown.duration(400)}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>🌟 BLUEPRINT CORE SUMMARY</Text>
              </View>
              <Text style={[styles.archetypeTitle, { color: colors.primary }]}>
                {coreSummary.archetype}
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                {coreSummary.trait}
              </Text>
            </Animated.View>

            {/* ─── BLOK 2: FLUKTUASI & VIBE HARIAN (DAILY AURA) ─── */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: dailyResonance.color + '50',
                  borderLeftColor: dailyResonance.color,
                  borderLeftWidth: 5,
                },
              ]}
            >
              <View style={styles.headerRow}>
                <Text style={{ fontSize: 24 }}>{dailyResonance.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.subTitle, { color: dailyResonance.color }]}>
                    Cuaca Energi Hari Ini
                  </Text>
                  <Text style={[styles.cardHeader, { color: colors.text }]}>
                    Dominasi Elemen {dailyResonance.element}
                  </Text>
                </View>
              </View>

              <Text style={[styles.triggerNote, { color: colors.textMuted }]}>
                Pemicu Utama: Kartu{' '}
                <Text style={{ fontWeight: '800', color: colors.text }}>
                  {dailyResonance.cardName} (#{dailyResonance.cardId})
                </Text>
              </Text>

              <View style={[styles.gridBox, { backgroundColor: colors.backgroundLight }]}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>🐾 Totem / Spirit Animal</Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}
                  >
                    <Image
                      source={getTotemImage(dailyResonance.totemKey)}
                      style={{ width: 20, height: 20, borderRadius: 10 }}
                    />
                    <Text style={[styles.gridValue, { color: colors.text }]}>
                      {dailyResonance.totem}
                    </Text>
                  </View>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>💎 Kristal Penyeimbang</Text>
                  <Text style={[styles.gridValue, { color: colors.text }]}>
                    {dailyResonance.gemstone}
                  </Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>🎨 Warna & Arah Hoki</Text>
                  <Text style={[styles.gridValue, { color: colors.text }]}>
                    {dailyResonance.luckyColor} • Arah {dailyResonance.direction}
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* ─── BLOK 3: STRATEGIC DAILY ADVICE ─── */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(400)}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.cardHeader, { color: colors.text, marginBottom: SPACING.md }]}>
                📜 Panduan Aksi Harian (Daily Advice)
              </Text>

              <View
                style={[
                  styles.adviceBox,
                  { backgroundColor: '#10b98110', borderColor: '#10b98140' },
                ]}
              >
                <Text style={[styles.adviceTitle, { color: '#10b981' }]}>
                  ✅ Direkomendasikan Hari Ini (Do&apos;s)
                </Text>
                <Text style={[styles.adviceBody, { color: colors.text }]}>
                  {dailyResonance.doAction}
                </Text>
              </View>

              <View
                style={[
                  styles.adviceBox,
                  { backgroundColor: '#ef444410', borderColor: '#ef444440', marginTop: SPACING.sm },
                ]}
              >
                <Text style={[styles.adviceTitle, { color: '#ef4444' }]}>
                  ⚠️ Hindari Hari Ini (Don&apos;ts)
                </Text>
                <Text style={[styles.adviceBody, { color: colors.text }]}>
                  {dailyResonance.dontAction}
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
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

  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardBadge: {
    backgroundColor: '#ffd70020',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: SPACING.xs,
  },
  cardBadgeText: { fontSize: 9, fontWeight: '900', color: '#b69100' },
  archetypeTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', marginBottom: 6 },
  cardHeader: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  subTitle: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  bodyText: { fontSize: FONT_SIZE.sm, lineHeight: 22 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  triggerNote: { fontSize: 11, marginBottom: SPACING.md, fontStyle: 'italic' },

  gridBox: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.lg, gap: SPACING.xs },
  gridItem: { paddingVertical: 4 },
  gridLabel: { fontSize: 10, fontWeight: '800', color: '#888', textTransform: 'uppercase' },
  gridValue: { fontSize: 12, fontWeight: '700', marginTop: 1 },

  adviceBox: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  adviceTitle: { fontSize: 11, fontWeight: '800', marginBottom: 4 },
  adviceBody: { fontSize: 12, lineHeight: 18, fontWeight: '500' },
});

export default CoreEssenceDetailModal;
