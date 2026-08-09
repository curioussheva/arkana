import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';

export function AboutScreen() {
  const colors = useThemeStore(state => state.getColors());

  const handleOpenEmail = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const emailUrl = 'mailto:curioussheva@gmail.com?subject=Tanya%20ARKANA%20Destiny%20Matrix';

    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Gagal Membuka Email', 'Aplikasi email tidak ditemukan di perangkat Anda.');
      }
    } catch {
      Alert.alert('Error', 'Tidak dapat membuka aplikasi email.');
    }
  };

  const handleOpenFacebook = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const fbUrl = 'https://www.facebook.com/61580121814342/';

    try {
      await Linking.openURL(fbUrl);
    } catch {
      Alert.alert('Error', 'Tidak dapat membuka tautan Facebook.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header App Title */}
        <Text style={[styles.title, { color: colors.text }]}>Tentang Destiny Matrix</Text>

        {/* 1. Riwayat Singkat */}
        <View
          style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📜 Riwayat Singkat</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Destiny Matrix (Matrix of Destiny) adalah sistem numerologi psiko-spiritual yang disusun
            oleh Natalia Ladini pada tahun 2006. Sistem ini menyatukan prinsip numerologi Pythagoras
            dengan arketipe 22 Arcana Mayor dari kartu Tarot.
          </Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Perlu diketahui bahwa sistem ini adalah metode modern yang berkembang pesat dalam
            beberapa tahun terakhir sebagai sarana navigasi refleksi batin dan pengenalan potensi
            diri.
          </Text>
        </View>

        {/* 2. Metode Perhitungan */}
        <View
          style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🧮 Metode Perhitungan Murni
          </Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Aplikasi ini menghitung{' '}
            <Text style={[styles.emphasis, { color: colors.text }]}>
              20 titik energi core utama (A sampai T)
            </Text>{' '}
            murni dari tanggal lahir Anda. Setiap titik dipetakan secara deterministik (1-22) ke
            arketipe Arcana Mayor.
          </Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Titik A-M (13 titik inti) dihitung berdasarkan formula matematika terverifikasi. Titik
            N-T (7 titik tambahan) dipetakan menggunakan acuan sumber publik yang kami olah
            narasinya agar lebih intuitif dan aplikatif dalam kehidupan sehari-hari.
          </Text>
        </View>

        {/* 3. Ringkasan Fitur Unggulan Aplikasi (NEW) */}
        <View
          style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>✨ Modul & Fitur Utama</Text>

          <View style={styles.featureItem}>
            <Text
              style={[
                styles.featureBadge,
                { backgroundColor: colors.primary + '18', color: colors.primary },
              ]}
            >
              01
            </Text>
            <View style={styles.featureTextWrapper}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Matrix & Wheel Interactive
              </Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                Visualisasi radar 20 koordinat energi jiwamu secara interaktif.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text
              style={[
                styles.featureBadge,
                { backgroundColor: colors.primary + '18', color: colors.primary },
              ]}
            >
              02
            </Text>
            <View style={styles.featureTextWrapper}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Totem Sanctuary (4 Pilar)
              </Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                Pengelompokan 20 titik takdir ke dalam 4 pilar elemen penyeimbang (Air, Api, Udara,
                Bumi).
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text
              style={[
                styles.featureBadge,
                { backgroundColor: colors.primary + '18', color: colors.primary },
              ]}
            >
              03
            </Text>
            <View style={styles.featureTextWrapper}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Dynamic Refleksi & Assessment
              </Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                Kuis psikologis untuk mengukur tingkat keselarasan dan alur evolusi jiwa saat ini.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text
              style={[
                styles.featureBadge,
                { backgroundColor: colors.primary + '18', color: colors.primary },
              ]}
            >
              04
            </Text>
            <View style={styles.featureTextWrapper}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Compatibility & Composite Engine
              </Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                Analisis kecocokan energi makrokosmos dan gabungan arketipe jiwa bersama pasangan.
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Privasi & Data */}
        <View
          style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🔒 Privasi & Keamanan Data
          </Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Seluruh data yang Anda masukkan (nama dan tanggal lahir) disimpan{' '}
            <Text style={[styles.emphasis, { color: colors.text }]}>
              100% lokal di perangkat Anda sendiri
            </Text>
            . Aplikasi ini bekerja penuh secara offline tanpa server eksternal, tanpa sinkronisasi
            cloud, dan bebas pelacak pihak ketiga.
          </Text>
        </View>

        {/* 5. Disclaimer / Warning Box */}
        <View
          style={[
            styles.disclaimerBox,
            { backgroundColor: colors.warning + '12', borderColor: colors.warning },
          ]}
        >
          <Text style={[styles.disclaimerTitle, { color: colors.warning }]}>
            ⚠️ Perlu Diperhatikan
          </Text>
          <Text style={[styles.disclaimerText, { color: colors.text }]}>
            Aplikasi ini adalah alat bantu refleksi dan pengenalan diri, bukan sumber kebenaran
            mutlak.{' '}
            <Text style={[styles.emphasis, { color: colors.text }]}>
              Hasil kalkulasi tidak boleh dijadikan penentu pasti
            </Text>{' '}
            mengenai masa depan, rezeki, atau keputusan penting kehidupan.
          </Text>
          <Text style={[styles.disclaimerText, { color: colors.text, marginBottom: 0 }]}>
            Perihal takdir berada dalam ranah kehendak Tuhan. Gunakan aplikasi ini sebagai bahan
            musyawarah dan perenungan batin.
          </Text>
        </View>

        {/* 6. Contact & Social Links (NEW) */}
        <View style={[styles.contactSection, { borderColor: colors.border }]}>
          <Text style={[styles.contactHeading, { color: colors.textMuted }]}>
            HUBUNGI & IKUTI KAMI
          </Text>

          <View style={styles.contactButtonsRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={handleOpenEmail}
              activeOpacity={0.7}
            >
              <Text style={styles.btnIcon}>✉️</Text>
              <Text style={[styles.btnText, { color: colors.text }]}>Kirim Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={handleOpenFacebook}
              activeOpacity={0.7}
            >
              <Text style={styles.btnIcon}>🌐</Text>
              <Text style={[styles.btnText, { color: colors.text }]}>Facebook Resmi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: SPACING.lg,
  },
  section: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  paragraph: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  emphasis: {
    fontWeight: '700',
  },

  /* Feature List Styles */
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  featureBadge: {
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  featureDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  /* Disclaimer Box */
  disclaimerBox: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  disclaimerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  disclaimerText: {
    fontSize: FONT_SIZE.xs,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },

  /* Contact & Social Section */
  contactSection: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 0.5,
  },
  contactHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  btnIcon: {
    fontSize: FONT_SIZE.md,
  },
  btnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
});

export default AboutScreen;
