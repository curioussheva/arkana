// Berkas: src/screens/DailyCardScreen.tsx
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card';
import { ArcanaCard } from '@components/ui/ArcanaCard';
import { formatDate } from '@core/utils/date-utils';
import { getChakraImpactFromDailyCard } from '@core/destiny-matrix/utils/chakra-transformer'; // 🧠 Impor engine dampak
import type { ArcanaDefinition } from '@core/arcana/types';

const STATUS_COLOR = {
  Balanced: '#10b981',
  Overactive: '#f59e0b',
  Blocked: '#ef4444',
} as const;

export function DailyCardScreen() {
  const colors = useThemeStore(state => state.getColors());
  const [dailyCard, setDailyCard] = useState<ArcanaDefinition | null>(null);

  useEffect(() => {
    const card = getRandomDailyCard();
    setDailyCard(card);
  }, []);

  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Jika ingin fitur refresh aktif, tinggal buka baris di bawah ini:
    // setDailyCard(getRandomDailyCard());
  }, []);

  const displayArcanaId = dailyCard?.id === 0 ? 22 : dailyCard?.id;

  // 🌀 EVALUASI DAMPAK CHAKRA: Dihitung dinamis setiap kali kartu harian termuat
  const chakraImpact = useMemo(() => {
    if (!dailyCard) return null;
    return getChakraImpactFromDailyCard(dailyCard);
  }, [dailyCard]);

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

  if (!dailyCard || !displayArcanaId || !chakraImpact) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: colors.text }}>Memuat cetak kartu harian...</Text>
      </SafeAreaView>
    );
  }

  const visualCardData = {
    ...dailyCard,
    id: displayArcanaId,
  };

  const statusColor = STATUS_COLOR[chakraImpact.status];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient colors={colors.gradients.headerGradient} style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>🃏 Kartu Harian</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
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
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' },
            ]}
            onPress={handleRefresh}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>🔄 Segarkan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' },
            ]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>📤 Bagikan</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Kotak Deskripsi Interpretasi Kartu */}
        <Animated.View
          entering={FadeIn.delay(500)}
          style={[
            styles.meaningBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.meaningTitle, { color: colors.text }]}>💬 Pesan Hari Ini</Text>
          <Text style={[styles.meaningText, { color: colors.textSecondary }]}>
            {dailyCard.uprightMeaning}
          </Text>
        </Animated.View>

        {/* ─── NEW WIDGET: INDIKATOR RESONANSI FLUKTUASI CHAKRA HARIAN ─── */}
        <Animated.View
          entering={FadeIn.delay(650)}
          style={[
            styles.chakraImpactCard,
            { backgroundColor: colors.surface, borderColor: statusColor + '40' },
          ]}
        >
          <View style={styles.chakraImpactHeader}>
            <Text style={[styles.chakraImpactTitle, { color: colors.text }]}>
              🧘 Dampak Transmutasi Chakra
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                {chakraImpact.status}
              </Text>
            </View>
          </View>

          <Text style={[styles.chakraTargetText, { color: colors.text }]}>
            Nodal Terpengaruh:{' '}
            <Text style={{ fontWeight: '800', color: colors.primary }}>
              {chakraImpact.chakraName} Chakra
            </Text>
          </Text>

          <Text style={[styles.chakraReasonText, { color: colors.textSecondary }]}>
            {chakraImpact.reason}
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
    paddingTop: 44,
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
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
  actionButtonText: { fontSize: 14, fontWeight: '700' },

  meaningBox: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  meaningTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  meaningText: { fontSize: 14, lineHeight: 22 },

  // Gaya lembar baru untuk widget cakra harian
  chakraImpactCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  chakraImpactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chakraImpactTitle: { fontSize: 14, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  chakraTargetText: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  chakraReasonText: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
});
