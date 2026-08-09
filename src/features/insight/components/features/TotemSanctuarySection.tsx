// Berkas: src/features/insight/components/features/TotemSanctuarySection.tsx

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '@constants/theme';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card';
import { getArcanaImage } from '@constants/arcana-images';
import { getTotemImage } from '@constants/totemImages';

interface TotemData {
  key: string;
  icon: string;
  name: string;
  element: string;
  zodiac: string;
  color: string;
  trait: string;
  advice: string;
  pointsCount: number;
  pointsLabels: string[];
}

interface Props {
  totemAlliance: TotemData[];
}

export function TotemSanctuarySection({ totemAlliance }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const [selectedTotem, setSelectedTotem] = useState<string | null>(null);

  const activeTotemInfo = totemAlliance.find(t => t.key === selectedTotem);

  // 🃏 EVALUASI KARTU HARIAN DENGAN ELEMEN TOTEM
  const dailyCardImpact = useMemo(() => {
    try {
      const card = getRandomDailyCard();
      if (!card) return null;
      return {
        element: card.element,
        cardName: card.tarotName,
        cardId: card.id === 0 ? 22 : card.id,
      };
    } catch {
      return null;
    }
  }, []);

  // 🌀 ENGINE CROSS-BUFF: Hitung apakah ada manifestasi Roda Takdir (Arcana 10)
  const resonanceAnalysis = useMemo(() => {
    if (!activeTotemInfo) return null;

    const wheelPoints = activeTotemInfo.pointsLabels.filter(
      label => /(Arcana|#)\s*10\b/i.test(label) || label.endsWith(' 10')
    );

    const hasWheelOfFortune = wheelPoints.length > 0;
    const basePower = activeTotemInfo.pointsCount * 10;
    const buffPercentage = wheelPoints.length * 35;
    const totalPower = hasWheelOfFortune
      ? Math.round(basePower * (1 + buffPercentage / 100))
      : basePower;

    return {
      hasWheelOfFortune,
      wheelPoints,
      buffPercentage,
      totalPower,
    };
  }, [activeTotemInfo]);

  return (
    <Animated.View layout={LinearTransition.springify()} style={styles.container}>
      {/* ─── HEADER BANNER DENGAN VISUAL ARKANA #21 (THE WORLD) ─── */}
      <View
        style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Image source={getArcanaImage(21)} style={styles.worldCardImage} resizeMode="cover" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerBadge, { color: colors.primary }]}>
            INTEGRASI TOTAL • ARKANA #21
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>Aliansi 4 Totem Penjaga</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manifestasi Keseimbangan Absolut &amp; Keutuhan Jiwa. Arkana #21 (The World) menyatukan
            20 koordinat takdirmu ke dalam 4 pilar.
          </Text>
        </View>
      </View>

      {/* ─── GRID 4 TOTEM PENJAGA DENGAN CANVAS KARTU UTUH ─── */}
      <View style={styles.grid}>
        {totemAlliance.map((totem, index) => {
          const isSelected = selectedTotem === totem.key;
          const isResonatingWithWheel = totem.pointsLabels.some(
            l => /(Arcana|#)\s*10\b/i.test(l) || l.endsWith(' 10')
          );

          const isDailyTransit =
            dailyCardImpact?.element.toLowerCase() === totem.element.toLowerCase() ||
            (totem.element === 'Udara' && dailyCardImpact?.element === 'Air') ||
            (totem.element === 'Air' && dailyCardImpact?.element === 'Water') ||
            (totem.element === 'Api' && dailyCardImpact?.element === 'Fire') ||
            (totem.element === 'Bumi' && dailyCardImpact?.element === 'Earth');

          return (
            <Animated.View
              entering={FadeInDown.delay(index * 75).duration(400)}
              key={totem.key}
              style={[
                styles.card,
                {
                  borderColor: isSelected
                    ? totem.color
                    : isResonatingWithWheel
                      ? '#ffd700'
                      : isDailyTransit
                        ? colors.primary
                        : totem.color + '40',
                  backgroundColor: isSelected ? totem.color + '10' : colors.surface,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setSelectedTotem(prev => (prev === totem.key ? null : totem.key))}
                activeOpacity={0.8}
                style={styles.clickableArea}
              >
                {/* Visual Canvas Gambar Totem Utuh (Respektif 1:1 Tanpa Terpotong) */}
                <View style={[styles.totemImageContainer, { backgroundColor: '#FDFBF7' }]}>
                  <Image
                    source={getTotemImage(totem.key)}
                    style={styles.totemCanvasImage}
                    resizeMode="contain" // 👈 Menampilkan SELURUH bingkai & grid tanpa terpotong!
                  />

                  {/* Badge Indikator di Atas Gambar */}
                  {isResonatingWithWheel ? (
                    <View style={styles.miniPulseBadge}>
                      <Text style={styles.miniPulseText}>🌀 SINKRON</Text>
                    </View>
                  ) : isDailyTransit ? (
                    <View
                      style={[
                        styles.miniPulseBadge,
                        { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                      ]}
                    >
                      <Text style={[styles.miniPulseText, { color: colors.primary }]}>
                        ⚡ TRANSIT
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Deskripsi Teks Bawah Card */}
                <View style={styles.cardContent}>
                  <Text style={[styles.totemName, { color: colors.text }]}>{totem.name}</Text>
                  <Text style={[styles.zodiacText, { color: colors.textMuted }]}>
                    ⚖️ {totem.zodiac}
                  </Text>

                  <View style={[styles.badge, { backgroundColor: totem.color + '20' }]}>
                    <Text style={[styles.badgeText, { color: totem.color }]}>
                      {totem.pointsCount} Titik Energi
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* ─── PANEL DETAIL EKSPANSI BATIN INTERAKTIF ─── */}
      {activeTotemInfo && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          style={[
            styles.detailBox,
            { backgroundColor: colors.surface, borderColor: activeTotemInfo.color },
          ]}
        >
          <View style={styles.detailHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image
                source={getTotemImage(activeTotemInfo.key)}
                style={styles.detailAvatar}
                resizeMode="contain"
              />
              <Text style={[styles.detailTitle, { color: colors.text }]}>
                Penjaga {activeTotemInfo.name} ({activeTotemInfo.element})
              </Text>
            </View>
            <Text style={[styles.detailZodiac, { color: activeTotemInfo.color }]}>
              {activeTotemInfo.zodiac}
            </Text>
          </View>

          {/* BANNER TRANSIT HARIAN */}
          {dailyCardImpact &&
            ((activeTotemInfo.element === 'Udara' && dailyCardImpact.element === 'Air') ||
              (activeTotemInfo.element === 'Air' && dailyCardImpact.element === 'Water') ||
              (activeTotemInfo.element === 'Api' && dailyCardImpact.element === 'Fire') ||
              (activeTotemInfo.element === 'Bumi' && dailyCardImpact.element === 'Earth')) && (
              <View
                style={[
                  styles.transitBanner,
                  { backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' },
                ]}
              >
                <Image
                  source={getArcanaImage(dailyCardImpact.cardId)}
                  style={styles.transitCardImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.transitTitle, { color: colors.primary }]}>
                    ⚡ Active Transit: {dailyCardImpact.cardName}
                  </Text>
                  <Text style={[styles.transitBody, { color: colors.textSecondary }]}>
                    Kartu Tarot Harian (#{dailyCardImpact.cardId}) mengaktifkan gerbang{' '}
                    {activeTotemInfo.element} hari ini.
                  </Text>
                </View>
              </View>
            )}

          {/* BANNER RESONANSI ARTIFAK (#10 WHEEL OF FORTUNE) */}
          {resonanceAnalysis?.hasWheelOfFortune && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.resonanceBanner}>
              <Image source={getArcanaImage(10)} style={styles.wheelCardImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resonanceTitle}>Resonansi Roda Takdir Aktif!</Text>
                <Text style={[styles.resonanceBody, { color: colors.textSecondary }]}>
                  Arkana #10 menduduki pilar ini. Lonjakan kapasitas batin bertambah{' '}
                  <Text style={{ fontWeight: '800', color: colors.text }}>
                    +{resonanceAnalysis.buffPercentage}%
                  </Text>
                  .
                </Text>
              </View>
            </Animated.View>
          )}

          <Text style={[styles.detailTrait, { color: colors.text }]}>
            <Text style={{ fontWeight: '700', color: colors.primary }}>Arketipe Gerbang: </Text>
            {activeTotemInfo.trait}
          </Text>

          <Text style={[styles.detailAdvice, { color: colors.textSecondary }]}>
            <Text style={{ fontWeight: '700', color: colors.primary }}>Pesan Penyelaras: </Text>
            {activeTotemInfo.advice}
          </Text>

          {/* CHIPS TITIK TERIKAT */}
          {activeTotemInfo.pointsLabels?.length > 0 && (
            <View style={[styles.pointsChipContainer, { borderTopColor: colors.border + '40' }]}>
              <Text style={[styles.chipTitle, { color: colors.textMuted }]}>
                Titik Jangkar Terikat:
              </Text>
              <View style={styles.chipsWrapper}>
                {activeTotemInfo.pointsLabels.map(label => {
                  const isWheelPoint = /(Arcana|#)\s*10\b/i.test(label) || label.endsWith(' 10');
                  return (
                    <View
                      key={label}
                      style={[
                        styles.pointChip,
                        {
                          backgroundColor: isWheelPoint ? '#ffd70018' : colors.backgroundLight,
                          borderColor: isWheelPoint ? '#ffd700' : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.chipText, { color: isWheelPoint ? '#b69100' : colors.text }]}
                      >
                        {isWheelPoint ? `🔮 ${label} (Amplified)` : label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.xl, paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  worldCardImage: { width: 50, height: 80, borderRadius: BORDER_RADIUS.sm },
  headerBadge: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: FONT_SIZE.md, fontWeight: '800', marginTop: 1 },
  subtitle: { fontSize: 11, lineHeight: 16, marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  clickableArea: { width: '100%' },

  // Canvas Container Utama Gambar Totem
  totemImageContainer: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    paddingTop: 25,
  },
  totemCanvasImage: { width: '100%', height: '100%' },

  cardContent: { padding: SPACING.md, alignItems: 'center' },
  totemName: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  zodiacText: { fontSize: 10, marginVertical: 3, fontWeight: '500' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 4,
  },
  badgeText: { fontSize: 10, fontWeight: '800' },

  miniPulseBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ffd70040',
    borderColor: '#ffd700',
    borderWidth: 0.8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniPulseText: { fontSize: 8, fontWeight: '900', color: '#856400' },

  detailBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderLeftWidth: 5,
    ...SHADOWS.sm,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailAvatar: { width: 36, height: 36, borderRadius: BORDER_RADIUS.sm },
  detailTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  detailZodiac: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  detailTrait: { fontSize: FONT_SIZE.sm, lineHeight: 20, marginBottom: 6 },
  detailAdvice: { fontSize: FONT_SIZE.sm, lineHeight: 20, marginBottom: 4 },

  transitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  transitCardImage: { width: 30, height: 48, borderRadius: 4 },
  transitTitle: { fontSize: 11, fontWeight: '800' },
  transitBody: { fontSize: 10, lineHeight: 14 },

  resonanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffd70012',
    borderColor: '#ffd70040',
    borderWidth: 1,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  wheelCardImage: { width: 32, height: 50, borderRadius: 4 },
  resonanceTitle: { fontSize: 12, fontWeight: '800', color: '#b69100' },
  resonanceBody: { fontSize: 11, lineHeight: 15, marginTop: 1 },

  pointsChipContainer: { marginTop: SPACING.sm, borderTopWidth: 0.5, paddingTop: SPACING.sm },
  chipTitle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pointChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 0.5,
  },
  chipText: { fontSize: 10, fontWeight: '700' },
});

export default TotemSanctuarySection;
