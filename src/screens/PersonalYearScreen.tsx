// Berkas: src/features/insight/presentation/PersonalYearScreen.tsx

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { calculatePersonalYearArcana } from '@core/destiny-matrix/personal-year';
import { ArcanaCard } from '@components/ui/ArcanaCard';
import { SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '@constants/theme';

type ParamList = {
  PersonalYear: { year: number };
};

// Metadata Kosmik Dinamis untuk memperkaya visualisasi atmosfer tahunan (Transit Weather)
const KOSMIK_METADATA: Record<number, { planet: string; elemen: string; warna: string[]; tema: string }> = {
  1: { planet: 'Matahari', elemen: 'Api', warna: ['#f59e0b', '#ef4444'], tema: 'Inisiasi & Ego' },
  2: { planet: 'Bulan', elemen: 'Air', warna: ['#3b82f6', '#1d4ed8'], tema: 'Dualitas & Intuisi' },
  3: { planet: 'Permaisuri', elemen: 'Udara', warna: ['#ec4899', '#f43f5e'], tema: 'Ekspresi & Manifestasi' },
  4: { planet: 'Kaisar', elemen: 'Bumi', warna: ['#10b981', '#047857'], tema: 'Stabilitas & Otoritas' },
  5: { planet: 'Merkurius', elemen: 'Udara', warna: ['#a855f7', '#6b21a8'], tema: 'Kebebasan & Komunikasi' },
  6: { planet: 'Venus', elemen: 'Air/Bumi', warna: ['#f472b6', '#db2777'], tema: 'Harmoni & Cinta' },
  7: { planet: 'Ketaatan', elemen: 'Air', warna: ['#06b6d4', '#0891b2'], tema: 'Introspeksi & Kebijaksanaan' },
  8: { planet: 'Saturnus', elemen: 'Bumi', warna: ['#4b5563', '#1f2937'], tema: 'Kekuatan & Keadilan' },
  9: { planet: 'Pertapa', elemen: 'Bumi', warna: ['#78350f', '#451a03'], tema: 'Penyelesaian & Transendensi' },
  // 🔮 EXPLORATION 10: Inject data astronomis murni Jupiter & Sagittarius
  10: { planet: 'Jupiter 🪐', elemen: '🔥 Api', warna: ['#ffd700', '#a855f7'], tema: 'Roda Takdir & Keberuntungan' },
  11: { planet: 'Kekuatan', elemen: 'Api', warna: ['#b91c1c', '#7f1d1d'], tema: 'Potensi Spiritual' },
  12: { planet: 'Neptunus', elemen: 'Air', warna: ['#60a5fa', '#2563eb'], tema: 'Perspektif Terbalik' },
  13: { planet: 'Transformasi', elemen: 'Air', warna: ['#374151', '#111827'], tema: 'Metamorfosis Jiwa' },
  14: { planet: 'Suhu', elemen: 'Udara', warna: ['#34d399', '#059669'], tema: 'Alkimia Keseimbangan' },
  15: { planet: 'Pluto', elemen: 'Api', warna: ['#1e1b4b', '#311042'], tema: 'Pembebasan Bayangan' },
  16: { planet: 'Mars', elemen: 'Api', warna: ['#dc2626', '#991b1b'], tema: 'Dinamika Rekonstruksi' },
  17: { planet: 'Bintang', elemen: 'Udara', warna: ['#a5f3fc', '#22d3ee'], tema: 'Harapan Kosmik' },
  18: { planet: 'Bulan Bawah', elemen: 'Air', wiring: ['#1e293b', '#0f172a'], tema: 'Eksplorasi Alam Bawah Sadar' },
  19: { planet: 'Matahari Puncak', elemen: 'Api', warna: ['#fcf300', '#f97316'], tema: 'Vitalitas Kelimpahan' },
  20: { planet: 'Pluto Gema', elemen: 'Bumi', warna: ['#c084fc', '#581c87'], tema: 'Kelahiran Kembali Keluarga' },
  21: { planet: 'Semesta', elemen: 'Udara/Air', warna: ['#10b981', '#3b82f6'], tema: 'Harmoni Universal Sempurna' },
  22: { planet: 'Uranus', elemen: 'Udara', warna: ['#f43f5e', '#f59e0b'], tema: 'Kebebasan Tanpa Batas' }
};

export function PersonalYearScreen() {
  const route = useRoute<RouteProp<ParamList, 'PersonalYear'>>();
  const navigation = useNavigation();
  const { year } = route.params;
  const colors = useThemeStore(state => state.getColors());
  const matrix = useAppStore(state => state.currentMatrix);

  const personalYear = useMemo(() => {
    if (!matrix) return null;
    return calculatePersonalYearArcana(matrix.input.birthDate, year);
  }, [matrix, year]);

  if (!personalYear || !personalYear.arcana) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.text }}>Data tidak tersedia</Text>
      </SafeAreaView>
    );
  }

  const displayArcanaId = personalYear.arcana.id === 0 ? 22 : personalYear.arcana.id;
  const interpretation = getYearInterpretation(displayArcanaId);
  const cosmicMeta = KOSMIK_METADATA[displayArcanaId] || { planet: 'Universal', elemen: 'Murni', warna: ['#a855f7', '#3b82f6'], tema: 'Evolusi' };

  const visualArcanaData = {
    ...personalYear.arcana,
    id: displayArcanaId
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header dengan Gradasi Dinamis Berdasarkan Karakter Elemen Transit */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <LinearGradient colors={cosmicMeta.warna} style={styles.header}>
            <Text style={styles.year}>{year}</Text>
            <Text style={styles.subtitle}>Atmosfer Kosmik Tahun Ini</Text>
          </LinearGradient>
        </Animated.View>
        
        {/* Visualisasi Kartu Utama */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.cardContainer}>
          <ArcanaCard arcana={visualArcanaData} variant="full" showMeaning showKeywords />
        </Animated.View>

        {/* ─── EXPLORATION WIDGET: COSMIC WEATHER STATUS ─── */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={[styles.weatherCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🪐 Parameter Cuaca Transit</Text>
          
          <View style={styles.gaugeGrid}>
            <View style={[styles.gaugeItem, { backgroundColor: colors.backgroundLight }]}>
              <Text style={[styles.gaugeLabel, { color: colors.textMuted }]}>PENGUASA</Text>
              <Text style={[styles.gaugeVal, { color: cosmicMeta.warna[0] }]}>{cosmicMeta.planet}</Text>
            </View>

            <View style={[styles.gaugeItem, { backgroundColor: colors.backgroundLight }]}>
              <Text style={[styles.gaugeLabel, { color: colors.textMuted }]}>ELEMEN INTI</Text>
              <Text style={[styles.gaugeVal, { color: cosmicMeta.warna[1] || colors.primary }]}>{cosmicMeta.elemen}</Text>
            </View>
          </View>

          <View style={[styles.temaBadge, { backgroundColor: cosmicMeta.warna[0] + '15' }]}>
            <Text style={[styles.temaText, { color: cosmicMeta.warna[0] }]}>FOCUS METRIC: {cosmicMeta.tema}</Text>
          </View>
        </Animated.View>
        
        {/* Kotak Interpretasi Naratif */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.interpretationBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.interpretationTitle, { color: colors.primary }]}>✨ Cetak Biru Siklus</Text>
          <Text style={[styles.interpretationText, { color: colors.text }]}>{interpretation}</Text>
        </Animated.View>
        
        {/* Tombol Navigasi Kembali */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Kembali ke Timeline</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🛡️ PERBAIKAN: Sinkronisasi Akurat Kamus Berdasarkan Esensi Matrix Engine
function getYearInterpretation(cardNumber: number): string {
  const interpretations: Record<number, string> = {
    1: 'Tahun Baru & Inisiatif. Ini adalah tahun awal baru yang kuat. Ambil langkah pertama, mulai proyek, dan berani memimpin. Fokus pada diri sendiri dan tujuan pribadi. Energi tahun ini mendukung segala hal yang baru dimulai.',
    2: 'Tahun Kerja Sama & Kesabaran. Waktunya mendengarkan, bekerja sama, dan membangun hubungan. Hindari memaksakan kehendak. Intuisi dan diplomasi lebih kuat daripada aksi langsung. Tahun yang baik untuk healing emosional dan membangun fondasi.',
    3: 'Tahun Kreativitas & Ekspresi. Tahun yang penuh warna, sosial, dan ekspresi diri. Kreativitas mengalir deras. Cocok untuk menulis, seni, networking, dan menikmati hidup. Jangan terlalu serius, biarkan diri bersenang-senang.',
    4: 'Tahun Kerja Keras & Stabilitas. Tahun membangun fondasi yang kokoh. Fokus pada kerja keras, disiplin, rutinitas, dan tanggung jawab. Cocok untuk urusan properti, bisnis, kesehatan, dan organisasi. Hasilnya akan terlihat jangka panjang.',
    5: 'Tahun Perubahan & Kebebasan. Tahun dinamis penuh perubahan, perjalanan, dan pengalaman baru. Kebebasan sangat terasa. Bisa ada perubahan karier, tempat tinggal, atau gaya hidup. Hindari komitmen jangka panjang yang terlalu kaku.',
    6: 'Tahun Tanggung Jawab & Harmoni. Fokus pada keluarga, rumah, dan hubungan. Tahun untuk merawat orang lain, memperbaiki rumah, atau menyelesaikan urusan rumah tangga. Energi cinta dan tanggung jawab sangat kuat.',
    7: 'Tahun Introspeksi & Spiritual. Tahun untuk mencari jawaban di dalam diri. Cocok untuk belajar, meditasi, riset, dan pengembangan diri. Bisa terasa lebih sepi atau butuh waktu sendirian. Hindari keputusan besar.',
    8: 'Tahun Materi, Otoritas, & Kelimpahan. Tahun karma materi, karier, dan pencapaian duniawi. Bisa ada kenaikan jabatan, peningkatan finansial, atau pengakuan hukum. Fokus pada ambisi, manajemen struktural, dan keseimbangan memberi-menerima.',
    9: 'Tahun Penyelesaian & Pelepasan. Tahun akhir siklus penuh. Saatnya melepaskan yang tidak lagi selaras (hubungan, pekerjaan, kebiasaan buruk). Bisa ada penyelesaian karma lama. Persiapkan ruang hampa untuk babak baru di tahun depan.',
    // 🛡️ FIX KAMUS 10: Diselaraskan penuh dengan esensi Wheel of Fortune (Roda Keberuntungan / Jupiter)
    10: 'Tahun Roda Berputar & Keberuntungan. Tahun yang penuh perubahan tidak terduga, pergeseran fatalistik, dan momentum keberuntungan. Roda kehidupan sedang bergerak naik. Jangan menolak arus atau memaksakan kendali yang kaku; bersiaplah mengambil peluang emas yang mendadak muncul ketika siklus semesta berpihak kepadamu.',
    11: 'Tahun Intuisi & Pencerahan Spiritual. Tahun master number. Sensitivitas dan intuisi sangat tinggi. Bisa ada panggilan spiritual atau misi jiwa yang semakin jelas. Jaga kesehatan saraf dan emosi.',
    12: 'Tahun Pengorbanan & Penyerahan. Belajar melepaskan kontrol dan mempercayai proses. Bisa ada situasi yang memaksa kamu "menggantung" sementara waktu. Akhirnya akan membawa kebijaksanaan.',
    13: 'Tahun Transformasi & Kebangkitan. Tahun perubahan besar (bisa terasa seperti "kematian" lama). Lepaskan yang lama agar yang baru bisa lahir. Sangat kuat untuk healing mendalam.',
    14: 'Tahun Moderasi & Adaptasi. Belajar keseimbangan dalam segala hal. Hindari ekstrem. Tahun yang baik untuk menyesuaikan diri dengan perubahan dan menjaga harmoni tubuh-jiwa.',
    15: 'Tahun Godaan & Keterikatan. Waspada terhadap godaan materi, nafsu, dan ketergantungan. Kekuatan untuk menguasai nafsu dan mengubahnya menjadi kreativitas positif.',
    16: 'Tahun Menara (Tower Year). Tahun kehancuran struktur lama yang tidak kokoh. Bisa ada perubahan mendadak. Semua yang runtuh adalah untuk membangun fondasi yang lebih baik.',
    17: 'Tahun Harapan & Inspirasi. Cahaya di ujung terowongan. Tahun penuh harapan, mimpi, dan koneksi spiritual. Cocok untuk manifestasi dan mengikuti bintang pribadi.',
    18: 'Tahun Ilusi & Intuisi. Tahun di mana ilusi bisa terbongkar. Intuisi sangat kuat, tapi waspadalah terhadap tipuan atau ketakutan bawah sadar. Cocok untuk membersihkan energi.',
    19: 'Tahun Sukses & Pencerahan. Tahun yang sangat positif. Pengakuan, kebahagiaan, dan pencapaian. Cahaya diri semakin bersinar.',
    20: 'Tahun Kerja Sama & Kesadaran Baru. Fokus pada hubungan dan kolaborasi. Bisa ada penyelesaian karma keluarga atau hubungan penting.',
    21: 'Tahun Kebebasan & Penyelesaian Siklus. Tahun puncak. Selesaikan siklus lama dan rayakan kebebasan. Persiapan untuk babak baru yang lebih ringan.',
    22: 'Tahun Master Builder. Tahun yang sangat kuat untuk mewujudkan mimpi besar. Bangun sesuatu yang bermanfaat untuk banyak orang. Potensi legacy yang tinggi.'
  };

  return interpretations[cardNumber] || 
    `Tahun Personal ${cardNumber}. Tahun ini membawa pelajaran dan peluang unik sesuai getaran Arcana ${cardNumber}. Tetap selaras dengan tujuan jiwa Anda.`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  header: {
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 24,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  year: { fontSize: 44, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  subtitle: { fontSize: 13, marginTop: 2, fontWeight: '700', color: '#FFFFFFCC', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardContainer: { marginHorizontal: 24, marginBottom: 20 },
  
  weatherCard: { marginHorizontal: 24, padding: 16, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, marginBottom: 20, ...SHADOWS.sm },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  gaugeGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  gaugeItem: { flex: 1, padding: 12, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  gaugeLabel: { fontSize: 9, fontWeight: '700', marginBottom: 4 },
  gaugeVal: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  temaBadge: { width: '100%', padding: 8, borderRadius: BORDER_RADIUS.sm, alignItems: 'center' },
  temaText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  interpretationBox: { marginHorizontal: 24, padding: 20, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, marginBottom: 24, ...SHADOWS.sm },
  interpretationTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', marginBottom: 10 },
  interpretationText: { fontSize: FONT_SIZE.sm, lineHeight: 24, fontWeight: '500' },
  backButton: { marginHorizontal: 24, padding: 16, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', ...SHADOWS.md },
  backButtonText: { color: '#FFFFFF', fontSize: FONT_SIZE.sm, fontWeight: '700' },
});
 