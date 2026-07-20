// Berkas: src/features/insight/components/features/detail-modals/ImportantPointsDetailModal.tsx

import React, { useState, useMemo } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import Animated, { Layout, FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

interface Props {
  visible: boolean;
  data?: any[]; // Menerima data array dari engine asli
  onClose: () => void;
}

// 🎯 FIX 1: Peta Kompas Sejati (Menjaga kecocokan jika ada data yang masih menggunakan Alfabet Mesin)
const GEOMETRIC_KEY_MAP: Record<string, string> = {
  'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E',
  'J': 'A2', 'K': 'B2', 'L': 'C2', 'M': 'D2',
  'I': 'A3', 'F': 'B3', 'G': 'C3', 'H': 'D3',
  'Q': 'A1', 'R': 'B1', 'S': 'C1', 'T': 'D1',
  'N': 'N',  'O': 'O',  'P': 'P',
  // Map balik mandiri agar aman jika data masuk berupa kode spasial langsung
  'A1': 'A1', 'A2': 'A2', 'A3': 'A3',
  'B1': 'B1', 'B2': 'B2', 'B3': 'B3',
  'C1': 'C1', 'C2': 'C2', 'C3': 'C3',
  'D1': 'D1', 'D2': 'D2', 'D3': 'D3',
};

// 🎯 FIX 2: Penyesuaian Nama Grup & Distribusi Titik Mengikuti Standar Peta Gambar Vertikal
const POINT_GROUPS: Record<string, string[]> = {
  '🎯 Pilar Pusat (Esensi Takdir)': [
    'A', 'B', 'C', 'D', 'E'
  ],
  '⭐ Jalur Langit (Sosial & Mental)': [
    'A1', 'A2', 'A3', 'B1', 'B2', 'B3'
  ],
  '🌍 Jalur Bumi (Material & Finansial)': [
    'C1', 'C2', 'C3'
  ],
  '🪞 Jalur Karma Masa Lalu': [
    'D1', 'D2', 'D3'
  ],
  '💫 Klaster Personal & Ekor Karma': [
    'N', 'O', 'P'
  ],
};

// 🎯 FIX 3: Penyelarasan Kamus Penjelasan Statis Posisi Kompas Jiwa (Persis teks gambar)
const COMPASS_LEGEND = [
  { title: '🎯 Pilar Pusat (Esensi Takdir)', position: 'Titik A, B, C, D, E', desc: 'Pondasi utama cetak biru takdir, karakter mental, spiritualitas batin, dan zona nyaman esensi jiwa Anda.' },
  { title: '⭐ Jalur Langit (Sosial & Mental)', position: 'Kutub Atas (A1, A2, A3) & Kanan (B1, B2, B3)', desc: 'Ekstensi energi yang mengatur alur ekspresi karakter sosial, komunikasi, potensi spiritual, dan perlindungan makro.' },
  { title: '🌍 Jalur Bumi (Material & Finansial)', position: 'Kutub Bawah (C1, C2, C3)', desc: 'Gerbang realisasi duniawi, karir, kemakmuran finansial, bisnis, akumulasi aset, serta pintu masuk roda arus rezeki.' },
  { title: '🪞 Jalur Karma Masa Lalu', position: 'Kutub Kiri (D1, D2, D3)', desc: 'Manifestasi tantangan, rintangan berulang, dan utang karma bawaan. Simpul pengunci utama yang wajib diselaraskan.' },
  { title: '💫 Klaster Personal & Ekor Karma', position: 'Jalur Transisi (N, O, P)', desc: 'Keseimbangan aliran energi leluhur serta titik simpul akhir penghubung transformasi mutasi alur takdir.' },
];
 
export function ImportantPointsDetailModal({ visible, data, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleAccordion = (spatialKey: string) => {
    setExpandedCard(prev => (prev === spatialKey ? null : spatialKey));
  };

  // Penyelarasan dan pemetaan data berkelompok
  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return {};
    
    const groups: Record<string, any[]> = {};

    const normalizedData = data.map(item => {
      const spatialKey = GEOMETRIC_KEY_MAP[item.key] || item.key;
      return { ...item, spatialKey };
    });

    Object.entries(POINT_GROUPS).forEach(([groupName, allowedSpatialKeys]) => {
      const matches = normalizedData.filter(item => allowedSpatialKeys.includes(item.spatialKey));

      // Pengurutan urutan alfabetis angka (contoh: A1 -> A2 -> A3)
      matches.sort((a, b) => a.spatialKey.localeCompare(b.spatialKey, undefined, { numeric: true, sensitivity: 'base' }));

      if (matches.length > 0) {
        groups[groupName] = matches;
      }
    });

    return groups;
  }, [data]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header Kontainer */}
        <View style={[styles.modalHeader, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Peta Jalan Hidup & Transformasi</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.border + '40' }]}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 🎯 INTEGRASI GAMBAR DIAGRAM MATRIKS VERTIKAL */}
          <View style={[styles.imageContainer, { borderColor: colors.border }]}>
            <Image 
  source={require('@assets/images/destiny_matrix_map.png')} 
  style={styles.matrixImage}
  resizeMode="contain"
/> 
          </View>

          {/* Kamus Penjelasan Statis Posisi Kompas */}
          <View style={[styles.legendContainer, { backgroundColor: colors.surface + '60', borderColor: colors.border }]}>
            <Text style={[styles.legendHeaderTitle, { color: colors.text }]}>🗺️ Panduan Koordinat Cetak Biru</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginBottom: SPACING.md }}>
              Orientasi pemetaan klaster energi takdir berdasarkan diagram di atas:
            </Text>
            
            {COMPASS_LEGEND.map((item, index) => (
              <View key={index} style={[styles.legendRow, index < COMPASS_LEGEND.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border + '40' }]}>
                <View style={styles.legendRowTop}>
                  <Text style={[styles.legendRowTitle, { color: colors.primary }]}>{item.title}</Text>
                  <Text style={[styles.legendRowPosition, { color: colors.textMuted, backgroundColor: colors.backgroundLight }]}>{item.position}</Text>
                </View>
                <Text style={[styles.legendRowDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.title, { color: colors.text, marginTop: SPACING.xl }]}>🌱 Rencana Aksi Kontekstual</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ketuk klaster alur di bawah ini untuk membuka analisis mendalam, praktik harian, metode ritus, dan afirmasi murni takdir Anda.
          </Text>

          {/* RENDERING ALUR GRUP KLASTER */}
          {Object.keys(groupedData).length > 0 ? (
            Object.entries(groupedData).map(([groupName, points]) => (
              <View key={groupName} style={styles.groupSection}>
                <Text style={[styles.groupSectionTitle, { color: colors.text }]}>{groupName}</Text>
                
                {points.map((point) => {
                  const isExpanded = expandedCard === point.spatialKey;
                  const arcana = point.arcana;
                  if (!arcana) return null;

                  // Pengunci sinkronisasi visual angka 22 untuk The Fool
                  const displayId = arcana.id === 0 ? 22 : arcana.id;

                  return (
                    <Animated.View 
                      key={`modal-dev-${point.spatialKey}`} 
                      layout={Layout.springify()}
                      style={[styles.accordionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      <TouchableOpacity
                        style={[styles.accordionHeader, isExpanded && { borderBottomWidth: 0.5, borderBottomColor: colors.border + '50' }]}
                        activeOpacity={0.7}
                        onPress={() => toggleAccordion(point.spatialKey)}
                      >
                        <View style={styles.headerLeft}>
                          <View style={[styles.keyBadge, { backgroundColor: colors.primary + '15' }]}>
                            <Text style={[styles.keyText, { color: colors.primary }]}>{point.spatialKey}</Text>
                          </View>
                          
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.pointLabel, { color: colors.primaryLight }]}>
                              {point.label} <Text style={{ color: colors.textMuted }}>• Kode Data: {point.key}</Text>
                            </Text>
                            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                              {displayId} - {arcana.tarotName}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ color: colors.textMuted, fontSize: FONT_SIZE.sm, fontWeight: '700', paddingHorizontal: SPACING.xs }}>
                          {isExpanded ? '▲' : '▼'}
                        </Text>
                      </TouchableOpacity>

                      {isExpanded && (
                        <Animated.View entering={FadeInDown.duration(250)} style={styles.accordionContent}>
                          
                          {arcana.matrixName ? (
                            <View style={{ marginBottom: SPACING.xs }}>
                              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                🔮 Esensi Energi Matrix
                              </Text>
                              <Text style={{ fontSize: FONT_SIZE.md, fontWeight: '700', color: colors.text, marginBottom: SPACING.xs }}>
                                {arcana.matrixName}
                              </Text>
                            </View>
                          ) : null}

                          {/* 1. Narasi Interpretasi Utama */}
                          <View style={styles.subSection}>
                            <Text style={[styles.descriptionText, { color: colors.text }]}>
                              {point.interpretation || 'Analisis getaran energi sedang diselaraskan dengan cetak biru Anda...'}
                            </Text>
                          </View>

                          {/* 2. Praktik Taktis Harian */}
                          {arcana.dailyPractice && arcana.dailyPractice.length > 0 && (
                            <View style={styles.subSection}>
                              <Text style={[styles.subTitle, { color: colors.primary }]}>📅 Praktik Alur Harian</Text>
                              {arcana.dailyPractice.map((practice: string, i: number) => (
                                <View key={i} style={styles.bulletRow}>
                                  <Text style={[styles.bulletPoint, { color: colors.primary }]}>•</Text>
                                  <Text style={[styles.bodyText, { color: colors.text }]}>{practice}</Text>
                                </View>
                              ))}
                            </View>
                          )}

                          {/* 3. Metode Meditasi Spiritual */}
                          {arcana.meditation && arcana.meditation.length > 0 && (
                            <View style={styles.subSection}>
                              <Text style={[styles.subTitle, { color: colors.primary }]}>🧘 Ritus & Metode Meditasi</Text>
                              {arcana.meditation.map((med: string, i: number) => (
                                <View key={i} style={styles.bulletRow}>
                                  <Text style={[styles.bulletPoint, { color: colors.primary }]}>•</Text>
                                  <Text style={[styles.bodyText, { color: colors.text }]}>{med}</Text>
                                </View>
                              ))}
                            </View>
                          )}

                          {/* 4. Mantra Afirmasi Murni */}
                          {arcana.affirmations && arcana.affirmations.length > 0 && (
                            <View style={[styles.quoteBox, { backgroundColor: colors.backgroundLight, borderColor: colors.primary }]}>
                              <Text style={[styles.quoteTitle, { color: colors.primary }]}>✨ Mantra Afirmasi Inti</Text>
                              <Text style={[styles.quoteText, { color: colors.text }]}>
                                &ldquo;{arcana.affirmations[0]}&rdquo;
                              </Text>
                            </View>
                          )}
                        </Animated.View>
                      )}
                    </Animated.View>
                  );
                })}
              </View>
            ))
          ) : (
            <Text style={[styles.bodyText, { textAlign: 'center', marginTop: SPACING.xl, color: colors.textMuted }]}>
              Tidak ada peta rencana aksi yang tersedia saat ini.
            </Text>
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
  title: { fontSize: FONT_SIZE.lg, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: FONT_SIZE.xs, lineHeight: 18, marginBottom: SPACING.lg },
  
  // 🎯 Styles Baru Integrasi Citra Diagram Vertikal
  imageContainer: { width: '100%', height: 420, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, backgroundColor: '#FDFBF7', overflow: 'hidden', marginBottom: SPACING.lg, ...SHADOWS.sm },
  matrixImage: { width: '100%', height: '100%' },

  // Styles Kamus Panduan Statis
  legendContainer: { borderWidth: 1, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, ...SHADOWS.sm },
  legendHeaderTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', marginBottom: 2 },
  legendRow: { paddingVertical: SPACING.sm },
  legendRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  legendRowTitle: { fontSize: 12, fontWeight: '700', flex: 1, paddingRight: SPACING.xs },
  legendRowPosition: { fontSize: 9, fontWeight: '600', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  legendRowDesc: { fontSize: 11, lineHeight: 16 },

  // Styles Akordion Berkelompok
  groupSection: { marginTop: SPACING.md },
  groupSectionTitle: { fontSize: 13, fontWeight: '800', marginBottom: SPACING.sm, letterSpacing: 0.3, opacity: 0.85 },
  accordionCard: { borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.sm, borderWidth: 1, overflow: 'hidden', ...SHADOWS.sm },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: SPACING.xs },
  keyBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  keyText: { fontWeight: '800', fontSize: FONT_SIZE.sm },
  pointLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', marginTop: 2 },
  accordionContent: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, paddingTop: SPACING.xs },
  subSection: { marginBottom: SPACING.md },
  subTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800', marginBottom: SPACING.xs },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingRight: SPACING.sm },
  bulletPoint: { fontSize: FONT_SIZE.md, marginRight: SPACING.xs, lineHeight: 20 },
  bodyText: { fontSize: FONT_SIZE.sm, lineHeight: 20, flex: 1 },
  quoteBox: { padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderLeftWidth: 4, marginTop: SPACING.xs, ...SHADOWS.sm },
  quoteTitle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  quoteText: { fontSize: FONT_SIZE.sm, fontStyle: 'italic', lineHeight: 22, fontWeight: '500' },
  descriptionText: { fontSize: FONT_SIZE.sm, lineHeight: 22, opacity: 0.95 },
});
 