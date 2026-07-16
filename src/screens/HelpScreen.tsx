// src/screens/HelpScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';

export function HelpScreen() {
  const colors = useThemeStore(state => state.getColors());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>📖 Panduan Penggunaan</Text>

        <Section title="🔢 Memasukkan Tanggal Lahir" color={colors.text}>
  Gunakan format DD/MM/YYYY. Setelah mengisi, tekan tombol &quot;Hitung Matriks&quot;.
  Hasil perhitungan akan langsung ditampilkan di tab Matriks dan Insight.
</Section>

        <Section title="💎 Memahami Diagram Matriks" color={colors.text}>
          Diagram berbentuk diamond menampilkan titik-titik energi (A-T dan A1-E2).
          Setiap titik memiliki nilai 1-22 yang dipetakan ke kartu Arcana Mayor.
          Tap titik mana pun untuk melihat detail artinya.
        </Section>

        <Section title="🃏 Arti Setiap Titik" color={colors.text}>
          - **A**: Hari Lahir – identitas dasar{'\n'}
          - **B**: Bulan Lahir – respons emosi{'\n'}
          - **C**: Garis Keturunan – energi leluhur{'\n'}
          - **D**: Sintesis Pertama – arah hidup{'\n'}
          - **E**: Titik Pusat – esensi jiwa{'\n'}
          - **F**: Zona Nyaman{'\n'}
          - **G**: Zona Sosial{'\n'}
          - **H**: Zona Tantangan{'\n'}
          - **I**: Zona Keseimbangan{'\n'}
          - **J**: Bakat Tersembunyi{'\n'}
          - **K**: Kekuatan Batin{'\n'}
          - **L**: Potensi Spiritual{'\n'}
          - **M**: Arah Perkembangan{'\n'}
          - **N-T**: Ekstensi tambahan{'\n'}
          - **A1-E2**: Titik pendukung yang memberi detail lebih dalam.
        </Section>

        <Section title="🌟 Insight & Roda Takdir" color={colors.text}>
          Tab Insight memberikan narasi personal berdasarkan elemen dominan dan kartu inti Anda.
          Roda Takdir menunjukkan urutan kartu yang membentuk perjalanan spiritual Anda.
          Ikuti langkahnya untuk mengembangkan potensi diri.
        </Section>

        <Section title="🕐 Timeline Arcana Tahunan" color={colors.text}>
          Setiap tahun memiliki kartu yang memengaruhi energi Anda.
          Gunakan tab Timeline untuk melihat arcana tahunan dari masa lalu hingga masa depan.
        </Section>

        <Section title="💑 Compatibility" color={colors.text}>
          Masukkan tanggal lahir pasangan untuk melihat skor kecocokan dan elemen dominan kalian.
        </Section>

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          Aplikasi ini adalah alat bantu refleksi diri. Tidak ada yang bersifat mutlak.
          Gunakan dengan bijak dan selalu andalkan intuisi Anda sendiri.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <Text style={[styles.sectionText, { color: useThemeStore.getState().getColors().textSecondary }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: '800', marginBottom: SPACING.lg },
  section: {
    marginBottom: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
  },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', marginBottom: SPACING.xs },
  sectionText: { fontSize: FONT_SIZE.md, lineHeight: 24 },
  disclaimer: { fontSize: FONT_SIZE.sm, fontStyle: 'italic', textAlign: 'center', marginTop: SPACING.xl },
});