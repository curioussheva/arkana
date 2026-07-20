// Berkas: src/features/insight/components/features/detail-modals/ElementDetailModal.tsx

import React, { useMemo, useState } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { ElementSummary } from '@core/destiny-matrix/analysis';
import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';

interface PointRef {
  key: string;
  label: string;
  arcanaName: string;
}

interface Props {
  visible: boolean;
  elementSummary?: ElementSummary | null;
  pointsByElement?: Record<string, PointRef[]> | null;
  onClose: () => void;
}

const ELEMENT_LABEL_ID: Record<string, string> = {
  'Fire': '🔥 Api',
  'Water': '💧 Air',
  'Air': '💨 Udara',
  'Earth': '🌍 Bumi',
};

const ELEMENT_COLOR: Record<string, string> = {
  'Fire': '#ef4444',
  'Water': '#3b82f6',
  'Air': '#a855f7',
  'Earth': '#22c55e',
};

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
};

const ELEMENT_DEFICIT_NOTE: Record<string, string> = {
  'Fire': 'Tanpa Api yang kuat, keberanian mengambil aksi mungkin perlu dilatih secara sadar — dorongan bertindak tidak datang otomatis.',
  'Water': 'Tanpa Air yang kuat, kepekaan emosi dan intuisi mungkin perlu dilatih secara sadar — kamu cenderung lebih rasional daripada mengikuti firasat.',
  'Air': 'Tanpa Udara yang kuat, komunikasi dan pemikiran abstrak mungkin terasa lebih menantang — perlu usaha ekstra untuk mengartikulasikan ide.',
  'Earth': 'Tanpa Bumi yang kuat, konsistensi dan stabilitas jangka panjang mungkin perlu dibangun secara sengaja, bukan datang alami.',
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

export function ElementDetailModal({ visible, elementSummary, pointsByElement, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const [expandedElement, setExpandedElement] = useState<string | null>(null);

  const dominantElement = elementSummary?.stats?.dominant;
  const secondaryElement = elementSummary?.stats?.secondary;
  const dominantStyle = dominantElement ? (ELEMENT_STYLES[dominantElement] ?? ELEMENT_STYLES.Fire) : ELEMENT_STYLES.Fire;
  const infoElemen = dominantElement ? ELEMENT_DESCRIPTIONS[dominantElement] : undefined;

  // 🎯 SINKRONISASI TOTAL: Hitung distribusi secara presisi berdasarkan muatan 20 titik inti pointsByElement
  const distributionRows = useMemo(() => {
    const keys = ['Fire', 'Water', 'Air', 'Earth'];
    
    // Hitung total item yang benar-benar tersaring dalam koordinat 20 titik batin
    let calculatedTotal = 0;
    keys.forEach(k => {
      calculatedTotal += (pointsByElement?.[k] ?? []).length;
    });
    
    const safeTotal = calculatedTotal || 1;

    return keys.map(element => {
      const currentPoints = pointsByElement?.[element] ?? [];
      const count = currentPoints.length;
      return {
        element,
        count,
        percentage: Math.round((count / safeTotal) * 100),
      };
    }).sort((a, b) => b.count - a.count); // Urutkan dari elemen dengan bobot terbesar
  }, [pointsByElement]);

  const deficitElements = useMemo(
    () => distributionRows.filter(row => row.count === 0).map(row => row.element),
    [distributionRows],
  );

  // Cari persentase dinamis milik elemen dominan saat ini untuk tampilan teks kaki bawah
  const currentDominantPercentage = useMemo(() => {
    if (!dominantElement) return 0;
    return distributionRows.find(r => r.element === dominantElement)?.percentage || 0;
  }, [distributionRows, dominantElement]);

  const comboText = dominantElement && secondaryElement
    ? COMBO_INSIGHT[`${dominantElement}-${secondaryElement}`]
    : undefined;

  const toggleExpand = (element: string) => {
    setExpandedElement(prev => (prev === element ? null : element));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

        <View style={[styles.modalHeader, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Cetak Biru Elemen</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.border + '40' }]} activeOpacity={0.7}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ─── HERO RINGKAS ─── */}
          {dominantElement && (
            <Animated.View entering={FadeInDown.duration(400)} style={[styles.heroCard, { backgroundColor: dominantStyle.color + '12', borderColor: dominantStyle.color + '40' }]}>
              <Text style={styles.heroIcon}>{dominantStyle.icon}</Text>
              <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>ELEMEN DOMINAN</Text>
              <Text style={[styles.heroElement, { color: dominantStyle.color }]}>{dominantElement}</Text>
              {elementSummary?.opening && (
                <Text style={[styles.heroNarrative, { color: colors.text }]}>{elementSummary.opening}</Text>
              )}
            </Animated.View>
          )}

          {/* ─── DISTRIBUSI ELEMEN (dengan daftar arcana tappable) ─── */}
          {distributionRows.length > 0 && (
            <Animated.View entering={FadeInDown.delay(75).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Distribusi Elemen</Text>
              {distributionRows.map(({ element, count, percentage }) => {
                const points = pointsByElement?.[element] ?? [];
                const isExpanded = expandedElement === element;
                return (
                  // 🛡️ DIPERBAIKI: Mengganti Layout usang dengan LinearTransition demi stabilitas transisi
                  <Animated.View layout={LinearTransition.springify()} key={element} style={styles.distRow}>
                    <TouchableOpacity
                      onPress={() => count > 0 && toggleExpand(element)}
                      activeOpacity={count > 0 ? 0.6 : 1}
                      style={styles.clickableRowArea}
                    >
                      <View style={styles.distLabelRow}>
                        <Text style={[styles.distLabel, { color: colors.text }]}>
                          {ELEMENT_LABEL_ID[element] || element}
                        </Text>
                        <Text style={[styles.distValue, { color: colors.textSecondary }]}>
                          {count} titik · {percentage}% {count > 0 ? (isExpanded ? '▲' : '▼') : ''}
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
                    </TouchableOpacity>

                    {/* Pembungkus list data titik yang terbuka */}
                    {isExpanded && points.length > 0 && (
                      <Animated.View entering={FadeInDown.duration(200)} style={styles.pointsList}>
                        {points.map(p => (
                          <View key={p.key} style={[styles.pointRow, { borderBottomColor: colors.border + '30' }]}>
                            <View style={[styles.pointBadge, { backgroundColor: (ELEMENT_COLOR[element] || colors.primary) + '20' }]}>
                              <Text style={[styles.pointBadgeText, { color: ELEMENT_COLOR[element] || colors.primary }]}>{p.key}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.pointArcanaName, { color: colors.text }]} numberOfLines={1}>{p.arcanaName}</Text>
                              <Text style={[styles.pointLabel, { color: colors.textMuted }]} numberOfLines={1}>Posisi Peta: {p.label}</Text>
                            </View>
                          </View>
                        ))}
                      </Animated.View>
                    )}
                  </Animated.View>
                );
              })}
              {dominantElement && currentDominantPercentage > 0 && (
                <Text style={[styles.bodyText, { color: colors.textSecondary, marginTop: SPACING.sm }]}>
                  Elemen {ELEMENT_LABEL_ID[dominantElement] || dominantElement} mendominasi {currentDominantPercentage}% dari cetak biru jiwamu.
                </Text>
              )}
            </Animated.View>
          )}

          {/* ─── ELEMEN PENDUKUNG ─── */}
          {secondaryElement && dominantElement && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🌗 Elemen Pendukung: <Text style={{ color: colors.primary }}>{ELEMENT_LABEL_ID[secondaryElement] || secondaryElement}</Text>
              </Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                {comboText || `Perpaduan ${ELEMENT_LABEL_ID[dominantElement] || dominantElement} dan ${ELEMENT_LABEL_ID[secondaryElement] || secondaryElement} membentuk nuansa unik dalam caramu menjalani hidup.`}
              </Text>
            </Animated.View>
          )}

          {/* ─── CETAK BIRU ELEMEN UTAMA (karakteristik/fokus/mantra) ─── */}
          {infoElemen && dominantElement && (
            <Animated.View entering={FadeInDown.delay(150).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🌌 Cetak Biru Elemen Utama: <Text style={{ color: colors.primary }}>{ELEMENT_LABEL_ID[dominantElement] || dominantElement}</Text>
              </Text>

              <View style={styles.infoBlock}>
                <Text style={[styles.subTitle, { color: colors.primaryLight }]}>💡 Karakteristik Getaran</Text>
                <Text style={[styles.bodyText, { color: colors.text }]}>{infoElemen.karakteristik}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={[styles.subTitle, { color: colors.primaryLight }]}>🎯 Fokus Penyelarasan Energi</Text>
                <Text style={[styles.bodyText, { color: colors.text }]}>{infoElemen.fokus}</Text>
              </View>

              <View style={[styles.quoteBox, { backgroundColor: colors.backgroundLight, borderColor: colors.primary }]}>
                <Text style={[styles.quoteTitle, { color: colors.primary }]}>✨ Afirmasi Penyelaras</Text>
                <Text style={[styles.quoteText, { color: colors.text }]}>{infoElemen.mantra}</Text>
              </View>
            </Animated.View>
          )}

          {/* ─── SARAN PENYELARASAN / AKSI ─── */}
          {elementSummary?.advice && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>📜 Penyelarasan &amp; Aksi Nyata</Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{elementSummary.advice}</Text>
            </Animated.View>
          )}

          {/* ─── ELEMEN DEFISIT ─── */}
          {deficitElements.length > 0 && (
            <Animated.View entering={FadeInDown.delay(250).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>🌑 Elemen yang Belum Terwakili</Text>
              {deficitElements.map(element => (
                <View key={element} style={styles.deficitBlock}>
                  <Text style={[styles.deficitLabel, { color: colors.text }]}>{ELEMENT_LABEL_ID[element] || element}</Text>
                  <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{ELEMENT_DEFICIT_NOTE[element]}</Text>
                </View>
              ))}
            </Animated.View>
          )}

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

  heroCard: { alignItems: 'center', padding: SPACING.lg, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, marginBottom: SPACING.md },
  heroIcon: { fontSize: 40, marginBottom: SPACING.xs },
  heroLabel: { fontSize: FONT_SIZE.xs, fontWeight: '700', letterSpacing: 1 },
  heroElement: { fontSize: FONT_SIZE.xxl, fontWeight: '800', marginTop: 2 },
  heroNarrative: { fontSize: FONT_SIZE.sm, lineHeight: 20, textAlign: 'center', marginTop: SPACING.md },

  sectionCard: { padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, marginBottom: SPACING.md, ...SHADOWS.sm },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', marginBottom: SPACING.md },
  infoBlock: { marginBottom: SPACING.md },
  subTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  bodyText: { fontSize: FONT_SIZE.sm, lineHeight: 20 },

  distRow: { marginBottom: SPACING.md },
  clickableRowArea: { width: '100%', paddingVertical: 2 },
  distLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  distLabel: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  distValue: { fontSize: 11 },
  distBarTrack: { height: 8, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
  distBarFill: { height: '100%', borderRadius: BORDER_RADIUS.sm },

  pointsList: { marginTop: SPACING.sm, paddingLeft: SPACING.xs },
  pointRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs, borderBottomWidth: 1 },
  pointBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  pointBadgeText: { fontSize: 10, fontWeight: '800' },
  pointArcanaName: { fontSize: FONT_SIZE.sm, fontWeight: '600' },
  pointLabel: { fontSize: 10, marginTop: 1 },

  quoteBox: { padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderLeftWidth: 4, marginTop: SPACING.xs, ...SHADOWS.sm },
  quoteTitle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  quoteText: { fontSize: FONT_SIZE.sm, fontStyle: 'italic', lineHeight: 22, fontWeight: '500' },

  deficitBlock: { marginBottom: SPACING.sm },
  deficitLabel: { fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: 2 },
});

export default ElementDetailModal;
 