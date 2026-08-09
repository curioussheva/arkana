// Berkas: src/features/insight/presentation/InsightScreen.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { useInsight } from '../hooks/useInsight';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import { compileEvolutionCycle } from '@core/destiny-matrix/evolutionEngine';
import type { DestinyPointKey } from '@core/destiny-matrix/types';
import { ElementType } from '@core/destiny-matrix/utils/element';

// Impor manajer database lokal untuk pemulihan cache
import { profileManager } from '@db/profile-manager';
import { destinyCacheManager } from '@db/destiny-cache-manager';

// 1. Dashboard Base Components
import { InsightHeader } from '../components/dashboard/InsightHeader';
import { ElementBanner } from '../components/dashboard/ElementBanner';
import { EmptyInsight } from '../components/dashboard/EmptyInsight';

// 2. Shared Components
import { SectionTitle } from '../components/shared/SectionTitle';
import { NarrativeCard } from '../components/shared/NarrativeCard';
import { ShareButton } from '../components/shared/ShareButton';
import { TotemSanctuarySection } from '../components/features/TotemSanctuarySection';

// 3. Grid Cards (Features)
import { CoreEssenceGridCard } from '../components/features/CoreEssenceGridCard';
import { DestinyAnchorGridCard } from '../components/features/DestinyAnchorGridCard';
import { ArcanaStatisticsGridCard } from '../components/features/ArcanaStatisticsGridCard';
import { KarmicTailGridCard } from '../components/features/KarmicTailGridCard';
import { YinYangGridCard } from '../components/features/YinYangGridCard';
import { ChakraGridCard } from '../components/features/ChakraGridCard';
import { NamedLinesGridCard } from '../components/features/NamedLinesGridCard';

// 4. Interactive Assessment & Visualizer
import { AssessmentQuiz } from '../components/features/AssessmentQuiz';
import { ArcanaWheel } from '@components/charts/ArcanaWheel';

// 5. Section khusus Tab Psikoanalisis
import { PsychoanalysisSection } from '../components/sections/PsychoanalysisSection';

// 6. Detail Modals (PageSheets)
import { CoreEssenceDetailModal } from '../components/features/detail-modals/CoreEssenceDetailModal';
import { KarmicTailDetailModal } from '../components/features/detail-modals/KarmicTailDetailModal';
import { YinYangDetailModal } from '../components/features/detail-modals/YinYangDetailModal';
import { ChakraDetailModal } from '../components/features/detail-modals/ChakraDetailModal';
import { NamedLinesDetailModal } from '../components/features/detail-modals/NamedLinesDetailModal';
import { ImportantPointsDetailModal } from '../components/features/detail-modals/ImportantPointsDetailModal';
import { ArcanaStatisticsDetailModal } from '../components/features/detail-modals/ArcanaStatisticsDetailModal';
import { ElementDetailModal } from '../components/features/detail-modals/ElementDetailModal';

// 🎯 FILTER CORE: Pastikan analisis statistik hanya mengolah 20 titik utama sejati
const VALID_20_KEYS: DestinyPointKey[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
];

export function InsightScreen() {
  const vm = useInsight();
  const colors = useThemeStore(state => state.getColors());

  // 🔀 STATE TAB NAVIGATION
  const [activeTab, setActiveTab] = useState<'matrix' | 'psycho'>('matrix');

  // 🔄 State activeProfileId dan setMatrix dari app-store
  const activeProfileId = useAppStore(state => state.activeProfileId);
  const currentMatrix = useAppStore(state => state.currentMatrix);
  const setMatrix = useAppStore(state => state.setMatrix);

  // 🔄 AUTOLOAD CACHE: Memuat kalkulasi matriks dari SQLite jika profil berubah / memori kosong
  useEffect(() => {
    const loadFromCache = async () => {
      if (currentMatrix) return;
      if (!activeProfileId || activeProfileId === 'default') return;
      try {
        const profile = await profileManager.getProfile(activeProfileId);
        if (profile) {
          const cached = await destinyCacheManager.getCachedMatrix(
            activeProfileId,
            profile.birthDate
          );
          if (cached) {
            setMatrix(cached);
          }
        }
      } catch (err) {
        console.warn('[InsightScreen] Gagal memuat cache matrix:', err);
      }
    };
    loadFromCache();
  }, [activeProfileId, currentMatrix, setMatrix]);

  const [activeModal, setActiveModal] = useState<
    | 'essence'
    | 'karmic'
    | 'yinyang'
    | 'chakra'
    | 'lines'
    | 'statistics'
    | 'points'
    | 'element'
    | null
  >(null);

  const dominantElement = (vm.insight?.elements?.stats?.dominant as ElementType) || 'Fire';
  const elementAdvice = `${vm.insight?.elements?.opening || ''}\n\n${vm.insight?.elements?.advice || ''}`;

  // 1. Kompilasi Narasi Evolusi
  const evolutionNarrative = useMemo(() => {
    if (!vm.matrixPoints || !vm.userAssessmentState) return '';
    return compileEvolutionCycle(vm.matrixPoints, vm.userAssessmentState);
  }, [vm.matrixPoints, vm.userAssessmentState]);

  // 2. Safe Extraction Titik E untuk Assessment Quiz & Elemen Inti
  const safeArcanaE = useMemo(() => {
    const pointE = vm.matrixPoints?.E as any;
    if (!pointE) return null;

    const rawArcana = pointE.arcana || pointE;
    const rawId = rawArcana?.id ?? pointE?.value ?? 0;
    const cleanId = rawId === 0 ? 22 : rawId;

    return {
      ...rawArcana,
      id: cleanId,
      value: cleanId,
      matrixName: rawArcana?.matrixName || rawArcana?.tarotName || 'Inti Jiwa',
      tarotName: rawArcana?.tarotName || 'Inti Jiwa',
      element: rawArcana?.element as ElementType,
    };
  }, [vm.matrixPoints]);

  const coreElementE = safeArcanaE?.element;

  // 3. Saring 20 Titik Core Utama
  const safeCorePointsArray = useMemo(() => {
    const sourcePoints = vm.matrix?.points || vm.matrixPoints;
    if (!sourcePoints) return [];

    const arr: any[] = [];
    const rawPoints = sourcePoints as Record<string, any>;

    VALID_20_KEYS.forEach(key => {
      const pt = rawPoints[key];
      if (pt) {
        arr.push({ ...pt, key });
      }
    });
    return arr;
  }, [vm.matrix?.points, vm.matrixPoints]);

  // 4. Statistik Premium
  const premiumArcanaStats = useMemo(() => {
    const totalPoints = safeCorePointsArray.length;
    if (totalPoints === 0) return null;

    const validValues = safeCorePointsArray.map((p: any) => {
      const rawVal = p?.arcana?.id ?? p?.value ?? 0;
      return rawVal === 0 ? 22 : rawVal;
    });

    const sum = validValues.reduce((a, b) => a + b, 0);
    const avgValue = Math.round(sum / totalPoints);

    const variance = validValues.reduce((a, b) => a + Math.pow(b - avgValue, 2), 0) / totalPoints;
    const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

    const frequencyMap: Record<
      number,
      { id: number; count: number; points: string[]; cardName: string }
    > = {};

    safeCorePointsArray.forEach((p: any) => {
      const rawVal = p?.arcana?.id ?? p?.value ?? 0;
      const cleanId = rawVal === 0 ? 22 : rawVal;
      const displayLabel = p?.label || p?.key || 'Titik Energi';

      if (!frequencyMap[cleanId]) {
        frequencyMap[cleanId] = {
          id: cleanId,
          count: 0,
          points: [],
          cardName:
            p?.arcana?.matrixName || p?.arcana?.tarotName || p?.arcanaName || `Arcana ${cleanId}`,
        };
      }
      frequencyMap[cleanId].count += 1;
      frequencyMap[cleanId].points.push(displayLabel);
    });

    const sortedCards = Object.values(frequencyMap).sort((a, b) => b.count - a.count);
    const representativeCard = sortedCards[0]?.count > 1 ? sortedCards[0] : null;

    const uniqueCount = Object.keys(frequencyMap).length;
    const diversityRatio = Math.round((uniqueCount / totalPoints) * 100);

    return {
      totalPoints,
      avgValue,
      stdDev,
      dominantElement,
      uniqueCount,
      diversityRatio,
      representativeCard,
    };
  }, [safeCorePointsArray, dominantElement]);

  // 5. Distribusi Elemen untuk Totem & Modal
  const pointsByElement = useMemo(() => {
    if (safeCorePointsArray.length === 0) return null;

    const groups: Record<
      string,
      Array<{ key: string; label: string; arcanaName: string; arcanaId: number }>
    > = {
      Fire: [],
      Water: [],
      Air: [],
      Earth: [],
    };

    safeCorePointsArray.forEach(point => {
      const element = point?.arcana?.element;
      const rawId = point?.arcana?.id ?? point?.value ?? 0;
      const cleanId = rawId === 0 ? 22 : rawId;

      if (element && groups[element]) {
        groups[element].push({
          key: point.key,
          label: point.label || point.key,
          arcanaName: point.arcana?.shortName || point.arcana?.matrixName || 'Arcana',
          arcanaId: cleanId,
        });
      }
    });

    return { Fire: groups.Fire, Water: groups.Water, Air: groups.Air, Earth: groups.Earth };
  }, [safeCorePointsArray]);

  // 6. Aliansi Totem
  const totemAllianceData = useMemo(() => {
    const firePoints = pointsByElement?.Fire || [];
    const waterPoints = pointsByElement?.Water || [];
    const airPoints = pointsByElement?.Air || [];
    const earthPoints = pointsByElement?.Earth || [];

    return [
      {
        key: 'Angel',
        icon: '👼',
        name: 'Malaikat / Manusia',
        element: 'Udara',
        zodiac: 'Aquarius',
        color: '#a855f7',
        trait: 'Kecerdasan intelektual strategis, visi kemanusiaan global, keterbukaan ide.',
        advice: 'Gunakan kekuatan udara untuk mengartikulasikan kebenaran batinmu dengan jernih.',
        pointsCount: airPoints.length,
        pointsLabels: airPoints.map(p => `${p.key} (${p.label}) - Arcana #${p.arcanaId}`),
      },
      {
        key: 'Eagle',
        icon: '🦅',
        name: 'Elang (Eagle)',
        element: 'Air',
        zodiac: 'Scorpio',
        color: '#3b82f6',
        trait: 'Kedalaman kompas rasa, intuisi spiritual tajam, transformasi sirkular.',
        advice: 'Pertajam radar intuisimu. Tatap realitas kehidupan dari sudut pandang tinggi.',
        pointsCount: waterPoints.length,
        pointsLabels: waterPoints.map(p => `${p.key} (${p.label}) - Arcana #${p.arcanaId}`),
      },
      {
        key: 'Lion',
        icon: '🦁',
        name: 'Singa (Lion)',
        element: 'Api',
        zodiac: 'Leo',
        color: '#ef4444',
        trait: 'Gairah transformatif, ambisi kepemimpinan, dan keberanian.',
        advice: 'Gunakan energi singa untuk mendobrak batasan. Ambil tindakan tegas sekarang.',
        pointsCount: firePoints.length,
        pointsLabels: firePoints.map(p => `${p.key} (${p.label}) - Arcana #${p.arcanaId}`),
      },
      {
        key: 'Ox',
        icon: '🐂',
        name: 'Lembu (Bull / Ox)',
        element: 'Bumi',
        zodiac: 'Taurus',
        color: '#22c55e',
        trait: 'Stabilitas material nyata, kedisiplinan logis yang mengakar.',
        advice:
          'Bumi meminta ketabahan. Bangun pondasi finansial dan spiritualmu secara konsisten.',
        pointsCount: earthPoints.length,
        pointsLabels: earthPoints.map(p => `${p.key} (${p.label}) - Arcana #${p.arcanaId}`),
      },
    ];
  }, [pointsByElement]);

  // 🚧 KONDISI EARLY RETURN
  if (!vm.hasInsight || !vm.insight) {
    return <EmptyInsight />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <InsightHeader profileName={vm.profileName || 'Profil Utama'} />

        {/* ─── SEGMENTED CONTROL TAB BAR ─── */}
        <View
          style={[
            styles.tabContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('matrix')}
            style={[
              styles.tabBtn,
              activeTab === 'matrix' && {
                backgroundColor: colors.primary + '18',
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'matrix' ? colors.primary : colors.textSecondary },
              ]}
            >
              🔮 Destiny Matrix
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('psycho')}
            style={[
              styles.tabBtn,
              activeTab === 'psycho' && {
                backgroundColor: colors.primary + '18',
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'psycho' ? colors.primary : colors.textSecondary },
              ]}
            >
              🧠 Psikoanalisis
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── KONTEN TAB 1: DESTINY MATRIX ─── */}
        {activeTab === 'matrix' ? (
          <>
            {/* ================= BLOK 1: ELEMENT BANNER ================= */}
            <View style={styles.sectionWrapper}>
              <SectionTitle
                title="🌌 Refleksi & Intisari Diri"
                subtitle="Cetak biru elemen murni yang mendominasi getaran jiwamu saat ini."
              />
              <ElementBanner
                element={dominantElement}
                advice={elementAdvice}
                onPress={() => setActiveModal('element')}
              />
            </View>

            {/* ================= BLOK 2: THE ANALYTIC GRID ================= */}
            <View style={styles.sectionWrapper}>
              <SectionTitle
                title="🔮 Peta Kendali Takdir"
                subtitle="Bedah arketipe batin, alur matriks takdir, hingga utang karma bawaan."
              />
              <View style={styles.gridContainer}>
                <View style={{ marginBottom: SPACING.md }}>
                  <DestinyAnchorGridCard
                    points={vm.importantPoints}
                    onPress={() => setActiveModal('points')}
                  />
                </View>

                <View style={styles.gridRow}>
                  <ArcanaStatisticsGridCard
                    stats={premiumArcanaStats}
                    onPress={() => setActiveModal('statistics')}
                  />
                  <KarmicTailGridCard
                    analysis={vm.insight?.advanced?.karmicTail}
                    onPress={() => setActiveModal('karmic')}
                  />
                </View>

                <View style={styles.gridRow}>
                  <YinYangGridCard
                    data={vm.insight?.advanced?.yinYang}
                    onPress={() => setActiveModal('yinyang')}
                  />
                  <ChakraGridCard
                    data={vm.insight?.advanced?.chakras}
                    onPress={() => setActiveModal('chakra')}
                  />
                </View>

                <View style={styles.gridRow}>
                  <NamedLinesGridCard
                    data={vm.insight?.namedLines}
                    onPress={() => setActiveModal('lines')}
                  />
                  <CoreEssenceGridCard onPress={() => setActiveModal('essence')} />
                </View>
              </View>
            </View>

            {/* ================= BLOK 3: ASSESSMENT / EVOLUTION ================= */}
            <View style={styles.sectionWrapper}>
              <SectionTitle
                title="🌀 Alur Evolusi Jiwa"
                subtitle="Ukur keselarasan matriks takdir dan buka peta jalan hidup serta transformasi batin Anda."
              />
              <View style={styles.evolutionContainer}>
                {safeArcanaE &&
                  (vm.userAssessmentState === null ? (
                    <AssessmentQuiz
                      arcanaE={safeArcanaE as any}
                      currentState={vm.userAssessmentState}
                      onAnswer={vm.setUserAssessmentState}
                    />
                  ) : (
                    <View style={styles.wheelContainer}>
                      <ArcanaWheel
                        matrix={{ points: vm.matrixPoints } as any}
                        assessmentState={vm.userAssessmentState}
                        onPointPress={vm.handlePointPress}
                      />

                      <NarrativeCard
                        customText={evolutionNarrative}
                        title="Peta Alur Evolusi Jiwa"
                      />

                      <TouchableOpacity
                        style={styles.retakeButton}
                        onPress={() => vm.setUserAssessmentState(null)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={{
                            color: colors.primary,
                            fontSize: FONT_SIZE.sm,
                            fontWeight: '600',
                          }}
                        >
                          🔄 Ulangi Kuesioner Evolusi
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            </View>

            {/* ================= BLOK 4: THE TOTEM SANCTUARY ================= */}
            <TotemSanctuarySection totemAlliance={totemAllianceData} />
          </>
        ) : (
          /* ─── KONTEN TAB 2: PSIKOANALISIS ─── */
          <View style={styles.sectionWrapper}>
            <SectionTitle
              title="🧠 Pemetaan Karakter Psikologis"
              subtitle="Penerjemahan pola energi matriks ke dalam instrumen perilaku modern."
            />
            <View style={{ paddingHorizontal: SPACING.md }}>
              <PsychoanalysisSection dominantElement={dominantElement} coreElement={coreElementE} />
            </View>
          </View>
        )}

        <ShareButton onPress={vm.share} />
      </ScrollView>

      {/* ================= MODALS INJECTIONS LAYER ================= */}
      <CoreEssenceDetailModal
        visible={activeModal === 'essence'}
        onClose={() => setActiveModal(null)}
      />
      <KarmicTailDetailModal
        visible={activeModal === 'karmic'}
        analysis={vm.insight?.advanced?.karmicTail}
        onClose={() => setActiveModal(null)}
      />
      <YinYangDetailModal
        visible={activeModal === 'yinyang'}
        data={vm.insight?.advanced?.yinYang}
        onClose={() => setActiveModal(null)}
      />
      <ChakraDetailModal
        visible={activeModal === 'chakra'}
        data={vm.insight?.advanced?.chakras}
        onClose={() => setActiveModal(null)}
      />
      <NamedLinesDetailModal
        visible={activeModal === 'lines'}
        data={vm.insight?.namedLines}
        onClose={() => setActiveModal(null)}
      />
      <ImportantPointsDetailModal
        visible={activeModal === 'points'}
        data={vm.importantPoints}
        onClose={() => setActiveModal(null)}
      />
      <ArcanaStatisticsDetailModal
        visible={activeModal === 'statistics'}
        elementStats={premiumArcanaStats}
        openingAdvice={elementAdvice}
        onClose={() => setActiveModal(null)}
      />
      <ElementDetailModal
        visible={activeModal === 'element'}
        elementSummary={vm.insight?.elements}
        pointsByElement={pointsByElement}
        onClose={() => setActiveModal(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: SPACING.xl },

  // Segmented Control Styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: 4,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },

  sectionWrapper: { marginTop: SPACING.lg },
  gridContainer: { paddingHorizontal: SPACING.md, marginTop: SPACING.sm },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  evolutionContainer: { paddingHorizontal: SPACING.md },
  wheelContainer: { alignItems: 'center', marginTop: SPACING.md },
  retakeButton: { alignSelf: 'center', marginTop: SPACING.md, paddingVertical: SPACING.sm },
});

export default InsightScreen;
