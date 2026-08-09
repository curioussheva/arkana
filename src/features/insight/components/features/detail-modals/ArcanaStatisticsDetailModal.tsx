// Berkas: src/features/insight/components/features/detail-modals/ArcanaStatisticsDetailModal.tsx

import React, { useState } from 'react';
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
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

interface Props {
  visible: boolean;
  elementStats?: {
    totalPoints: number;
    avgValue: number;
    stdDev: number;
    dominantElement: string;
    uniqueCount: number;
    diversityRatio: number;
    representativeCard: { id: number; count: number; points: string[]; cardName: string } | null;
  } | null;
  openingAdvice?: string;
  onClose: () => void;
}

const INTENSITY_TIER = (mean: number) => (mean <= 7 ? 'Light' : mean <= 15 ? 'Balanced' : 'Dense');
const STABILITY_TIER = (dev: number) => (dev <= 4 ? 'Stabil' : dev <= 7 ? 'Dinamis' : 'Volatil');

const COMBINED_NARRATIVE: Record<string, { title: string; desc: string }> = {
  'Light-Stabil': {
    title: 'Eteris & Tenang',
    desc: 'Energi halus yang konsisten — kamu memproses hidup dengan tenang, tanpa gejolak drastis antar aspek diri.',
  },
  'Light-Dinamis': {
    title: 'Eteris & Bergejolak',
    desc: 'Energi halus namun ada beberapa titik yang menonjol kontras — introspeksi diselingi ledakan kecil intensitas.',
  },
  'Light-Volatil': {
    title: 'Eteris tapi Ekstrem',
    desc: 'Meski rata-rata ringan, ada titik-titik sangat kontras di dalam dirimu — kelembutan berdampingan dengan intensitas tersembunyi.',
  },
  'Balanced-Stabil': {
    title: 'Seimbang & Konsisten',
    desc: 'Titik-titikmu tersebar merata di sekitar titik tengah — kamu punya keseimbangan alami tanpa banyak drama internal.',
  },
  'Balanced-Dinamis': {
    title: 'Seimbang tapi Dinamis',
    desc: 'Secara rata-rata seimbang, tapi ada variasi yang cukup terasa antar aspek — hidupmu punya ritme naik-turun yang sehat.',
  },
  'Balanced-Volatil': {
    title: 'Seimbang namun Kontras',
    desc: 'Rata-rata di tengah, tapi tersembunyi kombinasi ekstrem tinggi-rendah — kamu bisa sangat berbeda tergantung konteks.',
  },
  'Dense-Stabil': {
    title: 'Padat & Mengakar',
    desc: 'Energi arketipe tinggi yang konsisten di banyak titik — daya pengaruhmu besar dan stabil, jarang goyah.',
  },
  'Dense-Dinamis': {
    title: 'Padat & Progresif',
    desc: 'Energi besar dengan variasi sehat — transformasi radikal datang bertahap, bukan sekaligus mengejutkan.',
  },
  'Dense-Volatil': {
    title: 'Padat & Ekstrem',
    desc: 'Energi arketipe sangat besar dengan kontras tajam antar titik — hidupmu penuh transformasi mendalam dan pergolakan intens.',
  },
};

export function ArcanaStatisticsDetailModal({
  visible,
  elementStats,
  openingAdvice,
  onClose,
}: Props) {
  const colors = useThemeStore(state => state.getColors());
  const [showHelper, setShowHelper] = useState(false);

  // Ambil data dengan fallback yang aman jika props elementStats bernilai null/undefined
  const avgValue = elementStats?.avgValue ?? 11;
  const stdDev = elementStats?.stdDev ?? 4;

  const intensityTier = INTENSITY_TIER(avgValue);
  const stabilityTier = STABILITY_TIER(stdDev);

  const combined = COMBINED_NARRATIVE[`${intensityTier}-${stabilityTier}`] || {
    title: 'Analisis Energi',
    desc: 'Sedang membaca cetak biru jiwamu.',
  };

  const card = elementStats?.representativeCard;

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
            styles.modalHeader,
            { borderBottomColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Analisis Statistik Arkana</Text>
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
          {/* ─── BLOK 1: METRIK DASAR ─── */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.metricsGrid}>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.metricNumber, { color: colors.primary }]}>
                {elementStats?.totalPoints ?? 20}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Titik</Text>
            </View>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.metricNumber, { color: colors.primary }]}>{avgValue}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Rata-rata (Mean)
              </Text>
            </View>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.metricNumber, { color: colors.primary }]}>±{stdDev}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Sebaran (Deviasi)
              </Text>
            </View>
          </Animated.View>
          <Text style={[styles.metricsHint, { color: colors.textMuted }]}>
            {elementStats?.totalPoints ?? 20} titik energi ini membentuk keseluruhan cetak biru
            numerologimu — dari karakter, karma, hingga arah hidup.
          </Text>

          {/* ─── BLOK 2: KLASIFIKASI GABUNGAN ─── */}
          <Animated.View
            entering={FadeInDown.delay(50).duration(400)}
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🔬 Klasifikasi Kerapatan Jiwa
            </Text>
            <View style={styles.tierRow}>
              <View style={[styles.tierBadge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.tierBadgeText, { color: colors.primary }]}>
                  {intensityTier}
                </Text>
              </View>
              <View style={[styles.tierBadge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.tierBadgeText, { color: colors.primary }]}>
                  {stabilityTier}
                </Text>
              </View>
            </View>
            <Text style={[styles.subTitle, { color: colors.primary, marginTop: SPACING.sm }]}>
              {combined.title}
            </Text>
            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{combined.desc}</Text>
          </Animated.View>

          {/* ─── BLOK 3: INTERACTIVE EXPANDABLE HELPER & PETA MATRIKS ─── */}
          {/* 🛡️ DIPERBAIKI: Mengubah Layout usang ke LinearTransition untuk kestabilan tinggi */}
          <Animated.View
            layout={LinearTransition.springify()}
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary + '30',
                borderWidth: 1,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setShowHelper(!showHelper)}
              style={styles.helperHeaderToggle}
              activeOpacity={0.7}
            >
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                ⚖️ Cara Hitung &amp; Panduan Matriks
              </Text>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
                {showHelper ? 'Sembunyikan ⬆️' : 'Pelajari Detail ➡️'}
              </Text>
            </TouchableOpacity>

            {showHelper && (
              <Animated.View entering={FadeInDown.duration(300)} style={{ marginTop: SPACING.md }}>
                {/* Rumus Dasar */}
                <View style={styles.helperRow}>
                  <Text style={[styles.helperIcon, { color: colors.primary }]}>📐</Text>
                  <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '700', color: colors.text }}>Mean (Rata-rata):</Text>{' '}
                    Mengukur intensitas getaran bawaanmu. Nilai tengah adalah 11, sedangkan angka{' '}
                    {"'0'"} diintersept menjadi {"'22'"} untuk presisi arketipe penuh.
                  </Text>
                </View>

                <View style={styles.helperRow}>
                  <Text style={[styles.helperIcon, { color: colors.primary }]}>🌀</Text>
                  <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '700', color: colors.text }}>
                      Deviasi (Sebaran):
                    </Text>{' '}
                    Mengukur tingkat kestabilan kontras antartitik batin. Makin kecil angkanya,
                    getaran hidupmu makin selaras dan minim pergolakan internal.
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Sub-tabel Peta Kerapatan */}
                <Text style={[styles.mapIntroText, { color: colors.text }]}>
                  🗺️ Spektrum &amp; Kamus Kombinasi Jiwa:
                </Text>

                <View style={styles.categoryBlock}>
                  <Text style={[styles.categoryHeader, { color: colors.primary }]}>
                    ✨ Ringan (Light) — Rentang Mean ≤ 7
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Stabil:</Text> Eteris{' '}
                    {'&'} Tenang. Alur hidup mengalir damai tanpa riak konflik batin.
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Dinamis:</Text> Eteris{' '}
                    {'&'} Bergejolak. Kehalusan budi diselingi letupan introspeksi tajam.
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Volatil:</Text> Eteris
                    tapi Ekstrem. Kelembutan luar yang menyimpan pusaran rahasia.
                  </Text>
                </View>

                <View style={[styles.categoryBlock, { marginTop: SPACING.sm }]}>
                  <Text style={[styles.categoryHeader, { color: colors.primary }]}>
                    ⚖️ Seimbang (Balanced) — Rentang Mean 8 - 15
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Stabil:</Text>{' '}
                    Seimbang {'&'} Konsisten. Adaptasi prima tanpa drama batin berlebih.
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Dinamis:</Text>{' '}
                    Seimbang tapi Dinamis. Ritme naik-turn yang sehat dalam kedewasaan.
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Volatil:</Text>{' '}
                    Seimbang namun Kontras. Kepribadian bunglon yang drastis sesuai kondisi.
                  </Text>
                </View>

                <View style={[styles.categoryBlock, { marginTop: SPACING.sm }]}>
                  <Text style={[styles.categoryHeader, { color: colors.primary }]}>
                    🌋 Padat (Dense) — Rentang Mean 16 - 22
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Stabil:</Text> Padat{' '}
                    {'&'} Mengakar. Karisma kokoh, pengaruh masif, dan tidak mudah goyah.
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Progresif:</Text>{' '}
                    Padat {'&'} Progresif. Kekuatan besar dengan transformasi bertahap.
                  </Text>
                  <Text style={[styles.mapItem, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>• Volatil:</Text> Padat{' '}
                    {'&'} Ekstrem. Pergolakan jiwa intens yang memicu lompatan takdir raksasa.
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* ─── BLOK 4: ARCANA REPRESENTATIF ─── */}
          {card && card.count > 1 && (
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={[
                styles.sectionCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🃏 Arcana Representatif
              </Text>
              <Text style={[styles.bodyText, { color: colors.text }]}>
                <Text style={{ fontWeight: '800', color: colors.primary }}>
                  Arcana #{card.id} — {card.cardName}
                </Text>{' '}
                muncul berulang di {card.count} titik: {card.points.join(', ')}.
              </Text>
              <Text
                style={[styles.bodyText, { color: colors.textSecondary, marginTop: SPACING.xs }]}
              >
                Ketika satu arketipe muncul berulang di posisi berbeda, jiwa memintamu untuk
                benar-benar menguasai pelajaran itu — bukan kebetulan, tapi penekanan.
              </Text>
            </Animated.View>
          )}

          {/* ─── BLOK 5: DIVERSITAS ARKETIPE ─── */}
          {typeof elementStats?.diversityRatio === 'number' && (
            <Animated.View
              entering={FadeInDown.delay(150).duration(400)}
              style={[
                styles.sectionCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🌈 Diversitas Arketipe
              </Text>
              <Text style={[styles.bodyText, { color: colors.text }]}>
                {elementStats.uniqueCount} dari {elementStats.totalPoints} titik membawa nomor
                arcana yang berbeda ({elementStats.diversityRatio}% unik).
              </Text>
              <Text
                style={[styles.bodyText, { color: colors.textSecondary, marginTop: SPACING.xs }]}
              >
                {elementStats.diversityRatio >= 70
                  ? 'Spektrum energimu sangat beragam — banyak tema hidup aktif sekaligus.'
                  : elementStats.diversityRatio >= 45
                    ? 'Spektrum energimu cukup seimbang antara fokus dan variasi.'
                    : 'Energimu terkonsentrasi pada sedikit tema berulang — fokus yang kuat pada beberapa pelajaran inti.'}
              </Text>
            </Animated.View>
          )}

          {/* ─── BLOK 6: NARASI ADVICE STRATEGIS ─── */}
          {openingAdvice ? (
            <Animated.View
              entering={FadeInDown.delay(200).duration(400)}
              style={[
                styles.sectionCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                📜 Penyelarasan &amp; Aksi Nyata
              </Text>
              <Text style={[styles.adviceText, { color: colors.textSecondary }]}>
                {openingAdvice}
              </Text>
            </Animated.View>
          ) : null}
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

  metricsGrid: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm },
  metricCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  metricNumber: { fontSize: FONT_SIZE.lg, fontWeight: '800' },
  metricLabel: { fontSize: 11, marginTop: 2, textAlign: 'center' },
  metricsHint: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },

  sectionCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', marginBottom: SPACING.md },
  subTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  bodyText: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
  adviceText: { fontSize: FONT_SIZE.sm, lineHeight: 22 },

  tierRow: { flexDirection: 'row', gap: SPACING.sm },
  tierBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  tierBadgeText: { fontSize: 12, fontWeight: '800' },

  // Helper Expanded Styles
  helperHeaderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm },
  helperIcon: { fontSize: 14, marginRight: SPACING.sm, marginTop: 1 },
  helperText: { fontSize: 11, lineHeight: 16, flex: 1 },
  divider: { height: 0.5, marginVertical: SPACING.md },
  mapIntroText: { fontSize: 12, fontWeight: '700', marginBottom: SPACING.xs },
  categoryBlock: {
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(0,0,0,0.05)',
    marginTop: SPACING.xs,
  },
  categoryHeader: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  mapItem: { fontSize: 10, lineHeight: 14, marginBottom: 2 },
});

export default ArcanaStatisticsDetailModal;
