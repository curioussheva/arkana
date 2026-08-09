import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

export function HelpScreen() {
  const colors = useThemeStore(state => state.getColors());

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>📖 Panduan Penggunaan</Text>

        {/* 1. Tanggal Lahir */}
        <Section title="🔢 Memasukkan Tanggal Lahir">
          Gunakan format DD/MM/YYYY pada beranda. Setelah dihitung, cetak biru matriks takdirmu akan
          langsung aktif dan bisa diakses secara mendalam di tab Matriks, Insight, Timeline, dan
          Pasangan.
        </Section>

        {/* 2. Memahami Diagram Matriks */}
        <Section title="💎 Memahami Diagram Matriks">
          Diagram Matriks Takdir memetakan{' '}
          <Text style={styles.boldText}>20 koordinat energi jiwamu (A sampai T)</Text>. Setiap titik
          memiliki nilai 1–22 yang dipetakan secara khusus ke dalam 22 Arketipe Arcana Mayor.
          Tap/ketuk titik mana pun di diagram untuk membuka lembar analisis detail.
        </Section>

        {/* 3. Panduan Peta 20 Titik Core */}
        <Section title="🃏 Peta Koordinat Energi Utama (A–T)">
          • <Text style={styles.boldText}>A</Text> : Hari Lahir (Karakter & Topeng Fisik){'\n'}•{' '}
          <Text style={styles.boldText}>B</Text> : Bulan Lahir (Kekuatan Mental & Intuisi){'\n'}•{' '}
          <Text style={styles.boldText}>C</Text> : Tahun Lahir (Kelimpahan & Finansial){'\n'}•{' '}
          <Text style={styles.boldText}>D</Text> : Karma Masa Lalu (Akar Masalah Bawah Sadar){'\n'}•{' '}
          <Text style={styles.boldText}>E</Text> : Titik Pusat (Inti Jiwa & Rumah Batin){'\n'}•{' '}
          <Text style={styles.boldText}>F–M</Text> : Titik Karir, Ujian Karakter, & Potensi Talenta
          {'\n'}• <Text style={styles.boldText}>N–T</Text> : Ekstensi Garis Takdir, Misi Hidup, &
          Spiritualitas
        </Section>

        {/* 4. Insight & Alur Evolusi */}
        <Section title="🌌 Insight & Refleksi Batin">
          Tab Insight menyajikan intisari diri berdasarkan elemen dominan, statistik sebaran arcana,
          hingga utang karma. Fitur <Text style={styles.boldText}>Alur Evolusi Jiwa</Text> membantu
          mengukur apakah energimu sedang dalam kondisi{' '}
          <Text style={styles.boldText}>Terhambat, Transisi,</Text> atau{' '}
          <Text style={styles.boldText}>Mengalir Selaras (Flow)</Text>.
        </Section>

        {/* 5. Totem Sanctuary */}
        <Section title="🦅 Totem Sanctuary (Aliansi 4 Pilar)">
          20 koordinat energimu didistribusikan secara otomatis ke dalam 4 Pilar Penjaga Elemen:{' '}
          <Text style={styles.boldText}>Malaikat (Udara)</Text>,{' '}
          <Text style={styles.boldText}>Elang (Air)</Text>,{' '}
          <Text style={styles.boldText}>Singa (Api)</Text>, dan{' '}
          <Text style={styles.boldText}>Lembu (Bumi)</Text>. Gunakan seksi ini untuk melihat pilar
          mana yang paling dominan menopang takdirmu.
        </Section>

        {/* 6. Timeline Arcana */}
        <Section title="🕐 Timeline Arcana Tahunan">
          Setiap fase usia dipengaruhi oleh siklus Arcana tertentu. Gunakan tab Timeline untuk
          memetakan dinamika energi, peluang rezeki, dan potensi ujian dari tahun ke tahun.
        </Section>

        {/* 7. Compatibility / Pasangan */}
        <Section title="💑 Compatibility & Composite Matrix">
          Masukkan tanggal lahir pasangan untuk mengalkulasi skor keselarasan, elemen dominan, serta{' '}
          <Text style={styles.boldText}>Arcana Pusat Komposit (Titik E Bersama)</Text> untuk
          memahami dinamika dan tantangan karma hubungan kalian.
        </Section>

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          Aplikasi ini adalah alat bantu refleksi dan pengenalan diri. Tidak ada yang bersifat
          mutlak. Gunakan dengan bijak dan selalu andalkan intuisi serta doa kepada Tuhan.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useThemeStore(state => state.getColors());

  return (
    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: '800', marginBottom: SPACING.lg },
  section: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', marginBottom: SPACING.xs },
  sectionText: { fontSize: FONT_SIZE.sm, lineHeight: 22 },
  boldText: { fontWeight: '700' },
  disclaimer: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: 18,
  },
});

export default HelpScreen;
