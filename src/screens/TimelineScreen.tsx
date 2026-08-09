// Berkas: src/screens/TimelineScreen.tsx

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { calculatePersonalYearArcana } from '@core/destiny-matrix/personal-year';
import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';
import type { ElementType } from '@components/ui/ArkanaCard/types';
import type { ArcanaDefinition } from '@core/arcana/types';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const YEARS_BEFORE = 3;
const YEARS_AFTER = 6;

type TimelineEra = 'past' | 'present' | 'future';

interface TimelineEntry {
  year: number;
  personalYearValue: number;
  arcana: ArcanaDefinition;
  era: TimelineEra;
  isCurrent: boolean;
}

// ─── Constants ─────────────────
const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  '3xl': 32,
  '4xl': 48,
} as const;
const BORDER_RADIUS = { sm: 4, md: 8, lg: 12, xl: 16, '2xl': 20, '3xl': 28, full: 9999 } as const;
const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export function TimelineScreen() {
  const colors = useThemeStore(state => state.getColors());
  const scrollRef = useRef<ScrollView>(null);
  const matrix = useAppStore(state => state.currentMatrix);

  // 🛡️ FIX NAVIGASI: Gunakan StackNavigationProp agar sanggup melakukan transisi ke screen 'PersonalYear'
  const navigation = useNavigation<StackNavigationProp<any>>();

  const currentYearLayoutY = useRef<number>(0);
  const currentYear = useMemo(() => {
    // Memastikan tahun dievaluasi tepat saat rendering tanpa masalah caching zona waktu lokal
    return new Date().getFullYear();
  }, []);

  const timeline = useMemo(() => {
    if (!matrix) return [];
    const entries: TimelineEntry[] = [];
    for (let y = currentYear - YEARS_BEFORE; y <= currentYear + YEARS_AFTER; y++) {
      const py = calculatePersonalYearArcana(matrix.input.birthDate, y);
      let era: TimelineEra = 'future';
      if (y < currentYear) era = 'past';
      else if (y === currentYear) era = 'present';

      const rawArcana = py.arcana as any;
      const adaptiveArcana: ArcanaDefinition = {
        id: rawArcana.number ?? rawArcana.id ?? 0,
        tarotName: rawArcana.card ?? rawArcana.tarotName ?? 'Unknown Arcana',
        matrixName: rawArcana.card ?? rawArcana.matrixName ?? 'Unknown Arcana',
        shortName: rawArcana.card ?? rawArcana.shortName ?? 'Unknown',
        archetype: 'Personal Year Guide',
        element: (rawArcana.element || 'Fire') as ElementType,
        polarity: 'Yang',
        energyLevel: 5,
        colors: [],
        symbols: [],
        animals: [],
        crystals: [],
        keywords: rawArcana.keywords || [],
        summary: rawArcana.uprightMeaning || '',
        uprightMeaning: rawArcana.uprightMeaning || '',
        reversedMeaning: rawArcana.reversedMeaning || '',
        positiveTraits: [],
        shadowTraits: [],
        strengths: [],
        weaknesses: [],
        gifts: [],
        fears: [],
        talents: [],
        lifeMission: [],
        karmicLessons: [],
        spiritualLessons: [],
        career: [],
        finance: [],
        relationship: [],
        family: [],
        friendship: [],
        health: [],
        advice: [],
        affirmations: [],
        meditation: [],
        dailyPractice: [],
        compatibleElements: [],
        difficultElements: [],
        narrative: {
          overview: rawArcana.uprightMeaning || '',
          personality: '',
          career: '',
          relationship: '',
          spirituality: '',
          challenge: rawArcana.reversedMeaning || '',
          advice: '',
        },
      };

      entries.push({
        year: y,
        personalYearValue: py.personalYearValue,
        arcana: adaptiveArcana,
        era,
        isCurrent: y === currentYear,
      });
    }
    return entries;
  }, [matrix, currentYear]);

  const groupedTimeline = useMemo(
    () => ({
      past: timeline.filter(e => e.era === 'past'),
      present: timeline.filter(e => e.era === 'present'),
      future: timeline.filter(e => e.era === 'future'),
    }),
    [timeline]
  );

  // 🎯 REDIRECTION ENGINE: Alihkan fungsi ketukan langsung ke Screen PersonalYear yang jauh lebih interaktif
  const handleYearPress = useCallback(
    (entry: TimelineEntry) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate('PersonalYear', { year: entry.year });
    },
    [navigation]
  );

  const scrollToCurrentYear = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentYearLayoutY.current > 0) {
      scrollRef.current?.scrollTo({ y: currentYearLayoutY.current - 20, animated: true });
    }
  }, []);

  const getElementColor = useCallback(
    (element: ElementType) => {
      return ELEMENT_STYLES[element]?.color || colors.primary;
    },
    [colors]
  );

  const dynamicStyles = useMemo(
    () => ({
      container: { flex: 1, backgroundColor: colors.background },
      headerGradient: {
        padding: SPACING.xl,
        paddingTop: SPACING.xxl,
        borderBottomLeftRadius: BORDER_RADIUS['3xl'],
        borderBottomRightRadius: BORDER_RADIUS['3xl'],
        marginBottom: SPACING.lg,
      },
      headerTitle: {
        fontSize: FONT_SIZE['3xl'],
        fontWeight: '800' as const,
        color: colors.text,
        marginBottom: SPACING.xs,
      },
      headerSubtitle: { fontSize: FONT_SIZE.sm, color: colors.textSecondary, lineHeight: 20 },
      headerActions: { flexDirection: 'row' as const, gap: SPACING.sm, marginTop: SPACING.md },
      headerButton: {
        backgroundColor: colors.surface + '80',
        borderRadius: BORDER_RADIUS.xl,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderWidth: 1,
        borderColor: colors.border,
      },
      headerButtonText: {
        fontSize: FONT_SIZE.xs,
        color: colors.textSecondary,
        fontWeight: '600' as const,
      },
      currentYearHero: {
        backgroundColor: colors.primary + '12',
        borderRadius: BORDER_RADIUS['2xl'],
        padding: SPACING.lg,
        margin: SPACING.md,
        marginBottom: SPACING.xs,
        borderWidth: 2,
        borderColor: colors.primary + '50',
        ...(SHADOWS.lg as ViewStyle),
        position: 'relative' as const,
        overflow: 'hidden' as const,
      },
      heroGlow: {
        position: 'absolute' as const,
        top: -20,
        right: -20,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary + '20',
      },
      heroYearBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        alignSelf: 'flex-start' as const,
        marginBottom: SPACING.md,
      },
      heroYearText: { color: '#FFFFFF', fontSize: FONT_SIZE.sm, fontWeight: '700' as const },
      heroArcanaName: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: '800' as const,
        color: colors.text,
        marginBottom: SPACING.xs,
      },
      heroArcanaNumber: {
        fontSize: FONT_SIZE.sm,
        color: colors.primaryLight,
        fontWeight: '600' as const,
        marginBottom: SPACING.sm,
      },
      heroValue: {
        fontSize: FONT_SIZE.lg,
        color: colors.textSecondary,
        fontWeight: '500' as const,
      },
      heroCTA: {
        fontSize: FONT_SIZE.xs,
        color: colors.primary,
        marginTop: SPACING.md,
        fontStyle: 'italic' as const,
      },
      eraSection: { marginHorizontal: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.sm },
      eraHeader: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
      },
      eraIcon: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      },
      eraTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700' as const, color: colors.text },
      eraCount: { fontSize: FONT_SIZE.xs, color: colors.textMuted, marginLeft: SPACING.xs },
      timelineConnector: {
        position: 'absolute' as const,
        left: 28,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: colors.border,
      },
      yearCard: {
        backgroundColor: colors.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.md,
        marginLeft: SPACING.xl,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...(SHADOWS.sm as ViewStyle),
        position: 'relative' as const,
      },
      yearCardActive: {
        borderColor: colors.primary,
        borderWidth: 2,
        backgroundColor: colors.primary + '08',
      },
      yearCardPast: { opacity: 0.65 },
      yearCardFuture: { borderStyle: 'dashed' as const },
      yearDot: {
        position: 'absolute' as const,
        left: -SPACING.xl - 5,
        top: '50%' as const,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.background,
        marginTop: -6,
      },
      yearHeader: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: SPACING.sm,
      },
      yearLabel: { fontSize: FONT_SIZE.lg, fontWeight: '700' as const, color: colors.text },
      yearElementBadge: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
      },
      yearElementText: { fontSize: FONT_SIZE.xs, fontWeight: '600' as const },
      yearCardName: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600' as const,
        color: colors.textSecondary,
        marginBottom: SPACING.xs,
      },
      yearKeywords: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 4 },
      yearKeywordChip: {
        backgroundColor: colors.backgroundLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
      },
      yearKeywordText: { fontSize: 10, color: colors.textMuted },
      timelineEnd: { alignItems: 'center' as const, paddingVertical: SPACING.xl },
      timelineEndText: {
        fontSize: FONT_SIZE.sm,
        color: colors.textMuted,
        fontStyle: 'italic' as const,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: SPACING.xl,
      },
      emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
      emptyTitle: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: '700' as const,
        color: colors.text,
        marginBottom: SPACING.sm,
      },
      emptyText: {
        fontSize: FONT_SIZE.md,
        color: colors.textSecondary,
        textAlign: 'center' as const,
        lineHeight: 24,
        marginBottom: SPACING.xl,
      },
      emptyButton: {
        backgroundColor: colors.primary,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        paddingHorizontal: SPACING.xxl,
      },
      emptyButtonText: { color: '#FFFFFF', fontSize: FONT_SIZE.md, fontWeight: '700' as const },
      floatingButton: {
        position: 'absolute' as const,
        bottom: SPACING.lg,
        right: SPACING.lg,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        ...(SHADOWS.lg as ViewStyle),
      },
      floatingButtonText: { fontSize: 20, color: '#FFFFFF' },
    }),
    [colors]
  );

  if (!matrix || !timeline.length) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.emptyContainer}>
          <Animated.View entering={FadeInDown.duration(800).springify()}>
            <Text style={dynamicStyles.emptyIcon}>🕐</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(800)}>
            <Text style={dynamicStyles.emptyTitle}>Belum Ada Data</Text>
            <Text style={dynamicStyles.emptyText}>
              Hitung Destiny Matrix-mu di Beranda{'\n'}untuk melihat timeline arcana tahunan
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <TouchableOpacity
              style={dynamicStyles.emptyButton}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.emptyButtonText}>✨ Mulai Perjalanan</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const currentEntry = timeline.find(e => e.isCurrent);
  const displayHeroId = currentEntry?.arcana.id === 0 ? 22 : currentEntry?.arcana.id;
  const displayHeroValue =
    currentEntry?.personalYearValue === 0 ? 22 : currentEntry?.personalYearValue;

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient
            colors={colors.gradients.headerGradient}
            style={dynamicStyles.headerGradient}
          >
            <Text style={dynamicStyles.headerTitle}>🕐 Timeline Arcana</Text>
            <Text style={dynamicStyles.headerSubtitle}>
              Perjalanan energi tahunan berdasarkan Personal Year
            </Text>
            <View style={dynamicStyles.headerActions}>
              <TouchableOpacity style={dynamicStyles.headerButton} onPress={scrollToCurrentYear}>
                <Text style={dynamicStyles.headerButtonText}>📍 Lompat ke {currentYear}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Hero Current Year */}
        {currentEntry && (
          <Animated.View entering={FadeInUp.delay(200).duration(800)}>
            <TouchableOpacity
              style={dynamicStyles.currentYearHero}
              onPress={() => handleYearPress(currentEntry)}
              activeOpacity={0.8}
            >
              <View style={dynamicStyles.heroGlow} />
              <View style={dynamicStyles.heroYearBadge}>
                <Text style={dynamicStyles.heroYearText}>✨ Tahun Ini ({currentYear})</Text>
              </View>
              <Text style={dynamicStyles.heroArcanaName}>{currentEntry.arcana.tarotName}</Text>
              <Text style={dynamicStyles.heroArcanaNumber}>
                Arcana #{displayHeroId} • {currentEntry.arcana.element}
              </Text>
              <Text style={dynamicStyles.heroValue}>Personal Year Value: {displayHeroValue}</Text>
              <Text style={dynamicStyles.heroCTA}>Buka Analisis Cuaca Kosmik →</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Past Timeline Section */}
        {groupedTimeline.past.length > 0 && (
          <Animated.View
            entering={SlideInLeft.delay(400).duration(600)}
            style={dynamicStyles.eraSection}
          >
            <View style={dynamicStyles.eraHeader}>
              <View style={[dynamicStyles.eraIcon, { backgroundColor: colors.textMuted + '20' }]}>
                <Text>⏮️</Text>
              </View>
              <Text style={dynamicStyles.eraTitle}>
                Masa Lalu
                <Text style={dynamicStyles.eraCount}> ({groupedTimeline.past.length} tahun)</Text>
              </Text>
            </View>
            <View style={{ position: 'relative' }}>
              <View style={dynamicStyles.timelineConnector} />
              {groupedTimeline.past.map((entry, index) => (
                <Animated.View key={entry.year} entering={FadeInUp.delay(400 + index * 50)}>
                  <TouchableOpacity
                    style={[dynamicStyles.yearCard, dynamicStyles.yearCardPast]}
                    onPress={() => handleYearPress(entry)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        dynamicStyles.yearDot,
                        { backgroundColor: getElementColor(entry.arcana.element) },
                      ]}
                    />
                    <View style={dynamicStyles.yearHeader}>
                      <Text style={dynamicStyles.yearLabel}>{entry.year}</Text>
                      <View
                        style={[
                          dynamicStyles.yearElementBadge,
                          { backgroundColor: getElementColor(entry.arcana.element) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            dynamicStyles.yearElementText,
                            { color: getElementColor(entry.arcana.element) },
                          ]}
                        >
                          {entry.arcana.element}
                        </Text>
                      </View>
                    </View>
                    <Text style={dynamicStyles.yearCardName}>{entry.arcana.tarotName}</Text>
                    <View style={dynamicStyles.yearKeywords}>
                      {entry.arcana.keywords.slice(0, 3).map((kw, i) => (
                        <View key={i} style={dynamicStyles.yearKeywordChip}>
                          <Text style={dynamicStyles.yearKeywordText}>{kw}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Future Timeline Section */}
        {groupedTimeline.future.length > 0 && (
          <Animated.View
            entering={SlideInRight.delay(400).duration(600)}
            style={dynamicStyles.eraSection}
            onLayout={e => {
              currentYearLayoutY.current = e.nativeEvent.layout.y;
            }}
          >
            <View style={dynamicStyles.eraHeader}>
              <View style={[dynamicStyles.eraIcon, { backgroundColor: colors.primary + '20' }]}>
                <Text>⏭️</Text>
              </View>
              <Text style={dynamicStyles.eraTitle}>
                Masa Depan
                <Text style={dynamicStyles.eraCount}> ({groupedTimeline.future.length} tahun)</Text>
              </Text>
            </View>
            <View style={{ position: 'relative' }}>
              <View style={dynamicStyles.timelineConnector} />
              {groupedTimeline.future.map((entry, index) => (
                <Animated.View key={entry.year} entering={FadeInUp.delay(400 + index * 50)}>
                  <TouchableOpacity
                    style={[dynamicStyles.yearCard, dynamicStyles.yearCardFuture]}
                    onPress={() => handleYearPress(entry)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        dynamicStyles.yearDot,
                        { backgroundColor: getElementColor(entry.arcana.element) },
                      ]}
                    />
                    <View style={dynamicStyles.yearHeader}>
                      <Text style={dynamicStyles.yearLabel}>{entry.year}</Text>
                      <View
                        style={[
                          dynamicStyles.yearElementBadge,
                          { backgroundColor: getElementColor(entry.arcana.element) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            dynamicStyles.yearElementText,
                            { color: getElementColor(entry.arcana.element) },
                          ]}
                        >
                          {entry.arcana.element}
                        </Text>
                      </View>
                    </View>
                    <Text style={dynamicStyles.yearCardName}>{entry.arcana.tarotName}</Text>
                    <View style={dynamicStyles.yearKeywords}>
                      {entry.arcana.keywords.slice(0, 3).map((kw, i) => (
                        <View key={i} style={dynamicStyles.yearKeywordChip}>
                          <Text style={dynamicStyles.yearKeywordText}>{kw}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* End Placeholder */}
        <Animated.View entering={FadeIn.delay(600)} style={dynamicStyles.timelineEnd}>
          <Text style={dynamicStyles.timelineEndText}>✨ Perjalanan makrokosmos berlanjut...</Text>
        </Animated.View>
        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={dynamicStyles.floatingButton}
        onPress={scrollToCurrentYear}
        activeOpacity={0.8}
      >
        <Text style={dynamicStyles.floatingButtonText}>📍</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
});

export default TimelineScreen;
