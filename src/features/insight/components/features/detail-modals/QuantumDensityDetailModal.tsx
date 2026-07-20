// Berkas: src/features/insight/components/features/detail-modals/QuantumDensityDetailModal.tsx

import React, { useMemo } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { ElementSummary } from '@core/destiny-matrix/analysis';
import type { ArcanaElement } from '@core/arcana/types';

interface Props {
  visible: boolean;
  elementStats?: {
    totalPoints: number;
    avgValue: number;
    dominantElement: string;
  } | null;
  elementSummary?: ElementSummary | null;
  openingAdvice?: string;
  onClose: () => void;
}

const ELEMENT_DESCRIPTIONS: Record<string, { karakteristik: string; fokus: string; mantra: string }> = {
  'Fire': {
    karakteristik: 'Energi transformatif, penuh gairah, dorongan kepemimpinan, dan keberanian mengambil risiko tinggi.',
    fokus: 'Menyalurkan ambisi agar tidak membakar diri sendiri (burnout) dan menjaga stabilitas emosi.',
    mantra: '✨ "Saya memimpin dengan kehangatan, mengubah hambatan menjadi kekuatan murni."'
  },
  'Water': {
    karakteristik: 'Intuisi tajam, empati mendalam, kemampuan adaptasi sirkular, dan kedalaman rasa batin.',
    fokus: 'Menjaga batasan diri agar tidak tenggelam dalam emosi orang lain dan mempercayai firasat kompas jiwamu.',
    mantra: '✨ "Saya mengalir dengan kedamaian, menerima perubahan sebagai bentuk pertumbuhan batin."'
  },
  'Air': {
    karakteristik: 'Kecerdasan intelektual, visi konseptual strategis, komunikasi verbal, dan kebebasan berpikir.',
    fokus: 'Membumikan ide-ide abstrak menjadi aksi nyata yang terstruktur alih-alih melayang menjadi wacana.',
    mantra: '✨ "Pikiran saya jernih, membawa inspirasi dan solusi nyata bagi dunia."'
  },
  'Earth': {
    karakteristik: 'Stabilitas material, ketekunan nyata, kedisiplinan logis, dan pondasi eksekusi yang kokoh.',
    fokus: 'Menghindari jebakan zona nyaman yang kaku dan membuka diri terhadap fleksibilitas perubahan haluan.',
    mantra: '✨ "Saya berakar dengan kuat, memanifestasikan kelimpahan finansial dan spiritual."'
  },
  'Murni': {
    karakteristik: 'Keseimbangan spektrum energi yang merata di seluruh klaster numerologi takdir Anda.',
    fokus: 'Mempertahankan harmoni internal dan mengaktifkan elemen spesifik sesuai dengan kebutuhan tantangan hidup.',
    mantra: '✨ "Saya adalah perpaduan harmonis dari seluruh energi alam semesta."'
  }
};

const ELEMENT_LABEL_ID: Record<string, string> = {
  'Fire': '🔥 Api',
  'Water': '💧 Air',
  'Air': '💨 Udara',
  'Earth': '🌍 Bumi',
  'Murni': '✨ Keseimbangan Murni'
};

const ELEMENT_COLOR: Record<string, string> = {
  'Fire': '#ef4444',
  'Water': '#3b82f6',
  'Air': '#a855f7',
  'Earth': '#22c55e',
};

const COMBO_INSIGHT: Record<string, string> = {
  'Fire-Water': 'Gairah tindakanmu (Api) diseimbangkan oleh kedalaman rasa (Air). Kamu mampu bergerak cepat tanpa kehilangan empati.',
  'Fire-Air': 'Kombinasi Api dan Udara menciptakan pemimpin visioner — penuh ide sekaligus berani mengeksekusinya.',
  'Fire-Earth': 'Energi Api yang membara ditopang fondasi Bumi yang stabil, membuat ambisimu lebih terarah dan tahan lama.',
  'Water-Fire': 'Kepekaanmu (Air) memberi warna pada dorongan bertindak (Api) — kamu memimpin dengan hati, bukan cuma ego.',
  'Water-Air': 'Intuisi (Air) berpadu dengan kejernihan berpikir (Udara), menghasilkan kebijaksanaan yang mudah dikomunikasikan.',
  'Water-Earth': 'Kedalaman emosimu (Air) dipertegas oleh keteguhan Bumi, menjadikanmu sosok yang tenang sekaligus dapat diandalkan.',
  'Air-Fire': 'Ide-ide cemerlangmu (Udara) menyalakan aksi nyata lewat dorongan Api — kamu bukan sekadar pemimpi.',
  'Air-Water': 'Pikiranmu yang luwes (Udara) diperkaya kepekaan emosi (Air), membuatmu komunikator yang penuh empati.',
  'Air-Earth': 'Visimu yang luas (Udara) dibumikan oleh ketekunan Bumi, membuat gagasanmu benar-benar terwujud.',
  'Earth-Fire': 'Fondasi kokohmu (Bumi) diberi percikan semangat Api, menjadikanmu pekerja keras yang juga penuh gairah.',
  'Earth-Water': 'Stabilitasmu (Bumi) melembut lewat kepekaan Air, membentuk sosok yang teguh namun tetap hangat.',
  'Earth-Air': 'Ketekunanmu (Bumi) diperluas oleh cara berpikir terbuka (Udara), memadukan disiplin dengan fleksibilitas.',
};

export function QuantumDensityDetailModal({ visible, elementStats, elementSummary, openingAdvice, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());

  const elementKey = elementStats?.dominantElement || 'Murni';
  const infoElemen = ELEMENT_DESCRIPTIONS[elementKey] || ELEMENT_DESCRIPTIONS['Murni'];
  const displayLabel = ELEMENT_LABEL_ID[elementKey] || elementKey;

  const densityClassification = useMemo(() => {
    const avg = elementStats?.avgValue || 11;
    if (avg <= 7) {
      return {
        title: 'Light Quantum (Energi Eteris)',
        desc: 'Cetak biru jiwa memancarkan getaran halus yang introspektif. Anda cenderung memproses energi secara mendalam di dalam batin sebelum mengekspresikannya ke fisik.'
      };
    } else if (avg <= 15) {
      return {
        title: 'Balanced Quantum (Energi Kinetik Keseimbangan)',
        desc: 'Medan energi berada pada titik ekuilibrium makrokosmos yang ideal. Anda memiliki kapasitas adaptasi yang seimbang antara logika nyata dan dorongan spiritual.'
      };
    } else {
      return {
        title: 'Dense Quantum (Energi Makro Massif)',
        desc: 'Jiwa membawa muatan energi arketipe tinggi yang sangat padat. Hidup Anda dirancang untuk melalui transformasi radikal dan memiliki daya pengaruh magnetis besar.'
      };
    }
  }, [elementStats?.avgValue]);

  const distributionRows = useMemo(() => {
    if (!elementSummary?.distribution) return [];
    const total = Object.values(elementSummary.distribution).reduce((s, v) => s + v, 0) || 1;
    return (Object.entries(elementSummary.distribution) as [ArcanaElement, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([element, count]) => ({
        element,
        count,
        percentage: Math.round((count / total) * 100),
      }));
  }, [elementSummary]);

  const secondaryElement = elementSummary?.stats?.secondary;
  const dominantPercentage = elementSummary?.stats?.dominantPercentage;

  const comboText = secondaryElement
    ? COMBO_INSIGHT[`${elementKey}-${secondaryElement}`]
    : undefined;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

        <View style={[styles.modalHeader, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Analisis Kerapatan Kuantum</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.border + '40' }]} activeOpacity={0.7}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Animated.View entering={FadeInDown.duration(400)} style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.metricNumber, { color: colors.primary }]}>{elementStats?.totalPoints || 33}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Koordinat Jiwa</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.metricNumber, { color: colors.primary }]}>{elementStats?.avgValue || 11}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Rata-rata Potensi Arcana</Text>
            </View>
          </Animated.View>
          <Text style={[styles.metricsHint, { color: colors.textMuted }]}>
            33 titik energi ini membentuk keseluruhan cetak biru numerologimu — dari karakter, karma, hingga arah hidup.
          </Text>

          <Animated.View entering={FadeInDown.delay(50).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🔬 Klasifikasi Kerapatan Jiwa</Text>
            <Text style={[styles.subTitle, { color: colors.primary, marginBottom: 4 }]}>{densityClassification.title}</Text>
            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{densityClassification.desc}</Text>
          </Animated.View>

          {distributionRows.length > 0 && (
            <Animated.View entering={FadeInDown.delay(75).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Distribusi Elemen</Text>
              {distributionRows.map(({ element, count, percentage }) => (
                <View key={element} style={styles.distRow}>
                  <View style={styles.distLabelRow}>
                    <Text style={[styles.distLabel, { color: colors.text }]}>
                      {ELEMENT_LABEL_ID[element] || element}
                    </Text>
                    <Text style={[styles.distValue, { color: colors.textSecondary }]}>
                      {count} titik · {percentage}%
                    </Text>
                  </View>
                  <View style={[styles.distBarTrack, { backgroundColor: colors.backgroundLight }]}>
                    <View
                      style={[
                        styles.distBarFill,
                        { width: `${percentage}%`, backgroundColor: ELEMENT_COLOR[element] || colors.primary },
                      ]}
                    />
                  </View>
                </View>
              ))}
              {typeof dominantPercentage === 'number' && (
                <Text style={[styles.bodyText, { color: colors.textSecondary, marginTop: SPACING.sm }]}>
                  Elemen {ELEMENT_LABEL_ID[elementKey] || elementKey} mendominasi {dominantPercentage}% dari cetak biru jiwamu.
                </Text>
              )}
            </Animated.View>
          )}

          {secondaryElement && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🌗 Elemen Pendukung: <Text style={{ color: colors.primary }}>{ELEMENT_LABEL_ID[secondaryElement] || secondaryElement}</Text>
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                {comboText || `Perpaduan ${ELEMENT_LABEL_ID[elementKey] || elementKey} dan ${ELEMENT_LABEL_ID[secondaryElement] || secondaryElement} membentuk nuansa unik dalam caramu menjalani hidup.`}
              </Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🌌 Cetak Biru Elemen Utama: <Text style={{ color: colors.primary }}>{displayLabel}</Text></Text>

            <View style={styles.infoBlock}>
              <Text style={[styles.subTitle, { color: colors.primaryLight }]}>💡 Karakteristik Getaran</Text>
              <Text style={[styles.bodyText, { color: colors.text }]}>{infoElemen.karakteristik}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={[styles.subTitle, { color: colors.primaryLight }]}>🎯 Fokus Penyelarasan Energi</Text>
              <Text style={[styles.bodyText, { color: colors.text }]}>{infoElemen.fokus}</Text>
            </View>

            <View style={[styles.quoteBox, { backgroundColor: colors.backgroundLight, borderColor: colors.primary }]}>
              <Text style={[styles.quoteTitle, { color: colors.primary }]}>✨ Afirmasi Penyelaras Kuantum</Text>
              <Text style={[styles.quoteText, { color: colors.text }]}>{infoElemen.mantra}</Text>
            </View>
          </Animated.View>

          {openingAdvice ? (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>📜 Penyelarasan & Aksi Nyata</Text>
              <Text style={[styles.adviceText, { color: colors.textSecondary }]}>{openingAdvice}</Text>
            </Animated.View>
          ) : null}

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 0.5 },
  modalTitle: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  closeButton: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: BORDER_RADIUS.md },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xl },

  metricsGrid: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm },
  metricCard: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, alignItems: 'center', ...SHADOWS.sm },
  metricNumber: { fontSize: FONT_SIZE.lg, fontWeight: '800' },
  metricLabel: { fontSize: 11, marginTop: 2, textAlign: 'center' },
  metricsHint: { fontSize: 11, fontStyle: 'italic', textAlign: 'center', marginBottom: SPACING.lg, paddingHorizontal: SPACING.sm },

  sectionCard: { padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, marginBottom: SPACING.md, ...SHADOWS.sm },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', marginBottom: SPACING.md },
  infoBlock: { marginBottom: SPACING.md },
  subTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  bodyText: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
  adviceText: { fontSize: FONT_SIZE.sm, lineHeight: 22 },

  distRow: { marginBottom: SPACING.sm },
  distLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  distLabel: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  distValue: { fontSize: 11 },
  distBarTrack: { height: 8, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
  distBarFill: { height: '100%', borderRadius: BORDER_RADIUS.sm },

  quoteBox: { padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderLeftWidth: 4, marginTop: SPACING.xs, ...SHADOWS.sm },
  quoteTitle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  quoteText: { fontSize: FONT_SIZE.sm, fontStyle: 'italic', lineHeight: 22, fontWeight: '500' },
});

export default QuantumDensityDetailModal; 