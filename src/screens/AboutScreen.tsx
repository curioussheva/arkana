import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';

export function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tentang Destiny Matrix</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Singkat</Text>
          <Text style={styles.paragraph}>
            Destiny Matrix (juga dikenal sebagai Matrix of Destiny) adalah sistem yang
            disusun oleh Natalia Ladini pada tahun 2006. Sistem ini menggabungkan prinsip
            numerologi Pythagoras dengan arketipe 22 Arcana Mayor dari kartu Tarot.
          </Text>
          <Text style={styles.paragraph}>
            Perlu diketahui: ini adalah sistem modern, bukan tradisi kuno turun-temurun
            seperti yang kadang diklaim di berbagai kalkulator online. Popularitasnya
            berkembang pesat lewat media sosial dalam beberapa tahun terakhir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metode yang Digunakan</Text>
          <Text style={styles.paragraph}>
            Aplikasi ini menghitung 20 titik energi (A sampai T) murni dari tanggal lahir
            Anda. Setiap nilai berada pada rentang 1-22 dan dipetakan langsung ke salah
            satu dari 22 kartu Arcana Mayor.
          </Text>
          <Text style={styles.paragraph}>
            Titik A-M (13 titik inti) dihitung mengikuti metode yang telah kami
            verifikasi terhadap contoh perhitungan resmi. Titik N-T (7 titik tambahan)
            juga menggunakan formula yang terverifikasi dari sumber yang sama, namun
            makna interpretifnya adalah rangkuman kami sendiri — bukan tradisi baku
            yang mapan.
          </Text>
<Text style={styles.paragraph}>
  Kami secara sengaja <Text style={styles.emphasis}>tidak menyertakan</Text>{' '}
  fitur seperti {"\"Love Line\""}, {"\"Money Line\""}, atau pemetaan usia spesifik,
  karena sumber-sumber publik yang tersedia saling bertentangan dan tidak
  dapat kami pertanggungjawabkan keakuratannya.
</Text>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privasi & Data</Text>
          <Text style={styles.paragraph}>
            Semua data yang Anda masukkan (tanggal lahir, nama profil) disimpan{' '}
            <Text style={styles.emphasis}>hanya di perangkat Anda sendiri</Text>,
            menggunakan penyimpanan lokal. Aplikasi ini tidak mengirim data Anda ke
            server manapun, tidak ada sinkronisasi cloud, dan tidak ada pelacakan pihak
            ketiga.
          </Text>
          <Text style={styles.paragraph}>
            Anda dapat menghapus seluruh data kapan saja melalui menu Pengaturan →
            Hapus Cache.
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ Perlu Diperhatikan</Text>
          <Text style={styles.disclaimerText}>
            Aplikasi ini adalah alat bantu refleksi diri, bukan sumber kebenaran mutlak.
            Seakurat apapun perhitungannya, hasil dari aplikasi ini{' '}
            <Text style={styles.emphasis}>tidak boleh dijadikan patokan pasti</Text>{' '}
            tentang masa depan, jodoh, rezeki, atau keputusan hidup penting lainnya.
          </Text>
          <Text style={styles.disclaimerText}>
            Perihal takdir sepenuhnya berada dalam ranah kehendak Tuhan. Gunakan
            aplikasi ini sebagai bahan perenungan dan pengenalan diri — bukan sebagai
            pengganti doa, ikhtiar, atau musyawarah dengan orang-orang yang Anda
            percaya.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  paragraph: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  emphasis: {
    fontWeight: '700',
    color: COLORS.text,
  },
  disclaimerBox: {
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.warning,
    marginTop: SPACING.sm,
  },
  disclaimerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: SPACING.sm,
  },
  disclaimerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
});
