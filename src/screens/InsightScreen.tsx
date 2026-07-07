// src/screens/InsightScreen.tsx
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share, // 🔥 PERBAIKAN: Menambahkan import Share yang hilang agar tidak crash
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { generateInsight, firstSentence } from '@core/destiny-matrix/insight';
import { getPositionInterpretation } from '@core/destiny-matrix/position-meanings';
import { ArkanaCard } from '@components/ui/ArkanaCard';
import { ArcanaWheel } from '@components/charts/ArcanaWheel';
import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';
import type { ElementType } from '@components/ui/ArkanaCard/types';
import type { DestinyPointKey } from '@core/destiny-matrix/types';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function InsightScreen() {
  const colors = useThemeStore(state => state.getColors());
  const [showFullNarrative, setShowFullNarrative] = useState(false);
  const matrix = useAppStore(state => state.currentMatrix);
  const glowOpacity = useSharedValue(0.3);

  const insight = useMemo(() => {
    if (!matrix) return null;
    return generateInsight(matrix);
  }, [matrix]);

  const elementData = useMemo(() => {
    if (!insight) return null;
    const element = insight.dominantElement as ElementType;
    return ELEMENT_STYLES[element] || ELEMENT_STYLES.Fire;
  }, [insight]);

  const importantPoints = useMemo(() => {
    if (!matrix) return [];
    const keys: DestinyPointKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    return keys
      .map(key => {
        const point = matrix.points[key];
        if (!point) return null;
        const snippet = firstSentence(point.arcana.uprightMeaning);
        return {
          key,
          label: point.label,
          card: point.arcana.card,
          interpretation: getPositionInterpretation(key, point.arcana.card, snippet),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item != null);
  }, [matrix]);

  const arcanaSequence = useMemo(() => {
    if (!matrix) return [];
    const order: DestinyPointKey[] = ['A', 'J', 'E', 'L', 'C', 'F', 'H', 'I'];
    return order
      .map(key => matrix.points[key])
      .filter(Boolean)
      .map(point => point.arcana);
  }, [matrix]);

  useEffect(() => {
    if (insight) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 2000 }),
          withTiming(0.2, { duration: 2000 })
        ),
        -1,
        true
      );
    }
  }, [insight, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleShare = useCallback(async () => {
    if (!insight) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `🔮 Destiny Matrix Insight\n\n${insight.narrative}`,
        title: 'Destiny Matrix Insight',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [insight]);

  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
    headerSubtitle: {
      fontSize: FONT_SIZE.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    elementBanner: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: elementData?.color ? elementData.color + '30' : colors.border,
      gap: SPACING.md,
    },
    elementIconContainer: {
      width: 48,
      height: 48,
      borderRadius: BORDER_RADIUS.lg,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    elementIcon: { fontSize: 24 },
    elementInfo: { flex: 1 },
    elementLabel: {
      fontSize: FONT_SIZE.xs,
      color: colors.textMuted,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
      marginBottom: 2,
    },
    elementName: {
      fontSize: FONT_SIZE.lg,
      fontWeight: '700' as const,
      color: elementData?.color || colors.text,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: SPACING.md,
      textAlign: 'center' as const,
    },
    narrativeCard: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS['2xl'],
      padding: SPACING.lg,
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...SHADOWS.lg,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    narrativeGlow: {
      position: 'absolute' as const,
      top: -50,
      left: -50,
      right: -50,
      bottom: -50,
      borderRadius: BORDER_RADIUS['2xl'],
    },
    narrativeTitleRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: SPACING.md,
      gap: 8,
    },
    narrativeTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: '700' as const,
      color: colors.text,
    },
    narrativeText: {
      fontSize: FONT_SIZE.md,
      color: colors.text,
      lineHeight: 26,
    },
    narrativeFade: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      borderBottomLeftRadius: BORDER_RADIUS['2xl'],
      borderBottomRightRadius: BORDER_RADIUS['2xl'],
    },
    showMoreButton: {
      alignItems: 'center' as const,
      paddingVertical: SPACING.sm,
    },
    showMoreText: {
      fontSize: FONT_SIZE.sm,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    wheelContainer: {
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.lg,
      alignItems: 'center' as const,
    },
    stepContainer: {
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.lg,
    },
    stepRow: {
      flexDirection: 'row' as const,
      marginBottom: 8,
      paddingHorizontal: SPACING.sm,
      alignItems: 'flex-start' as const,
    },
    stepNumber: {
      color: colors.primary,
      fontWeight: '700' as const,
      marginRight: 8,
      width: 20,
    },
    stepText: {
      color: colors.textSecondary,
      flex: 1,
    },
    stepCardName: {
      fontWeight: '600' as const,
      color: colors.text,
    },
    pointCard: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: SPACING.md,
    },
    pointHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 4,
    },
    pointBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: 8,
    },
    pointBadgeText: {
      color: colors.primary,
      fontWeight: '800' as const,
      fontSize: 12,
    },
    pointLabel: {
      color: colors.text,
      fontWeight: '600' as const,
      fontSize: 14,
    },
    pointInterpretation: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 20,
    },
    essenceCard: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS['2xl'],
      padding: SPACING.lg,
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...SHADOWS.lg,
    },
    essenceTitle: {
      fontSize: FONT_SIZE.lg,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: SPACING.md,
      textAlign: 'center' as const,
    },
    essenceSubtitle: {
      fontSize: FONT_SIZE.sm,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginBottom: SPACING.lg,
      fontStyle: 'italic' as const,
    },
    shareButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: colors.primary + '15',
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      marginHorizontal: SPACING.md,
      marginTop: SPACING.md,
      gap: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    shareButtonText: {
      color: colors.primary,
      fontSize: FONT_SIZE.md,
      fontWeight: '600' as const,
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
    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: FONT_SIZE.md,
      fontWeight: '700' as const,
    },
    metadataSection: {
      flexDirection: 'row' as const,
      gap: SPACING.sm,
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.md,
    },
    metadataCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center' as const,
    },
    metadataIcon: { fontSize: 24, marginBottom: SPACING.xs },
    metadataLabel: {
      fontSize: FONT_SIZE.xs,
      color: colors.textMuted,
      textAlign: 'center' as const,
    },
    metadataValue: {
      fontSize: FONT_SIZE.md,
      fontWeight: '700' as const,
      color: colors.text,
      marginTop: 2,
    },
    // Sub-card styling untuk Named Lines
    lineBlock: {
      backgroundColor: colors.backgroundLight + '50',
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      marginTop: SPACING.sm,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border + '30',
    },
    lineTitle: {
      fontWeight: '700' as const,
      color: colors.text,
      fontSize: 16,
      marginBottom: 2,
    },
  }), [colors, elementData]);

  if (!matrix || !insight) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.emptyContainer}>
          <Animated.View entering={FadeInDown.duration(800).springify()}>
            <Text style={dynamicStyles.emptyIcon}>🔮</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(800)}>
            <Text style={dynamicStyles.emptyTitle}>Belum Ada Insight</Text>
            <Text style={dynamicStyles.emptyText}>
              Hitung Destiny Matrix-mu di Beranda{'\n'}
              untuk membuka wawasan spiritual yang mendalam
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <TouchableOpacity
              style={dynamicStyles.emptyButton}
              onPress={() => {}}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.emptyButtonText}>✨ Mulai Perjalanan</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const narrativePreview = insight.narrative.length > 300 && !showFullNarrative
    ? insight.narrative.slice(0, 300) + '...'
    : insight.narrative;
  const shouldTruncate = insight.narrative.length > 300;

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient colors={colors.gradients.headerGradient} style={dynamicStyles.headerGradient}>
            <Text style={dynamicStyles.headerTitle}>🔮 Insight Naratif</Text>
            <Text style={dynamicStyles.headerSubtitle}>
              Wawasan mendalam tentang perjalanan spiritualmu
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Element Banner */}
        <Animated.View entering={SlideInRight.delay(200).duration(600)}>
          <View style={dynamicStyles.elementBanner}>
            <Animated.View style={[dynamicStyles.elementIconContainer, { backgroundColor: (elementData?.color || colors.primary) + '20' }]}>
              <Text style={dynamicStyles.elementIcon}>{elementData?.icon}</Text>
            </Animated.View>
            <View style={dynamicStyles.elementInfo}>
              <Text style={dynamicStyles.elementLabel}>Elemen Dominan</Text>
              <Text style={dynamicStyles.elementName}>{insight.dominantElement}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Narrative Card */}
        <Animated.View entering={FadeInUp.delay(400).duration(800)} layout={Layout.springify()}>
          <View style={dynamicStyles.narrativeCard}>
            <AnimatedLinearGradient
              colors={[(elementData?.color || colors.primary) + '10', 'transparent', (elementData?.color || colors.primary) + '05']}
              style={[dynamicStyles.narrativeGlow, glowStyle]}
            />
            <View style={dynamicStyles.narrativeTitleRow}>
              <Text style={dynamicStyles.narrativeTitle}>✨ Bacaan Matrix-mu</Text>
            </View>
            <Text style={dynamicStyles.narrativeText}>{narrativePreview}</Text>
            {shouldTruncate && (
              <TouchableOpacity
                style={dynamicStyles.showMoreButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowFullNarrative(!showFullNarrative);
                }}
              >
                <Text style={dynamicStyles.showMoreText}>
                  {showFullNarrative ? '▲ Lebih Sedikit' : '▼ Baca Selengkapnya'}
                </Text>
              </TouchableOpacity>
            )}
            {shouldTruncate && !showFullNarrative && (
              <LinearGradient colors={['transparent', colors.surface]} style={dynamicStyles.narrativeFade} />
            )}
          </View>
        </Animated.View>

        {/* 🔥 PERBAIKAN: Sinkronisasi Struktur & Tema Named Lines */}
        {insight?.namedLines && (
          <Animated.View entering={FadeInUp.delay(500).duration(800)} style={dynamicStyles.narrativeCard}>
            <Text style={dynamicStyles.sectionTitle}>🔗 Garis Energi Utama</Text>
            
            {/* Karmic Tail */}
            <View style={dynamicStyles.lineBlock}>
              <Text style={dynamicStyles.lineTitle}>🎭 Karmic Tail {insight.namedLines.karmicTail.pattern}</Text>
              {insight.namedLines.karmicTail.title && (
                <Text style={{ fontWeight: '600', color: colors.primary, fontSize: 13, marginBottom: 4 }}>
                  Arketipe: {insight.namedLines.karmicTail.title}
                </Text>
              )}
              <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20 }}>
                {insight.namedLines.karmicTail.meaning}
              </Text>
              {insight.namedLines.karmicTail.resolution && (
                <Text style={{ fontStyle: 'italic', color: colors.textMuted, fontSize: 12, marginTop: 6 }}>
                  💡 Resolusi: {insight.namedLines.karmicTail.resolution}
                </Text>
              )}
            </View>

            {/* Love Line */}
            <View style={dynamicStyles.lineBlock}>
              <Text style={dynamicStyles.lineTitle}>💖 Love Line</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 4 }}>
                {insight.namedLines.loveLine.meaning}
              </Text>
              {insight.namedLines.loveLine.keyLesson && (
                <Text style={{ color: colors.primaryLight, fontSize: 12, fontWeight: '600' }}>
                  🔑 Pelajaran Inti: {insight.namedLines.loveLine.keyLesson}
                </Text>
              )}
            </View>

            {/* Money Line */}
            <View style={[dynamicStyles.lineBlock, { marginBottom: 0 }]}>
              <Text style={dynamicStyles.lineTitle}>💰 Money Line</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 4 }}>
                {insight.namedLines.moneyLine.meaning}
              </Text>
              {insight.namedLines.moneyLine.advice && (
                <Text style={{ color: '#E2B842', fontSize: 12, fontWeight: '600' }}>
                  💼 Nasihat Finansial: {insight.namedLines.moneyLine.advice}
                </Text>
              )}
            </View>
          </Animated.View>
        )}

        {arcanaSequence.length > 0 && (
          <Animated.View entering={FadeInUp.delay(500).duration(600)} style={dynamicStyles.wheelContainer}>
            <Text style={dynamicStyles.sectionTitle}>🎡 Roda Takdir Anda</Text>
            <ArcanaWheel arcanaSequence={arcanaSequence} />
          </Animated.View>
        )}

        {arcanaSequence.length > 0 && (
          <Animated.View entering={FadeInUp.delay(600).duration(600)} style={dynamicStyles.stepContainer}>
            <Text style={[dynamicStyles.sectionTitle, { marginBottom: SPACING.sm }]}>
              🌱 Langkah Positif Anda
            </Text>
            {arcanaSequence.map((arcana, idx) => (
              <View key={idx} style={dynamicStyles.stepRow}>
                <Text style={dynamicStyles.stepNumber}>{idx + 1}.</Text>
                <Text style={dynamicStyles.stepText}>
                  <Text style={dynamicStyles.stepCardName}>{arcana.card}</Text>
                  {' – '}{firstSentence(arcana.uprightMeaning)}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}

        {importantPoints.length > 0 && (
          <Animated.View entering={FadeInUp.delay(700).duration(600)} style={{ marginBottom: SPACING.lg }}>
            <Text style={[dynamicStyles.sectionTitle, { marginBottom: SPACING.md }]}>
              📌 Interpretasi Titik Utama
            </Text>
            {importantPoints.map((item) => (
              <View key={item.key} style={dynamicStyles.pointCard}>
                <View style={dynamicStyles.pointHeader}>
                  <View style={dynamicStyles.pointBadge}>
                    <Text style={dynamicStyles.pointBadgeText}>{item.key}</Text>
                  </View>
                  <Text style={dynamicStyles.pointLabel}>{item.label}</Text>
                </View>
                <Text style={dynamicStyles.pointInterpretation}>{item.interpretation}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {matrix.points.E && (
          <Animated.View entering={FadeInUp.delay(800).duration(600)}>
            <View style={dynamicStyles.essenceCard}>
              <Text style={dynamicStyles.essenceTitle}>🌟 Esensi Jiwamu</Text>
              <Text style={dynamicStyles.essenceSubtitle}>
                Kartu yang merepresentasikan inti dirimu
              </Text>
              <ArkanaCard arkana={matrix.points.E.arcana} variant="full" showMeaning />
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(900).duration(600)} style={dynamicStyles.metadataSection}>
          <View style={dynamicStyles.metadataCard}>
            <Text style={dynamicStyles.metadataIcon}>🎯</Text>
            <Text style={dynamicStyles.metadataLabel}>Titik Matriks</Text>
            <Text style={dynamicStyles.metadataValue}>20</Text>
          </View>
          <View style={dynamicStyles.metadataCard}>
            <Text style={dynamicStyles.metadataIcon}>🃏</Text>
            <Text style={dynamicStyles.metadataLabel}>Arcana</Text>
            <Text style={dynamicStyles.metadataValue}>Major</Text>
          </View>
          <View style={dynamicStyles.metadataCard}>
            <Text style={dynamicStyles.metadataIcon}>⚡</Text>
            <Text style={dynamicStyles.metadataLabel}>Energi</Text>
            <Text style={dynamicStyles.metadataValue}>{elementData?.icon}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1000).duration(600)}>
          <TouchableOpacity
            style={dynamicStyles.shareButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text>📤</Text>
            <Text style={dynamicStyles.shareButtonText}>Bagikan Insight</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
});
 