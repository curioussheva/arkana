import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { useAppStore } from '@store/app-store';
import { destinyCacheManager } from '@db/destiny-cache-manager';

export function SettingsScreen() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const resetStore = useAppStore((state) => state.reset);

  const handleClearCache = () => {
    Alert.alert(
      'Hapus Cache?',
      'Semua hasil Destiny Matrix yang tersimpan akan dihapus. Anda perlu menghitung ulang.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await destinyCacheManager.clearAllCache();
              resetStore();
              Alert.alert('Berhasil', 'Cache telah dihapus.');
            } catch (err) {
              const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
              Alert.alert('Gagal', message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pengaturan</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bahasa</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setLanguage(language === 'id' ? 'en' : 'id')}
          >
            <Text style={styles.buttonText}>
              {language === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearCache}>
            <Text style={styles.dangerButtonText}>Hapus Cache</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  button: { backgroundColor: COLORS.backgroundLight, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  buttonText: { fontSize: FONT_SIZE.md, color: COLORS.text, fontWeight: '500' },
  dangerButton: { backgroundColor: COLORS.error + '20', borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.error },
  dangerButtonText: { fontSize: FONT_SIZE.md, color: COLORS.error, fontWeight: '600' },
});
