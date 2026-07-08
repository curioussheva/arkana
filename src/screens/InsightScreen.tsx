// src/screens/InsightScreen.tsx
import React, { useMemo, useCallback, useState, useEffect } from 'react';
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
  SlideInRight,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  FadeInRight,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { useAppStore, selectAdvancedAnalysis, selectActiveProfileName } from '@store/app-store';
import { generateInsight, firstSentence } from '@core/destiny-matrix/insight';
import { getPositionInterpretation } from '@core/destiny-matrix/position-meanings';
import { ArkanaCard } from '@components/ui/ArkanaCard';
import { ArcanaWheel } from '@components/charts/ArcanaWheel';
import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';
import type { ElementType } from '@components/ui/ArkanaCard/types';
import type { DestinyPointKey } from '@core/destiny-matrix/types';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
type ActiveTabType = 'blueprint' | 'energy';

export function InsightScreen() {
  const colors = useThemeStore(state => state.getColors());
  const [showFullNarrative, setShowFullNarrative] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('blueprint');
  
  const matrix = useAppStore(state => state.currentMatrix);
  const analysis = useAppStore(selectAdvancedAnalysis);
  const profileName = useAppStore(selectActiveProfileName);
  
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
        message: `🔮 Destiny Matrix Insight untuk ${profileName}\n\n${insight.narrative}`,
        title: 'Destiny Matrix Insight',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [insight, profileName]);

  const handleTabPress = (tab: ActiveTabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerGradient: {
      padding: SPACING.xl,
      paddingTop: SPACING.xxl,
      borderBottomLeftRadius: BORDER_RADIUS['3xl'],
      borderBottomRightRadius: BORDER_RADIUS['3xl'],
    },
    headerTitle: { fontSize: FONT_SIZE['3xl'], fontWeight: '800', color: colors.text, marginBottom: SPACING.xs },
    headerSubtitle: { fontSize: FONT_SIZE.sm, color: colors.textSecondary, lineHeight: 20 },
    tabBar: { flexDirection: 'row', borderBottomWidth: 1, height: 48, alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border },
    tabItem: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
    tabLabel: { fontSize: FONT_SIZE.sm },
    elementBanner: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md, marginHorizontal: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.md,
      borderWidth: 1, borderColor: elementData?.color ? elementData.color + '30' : colors.border, gap: SPACING.md,
    },
    elementIconContainer: { width: 48, height: 48, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
    elementIcon: { fontSize: 24 },
    elementInfo: { flex: 1 },
    elementLabel: { fontSize: FONT_SIZE.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
    elementName: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: elementData?.color || colors.text },
    sectionTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: colors.text, marginBottom: SPACING.md, textAlign: 'center' },
    narrativeCard: {
      backgroundColor: colors.surface, borderRadius: BORDER_RADIUS['2xl'], padding: SPACING.lg,
      marginHorizontal: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: colors.border,
      ...SHADOWS.lg, position: 'relative', overflow: 'hidden',
    },
    narrativeGlow: { position: 'absolute', top: -50, left: -50, right: -50, bottom: -50, borderRadius: BORDER_RADIUS['2xl'] },
    narrativeTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md, gap: 8 },
    narrativeTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: colors.text },
    narrativeText: { fontSize: FONT_SIZE.md, color: colors.text, lineHeight: 26 },
    narrativeFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, borderBottomLeftRadius: BORDER_RADIUS['2xl'], borderBottomRightRadius: BORDER_RADIUS['2xl'] },
    showMoreButton: { alignItems: 'center', paddingVertical: SPACING.sm },
    showMoreText: { fontSize: FONT_SIZE.sm, color: colors.primary, fontWeight: '600' },
    wheelContainer: { marginHorizontal: SPACING.md, marginBottom: SPACING.lg, alignItems: 'center' },
    stepContainer: { marginHorizontal: SPACING.md, marginBottom: SPACING.lg },
    stepRow: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: SPACING.sm, alignItems: 'flex-start' },
    stepNumber: { color: colors.primary, fontWeight: '700', marginRight: 8, width: 20 },
    stepText: { color: colors.textSecondary, flex: 1 },
    stepCardName: { fontWeight: '600', color: colors.text },
    pointCard: { backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: colors.border, marginHorizontal: SPACING.md },
    pointHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    pointBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    pointBadgeText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
    pointLabel: { color: colors.text, fontWeight: '600', fontSize: 14 },
    pointInterpretation: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
    essenceCard: { backgroundColor: colors.surface, borderRadius: BORDER_RADIUS['2xl'], padding: SPACING.lg, marginHorizontal: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: colors.border, ...SHADOWS.lg },
    essenceTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: colors.text, marginBottom: SPACING.md, textAlign: 'center' },
    essenceSubtitle: { fontSize: FONT_SIZE.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: SPACING.lg, fontStyle: 'italic' },
    shareButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary + '15', borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginHorizontal: SPACING.md, marginTop: SPACING.md, gap: SPACING.sm, borderWidth: 1, borderColor: colors.primary + '30' },
    shareButtonText: { color: colors.primary, fontSize: FONT_SIZE.md, fontWeight: '600' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
    emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
    emptyTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: colors.text, marginBottom: SPACING.sm },
    emptyText: { fontSize: FONT_SIZE.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: SPACING.xl },
    lineBlock: { backgroundColor: colors.backgroundLight + '50', borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginTop: SPACING.sm, marginBottom: SPACING.md, borderWidth: 1, borderColor: colors.border + '30' },
    lineTitle: { fontWeight: '700', color: colors.text, fontSize: 16, marginBottom: 2 },
    
    // Advanced Energy Style Basics
    archetypeText: { fontSize: FONT_SIZE.lg, fontWeight: '800', marginBottom: SPACING.md },
    barContainer: { flexDirection: 'row', height: 28, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden', marginBottom: SPACING.md, marginTop: SPACING.sm },
    yinBar: { justifyContent: 'center', paddingLeft: SPACING.sm },
    yangBar: { justifyContent: 'center', alignItems: 'flex-end', paddingRight: SPACING.sm },
    barLabel: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
    chakraHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
    chakraName: { fontSize: FONT_SIZE.md, fontWeight: '700' },
    statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
    statusBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    chakraStatsRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm },
    chakraStatText: { fontSize: FONT_SIZE.xs }
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
      {/* Header Statis */}
      <Animated.View entering={FadeInDown.duration(600).springify()}>
        <LinearGradient colors={colors.gradients.headerGradient} style={dynamicStyles.headerGradient}>
          <Text style={dynamicStyles.headerTitle}>🔮 Spiritual Blueprint</Text>
          <Text style={dynamicStyles.headerSubtitle}>
            Profil esensi energi takdir bagi jiwa: <Text style={{ fontWeight: '700', color: colors.primary }}>{profileName}</Text>
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Tab Switcheable Antara Blueprint vs Analisis Energi */}
      <View style={dynamicStyles.tabBar}>
        <TouchableOpacity
          style={[dynamicStyles.tabItem, activeTab === 'blueprint' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => handleTabPress('blueprint')}
        >
          <Text style={[dynamicStyles.tabLabel, { color: activeTab === 'blueprint' ? colors.primary : colors.textMuted, fontWeight: activeTab === 'blueprint' ? '700' : '500' }]}>
            Blueprint Takdir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.tabItem, activeTab === 'energy' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => handleTabPress('energy')}
        >
          <Text style={[dynamicStyles.tabLabel, { color: activeTab === 'energy' ? colors.primary : colors.textMuted, fontWeight: activeTab === 'energy' ? '700' : '500' }]}>
            Analisis Energi Internal
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TAB 1: BLUEPRINT UTAMA (KODE LAMA ANDA) */}
        {activeTab === 'blueprint' && (
          <Animated.View entering={FadeInRight} layout={Layout.springify()}>
            {/* Element Banner */}
            <View style={dynamicStyles.elementBanner}>
              <View style={[dynamicStyles.elementIconContainer, { backgroundColor: (elementData?.color || colors.primary) + '20' }]}>
                <Text style={dynamicStyles.elementIcon}>{elementData?.icon}</Text>
              </View>
              <View style={dynamicStyles.elementInfo}>
                <Text style={dynamicStyles.elementLabel}>Elemen Dominan</Text>
                <Text style={dynamicStyles.elementName}>{insight.dominantElement}</Text>
              </View>
            </View>

            {/* Narrative Interpretation */}
            <View style={dynamicStyles.narrativeCard}>
              <AnimatedLinearGradient
                colors={[(elementData?.color || colors.primary) + '10', 'transparent', (elementData?.color || colors.primary) + '05']}
                style={[dynamicStyles.narrativeGlow, glowStyle]}
              />
              <Text style={[dynamicStyles.narrativeTitle, { textAlign: 'center', marginBottom: SPACING.md }]}>✨ Bacaan Matrix-mu</Text>
              <Text style={dynamicStyles.narrativeText}>{narrativePreview}</Text>
              {shouldTruncate && (
                <TouchableOpacity style={dynamicStyles.showMoreButton} onPress={() => setShowFullNarrative(!showFullNarrative)}>
                  <Text style={dynamicStyles.showMoreText}>{showFullNarrative ? '▲ Lebih Sedikit' : '▼ Baca Selengkapnya'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Lines Summary */}
            {insight?.namedLines && (
              <View style={dynamicStyles.narrativeCard}>
                <Text style={dynamicStyles.sectionTitle}>🔗 Garis Linier Energi</Text>
                <View style={dynamicStyles.lineBlock}>
                  <Text style={dynamicStyles.lineTitle}>💖 Love Line</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{insight.namedLines.loveLine.meaning}</Text>
                </View>
                <View style={[dynamicStyles.lineBlock, { marginBottom: 0 }]}>
                  <Text style={dynamicStyles.lineTitle}>💰 Money Line</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{insight.namedLines.moneyLine.meaning}</Text>
                </View>
              </View>
            )}

            {/* Arcana Wheel & Steps */}
            {arcanaSequence.length > 0 && (
              <View style={dynamicStyles.wheelContainer}>
                <Text style={dynamicStyles.sectionTitle}>🎡 Roda Takdir Jiwa</Text>
                <ArcanaWheel arcanaSequence={arcanaSequence} />
              </View>
            )}

            {importantPoints.length > 0 && (
              <View style={{ marginBottom: SPACING.lg }}>
                <Text style={dynamicStyles.sectionTitle}>📌 Interpretasi Titik Utama</Text>
                {importantPoints.map((item) => (
                  <View key={item.key} style={dynamicStyles.pointCard}>
                    <Text style={dynamicStyles.pointLabel}>{item.key} - {item.label}</Text>
                    <Text style={dynamicStyles.pointInterpretation}>{item.interpretation}</Text>
                  </View>
                ))}
              </View>
            )}

            {matrix.points.E && (
              <View style={dynamicStyles.essenceCard}>
                <Text style={dynamicStyles.essenceTitle}>🌟 Esensi Jiwamu</Text>
                <ArkanaCard arkana={matrix.points.E.arcana} variant="full" showMeaning />
              </View>
            )}
          </Animated.View>
        )}

        {/* TAB 2: ADVANCED ANALISIS ENERGI (FITUR BARU) */}
        {activeTab === 'energy' && analysis && (
          <Animated.View entering={FadeInRight} layout={Layout.springify()}>
            
            {/* Yin Yang Component */}
    <View style={dynamicStyles.narrativeCard}>
      <Text style={dynamicStyles.narrativeTitle}>⚖️ Profil Yin-Yang</Text>
      <Text style={[dynamicStyles.archetypeText, { color: colors.primary, marginTop: 4 }]}>{analysis.yinYang.archetype}</Text>
      <View style={dynamicStyles.barContainer}>
        <View style={[dynamicStyles.yinBar, { width: `${analysis.yinYang.yinPercentage}%`, backgroundColor: '#3b82f6' }]}>
          <Text style={styles.barLabel}>Yin {analysis.yinYang.yinPercentage}%</Text>
        </View>
        {/* 🔥 PERBAIKAN: Ubah analysis.yangYang menjadi analysis.yinYang */}
        <View style={[dynamicStyles.yangBar, { width: `${analysis.yinYang.yangPercentage}%`, backgroundColor: '#ef4444' }]}>
          <Text style={styles.barLabel}>Yang {analysis.yinYang.yangPercentage}%</Text>
        </View>
      </View>
      <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>
        {analysis.yinYang.dominant === 'Balanced' ? 'Energi internal Anda seimbang sempurna antara intuisi (Yin) dan aksi (Yang).' : analysis.yinYang.dominant === 'Yang' ? 'Anda sangat dinamis, terstruktur, dan berorientasi pada pencapaian logis.' : 'Anda memiliki ketajaman batin, sensitivitas spiritual, serta ruang kreativitas yang dalam.'}
      </Text>
    </View>

            {/* Karmic Tail Component */}
            <View style={dynamicStyles.narrativeCard}>
              <Text style={dynamicStyles.narrativeTitle}>🎭 Konsekuensi Segitiga Karma</Text>
              <View style={[dynamicStyles.lineBlock, { marginTop: SPACING.md }]}>
                <Text style={[dynamicStyles.lineTitle, { color: colors.error }]}>{analysis.karmicTail.title}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>{analysis.karmicTail.manifestation}</Text>
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700', marginTop: 8 }}>🔑 Resolusi Jiwa:</Text>
                <Text style={{ color: colors.text, fontSize: 13, fontStyle: 'italic' }}>{analysis.karmicTail.healingWay}</Text>
              </View>
            </View>

            {/* 7 Chakra Component */}
            <View style={{ paddingHorizontal: SPACING.sm }}>
              <Text style={[dynamicStyles.sectionTitle, { marginBottom: SPACING.sm }]}>🧘 Peta Aliran 7 Chakra</Text>
              {analysis.chakras.map((item, index) => {
                const statusColor = item.status === 'Balanced' ? '#10b981' : item.status === 'Overactive' ? '#f59e0b' : '#ef4444';
                return (
                  <View key={index} style={dynamicStyles.pointCard}>
                    <View style={dynamicStyles.chakraHeaderRow}>
                      <Text style={dynamicStyles.chakraName}>{item.name}</Text>
                      <View style={[dynamicStyles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                        <Text style={[dynamicStyles.statusBadgeText, { color: statusColor }]}>{item.status}</Text>
                      </View>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>{item.description}</Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Global Action Share */}
        <TouchableOpacity style={dynamicStyles.shareButton} onPress={handleShare} activeOpacity={0.8}>
          <Text style={dynamicStyles.shareButtonText}>📤 Bagikan Insight Takdir</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: SPACING.xl },
});
