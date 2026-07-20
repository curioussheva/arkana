// Berkas: src/features/insight/components/features/detail-modals/YinYangDetailModal.tsx

import React from 'react';
import { Modal, SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { YinYangAnalysis } from '@core/destiny-matrix';

interface Props {
  visible: boolean;
  data?: YinYangAnalysis;
  onClose: () => void;
}

const NARRATIVE_ADVICE: Record<string, { fokus: string; aksi: string; afirmasi: string }> = {
  'Balanced': {
    fokus: 'Menjaga ritme antara momentum istirahat dan eksekusi strategi dunia nyata.',
    aksi: 'Pertahankan harmoni ini dengan tidak memaksakan diri bekerja saat intuisi meminta jeda.',
    afirmasi: '✨ "Saya adalah perpaduan sempurna antara keheningan yang bijak dan aksi yang berdampak."'
  },
  'Yang': {
    fokus: 'Melunakkan ambisi ego yang berlebih agar terhindar dari kelelahan mental (burnout).',
    aksi: 'Sediakan waktu khusus untuk meditasi, menulis jurnal batin, atau mendengarkan tanpa menghakimi.',
    afirmasi: '✨ "Saya mengizinkan diri saya untuk menerima, merasakan, dan melambat demi kejelasan visi."'
  },
  'Yin': {
    fokus: 'Membunyikan ide-ide abstrak menjadi manifestasi fisik dan langkah konkret.',
    aksi: 'Buat target harian yang terukur dan paksa diri mengambil tindakan kecil dalam 5 detik pertama.',
    afirmasi: '✨ "Saya berani melangkah maju, mengubah kebijaksanaan intuitif menjadi realitas nyata."'
  },
};

export function YinYangDetailModal({ visible, data, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());

  const dominantKey = data?.dominant === 'Balanced' ? 'Balanced' : data?.dominant === 'Yang' ? 'Yang' : 'Yin';
  const advice = NARRATIVE_ADVICE[dominantKey];

  const dominantColor = data?.dominant === 'Yang'
    ? '#ef4444' // Maskulin / Api / Aksi
    : data?.dominant === 'Yin'
    ? '#3b82f6' // Feminin / Air / Refleksi
    : '#10b981'; // Keseimbangan Sempurna

  const description = data?.dominant === 'Balanced'
    ? 'Energi Yin (Feminin) dan Yang (Maskulin) berada dalam keseimbangan yang harmonis. Anda mampu menyelaraskan intuisi terdalam dengan ketegasan tindakan nyata.'
    : data?.dominant === 'Yang'
    ? 'Energi Yang lebih dominan. Struktur cetak takdir Anda cenderung sangat aktif, logis, berorientasi pada pencapaian material, eksekusi taktis, dan nyaman memegang kendali kepemimpinan.'
    : 'Energi Yin lebih dominan. Struktur cetak takdir Anda kaya akan getaran intuitif, reflektif, penuh empati, memiliki kedalaman spiritual yang kuat, dan piawai dalam merancang strategi di balik layar.';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>☯️ Profil Yin • Yang</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.border + '40' }]} activeOpacity={0.7}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {data ? (
            <Animated.View layout={LinearTransition.springify()}>
              
              {/* ─── HERO CARD: ARCHETYPE ─── */}
              <Animated.View entering={FadeInDown.duration(400)} style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.heroSub, { color: colors.textMuted }]}>ARKETIPE POLARITAS JIWA</Text>
                <Text style={[styles.archetype, { color: dominantColor }]}>{data.archetype || 'Dualitas Seimbang'}</Text>
                
                {/* Diagram Batang Dinamis */}
                <View style={[styles.barContainer, { backgroundColor: colors.backgroundLight }]}>
                  {data.yinPercentage > 0 && (
                    <View style={[styles.yinBar, { width: `${data.yinPercentage}%` }]}>
                      <Text style={styles.barText}>Yin {data.yinPercentage}%</Text>
                    </View>
                  )}
                  {data.yangPercentage > 0 && (
                    <View style={[styles.yangBar, { width: `${data.yangPercentage}%` }]}>
                      <Text style={styles.barText}>Yang {data.yangPercentage}%</Text>
                    </View>
                  )}
                </View>

                <View style={[styles.badge, { backgroundColor: dominantColor + '15' }]}>
                  <Text style={[styles.badgeText, { color: dominantColor }]}>
                    Dominan: {data.dominant === 'Balanced' ? '⚖️ Balanced' : data.dominant === 'Yang' ? '🔥 Yang' : '💧 Yin'}
                  </Text>
                </View>
              </Animated.View>

              {/* ─── BLOK 2: NARASI INTERPRETASI ─── */}
              <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>🔬 Esensi Dinamika Dualitas</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {description}
                </Text>
              </Animated.View>

              {/* ─── BLOK 3: PENYELARASAN STRATEGIS ─── */}
              <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>📜 Panduan Kalibrasi Energi</Text>
                
                <View style={styles.infoBlock}>
                  <Text style={[styles.subTitle, { color: colors.primaryLight }]}>🎯 Fokus Regulasi Diri</Text>
                  <Text style={[styles.bodyText, { color: colors.text }]}>{advice.fokus}</Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={[styles.subTitle, { color: colors.primaryLight }]}>⚡ Aksi Penyeimbang Nyata</Text>
                  <Text style={[styles.bodyText, { color: colors.text }]}>{advice.aksi}</Text>
                </View>

                <View style={[styles.quoteBox, { backgroundColor: colors.backgroundLight, borderColor: dominantColor }]}>
                  <Text style={[styles.quoteTitle, { color: dominantColor }]}>✨ Afirmasi Integrasi</Text>
                  <Text style={[styles.quoteText, { color: colors.text }]}>{advice.afirmasi}</Text>
                </View>
              </Animated.View>

            </Animated.View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Menunggu kalkulasi energi blueprint...
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  closeButton: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: BORDER_RADIUS.md },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  
  heroCard: { padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, marginBottom: SPACING.md, alignItems: 'center', ...SHADOWS.sm },
  heroSub: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  archetype: { fontSize: FONT_SIZE.xl, fontWeight: '800', textAlign: 'center', marginBottom: SPACING.md },
  
  barContainer: {
    flexDirection: 'row', overflow: 'hidden', borderRadius: BORDER_RADIUS.lg,
    height: 32, width: '100%', marginBottom: SPACING.md,
  },
  yinBar: { backgroundColor: '#3b82f6', justifyContent: 'center', paddingLeft: SPACING.md },
  yangBar: { backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'flex-end', paddingRight: SPACING.md, marginLeft: 'auto' },
  barText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  
  badge: { borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 6 },
  badgeText: { fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  
  sectionCard: { padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, marginBottom: SPACING.md, ...SHADOWS.sm },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', marginBottom: SPACING.md },
  description: { fontSize: FONT_SIZE.sm, lineHeight: 22, textAlign: 'left' },
  
  infoBlock: { marginBottom: SPACING.md },
  subTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  bodyText: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
  
  quoteBox: { padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderLeftWidth: 4, marginTop: SPACING.xs },
  quoteTitle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  quoteText: { fontSize: FONT_SIZE.sm, fontStyle: 'italic', lineHeight: 22, fontWeight: '500' },
  
  emptyText: { fontSize: FONT_SIZE.sm, textAlign: 'center', marginTop: SPACING.xl },
});

export default YinYangDetailModal;
 