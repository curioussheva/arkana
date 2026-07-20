// src/screens/DailyCardScreen.tsx
import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card';
import { ArcanaCard } from '@components/ui/ArcanaCard';
import { formatDate } from '@core/utils/date-utils'; // 🎯 UTILITAS INTEGRASI: Menggunakan parser terpusat
import type { ArcanaDefinition } from '@core/arcana/types';

export function DailyCardScreen() {
  const colors = useThemeStore(state => state.getColors());
  const [dailyCard, setDailyCard] = useState<ArcanaDefinition | null>(null);

  // Ambil kartu harian berdasarkan tanggal saat komponen dimuat
  useEffect(() => {
    const card = getRandomDailyCard();
    setDailyCard(card);
  }, []);

  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Catatan: Jika ingin memaksa pengacakan ulang kartu per klik, 
    // Anda bisa aktifkan baris di bawah ini:
    // setDailyCard(getRandomDailyCard());
  }, []);

  // 🔮 INTERSEPTOR VISUAL UI: Konversi ID 0 menjadi 22 agar selaras dengan skema UI aplikasi
  const displayArcanaId = dailyCard?.id === 0 ? 22 : dailyCard?.id;

  const handleShare = useCallback(async () => {
    if (!dailyCard || !displayArcanaId) return;
    try {
      await Share.share({
        message: `🃏 Kartu Harianku: [${displayArcanaId}] ${dailyCard.tarotName}\n\n${dailyCard.uprightMeaning}\n\n✨ Arkana Numerology`,
        title: 'Kartu Tarot Harian',
      }); 
    } catch (error) {
      console.log(error);
    }
  }, [dailyCard, displayArcanaId]);

  if (!dailyCard || !displayArcanaId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.text }}>Memuat kartu...</Text>
      </SafeAreaView>
    );
  }

  // Kloning data objek untuk menyuntikkan nomor displayId (#22) ke visual kartu
  const visualCardData = {
    ...dailyCard,
    id: displayArcanaId
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient
            colors={colors.gradients.headerGradient}
            style={styles.header}
          >
            <Text style={[styles.headerTitle, { color: colors.text }]}>🃏 Kartu Harian</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {/* 🎯 SINKRONISASI TANGGAL: Menggunakan format pelokalan date-utils */}
              {formatDate(new Date(), 'EEEE, dd MMMM yyyy')}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Visual Kartu */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)}>
          <View style={[styles.cardContainer, { backgroundColor: colors.surface }]}>
            <ArcanaCard arcana={visualCardData} variant="full" showMeaning showKeywords />
          </View>
        </Animated.View>

        {/* Tombol Aksi */}
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}
            onPress={handleRefresh}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>🔄 Segarkan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>📤 Bagikan</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Kotak Deskripsi / Pesan */}
        <Animated.View entering={FadeIn.delay(600)} style={[styles.meaningBox, { backgroundColor: colors.backgroundLight }]}>
          <Text style={[styles.meaningTitle, { color: colors.text }]}>💬 Pesan Hari Ini</Text>
          <Text style={[styles.meaningText, { color: colors.textSecondary }]}>
            {dailyCard.uprightMeaning}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 48 },
  header: {
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 24,
  },
  headerTitle: { fontSize: 32, fontWeight: '800', marginBottom: 4 },
  headerSubtitle: { fontSize: 14 },
  cardContainer: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionButtonText: { fontSize: 14, fontWeight: '600' },
  meaningBox: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 20,
  },
  meaningTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  meaningText: { fontSize: 16, lineHeight: 24 },
});
 