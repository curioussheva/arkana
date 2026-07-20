// Berkas: src/features/insight/presentation/InsightScreen.tsx

import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// 🛡️ FIX TS 3: Pastikan SafeAreaView diimpor dari safe-area-context agar mendukung properti 'edges'
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeStore } from '@store/theme-store';
import { useInsight } from '../hooks/useInsight';
import { SPACING, FONT_SIZE } from '@constants/theme';
import { compileEvolutionCycle } from '@core/destiny-matrix/evolutionEngine';
import type { DestinyPointKey } from '@core/destiny-matrix/types';

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
import { ArcanaSequenceGridCard } from '../components/features/ArcanaSequenceGridCard';
import { DestinyAnchorGridCard } from '../components/features/DestinyAnchorGridCard';
import { ArcanaStatisticsGridCard } from '../components/features/ArcanaStatisticsGridCard';
import { KarmicTailGridCard } from '../components/features/KarmicTailGridCard';
import { YinYangGridCard } from '../components/features/YinYangGridCard';
import { ChakraGridCard } from '../components/features/ChakraGridCard';
import { NamedLinesGridCard } from '../components/features/NamedLinesGridCard';

// 4. Interactive Assessment
import { AssessmentQuiz } from '../components/features/AssessmentQuiz';
import { ArcanaWheel } from '@components/charts/ArcanaWheel';

// 5. Detail Modals (PageSheets)
import { ArcanaSequenceDetailModal } from '../components/features/detail-modals/ArcanaSequenceDetailModal';
import { KarmicTailDetailModal } from '../components/features/detail-modals/KarmicTailDetailModal';
import { YinYangDetailModal } from '../components/features/detail-modals/YinYangDetailModal';
import { ChakraDetailModal } from '../components/features/detail-modals/ChakraDetailModal';
import { NamedLinesDetailModal } from '../components/features/detail-modals/NamedLinesDetailModal';
import { ImportantPointsDetailModal } from '../components/features/detail-modals/ImportantPointsDetailModal';
import { ArcanaStatisticsDetailModal } from '../components/features/detail-modals/ArcanaStatisticsDetailModal';
import { ElementDetailModal } from '../components/features/detail-modals/ElementDetailModal';

// 🎯 FILTER CORE: Pastikan analisis statistik hanya mengolah 20 titik utama sejati
const VALID_20_KEYS: DestinyPointKey[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
];

export function InsightScreen() {
  const vm = useInsight();
  const colors = useThemeStore(state => state.getColors());

  const [activeModal, setActiveModal] = useState<'sequence' | 'karmic' | 'yinyang' | 'chakra' | 'lines' | 'statistics' | 'points' | 'element' | null>(null);

  const dominantElement = vm.insight?.elements?.stats?.dominant || 'Murni';
  const elementAdvice = `${vm.insight?.elements?.opening || ''}\n\n${vm.insight?.elements?.advice || ''}`;

  // 🛑 RULES OF HOOKS SAFE: Seluruh pendelegasian useMemo ditaruh di atas sebelum interupsi JSX return
  const evolutionNarrative = useMemo(() => {
    if (!vm.matrixPoints || !vm.userAssessmentState) return '';
    return compileEvolutionCycle(vm.matrixPoints, vm.userAssessmentState);
  }, [vm.matrixPoints, vm.userAssessmentState]);
 
    // 🎯 SINKRONISASI TOTAL: Ambil dari referensi data matriks utuh (34/20 titik) lalu saring ketat ke 20 Core Utama
  const safeCorePointsArray = useMemo(() => {
    // Gunakan fallback ke vm.matrix.points jika vm.matrixPoints hanya berisi pilar utama
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

 
  const premiumArcanaStats = useMemo(() => {
    const totalPoints = safeCorePointsArray.length;
    if (totalPoints === 0) return null;

    // 🛡️ Ekstraksi nilai arcana ID secara bersih dengan intersept penuh nilai 0 -> 22
    const validValues = safeCorePointsArray.map((p: any) => {
      const rawVal = p?.arcana?.id ?? p?.value ?? 0; 
      return rawVal === 0 ? 22 : rawVal;
    });

    // Hitung Rata-rata (Mean)
    const sum = validValues.reduce((a, b) => a + b, 0);
    const avgValue = Math.round(sum / totalPoints);

    // Hitung Deviasi Standar (Sebaran Getaran Batin)
    const variance = validValues.reduce((a, b) => a + Math.pow(b - avgValue, 2), 0) / totalPoints;
    const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

    // Hitung Frekuensi Kemunculan Modus
    const frequencyMap: Record<number, { id: number; count: number; points: string[]; cardName: string }> = {};
    
    safeCorePointsArray.forEach((p: any) => {
      const rawVal = p?.arcana?.id ?? p?.value ?? 0; 
      const cleanId = rawVal === 0 ? 22 : rawVal;
      const displayLabel = p?.label || p?.key || 'Titik Energi'; 

      if (!frequencyMap[cleanId]) {
        frequencyMap[cleanId] = {
          id: cleanId,
          count: 0,
          points: [],
          cardName: p?.arcana?.matrixName || p?.arcana?.tarotName || p?.arcanaName || `Arcana ${cleanId}`
        };
      }
      frequencyMap[cleanId].count += 1;
      frequencyMap[cleanId].points.push(displayLabel);
    });

    const sortedCards = Object.values(frequencyMap).sort((a, b) => b.count - a.count);
    const representativeCard = sortedCards[0]?.count > 1 ? sortedCards[0] : null;

    // Hitung Rasio Diversitas Unik
    const uniqueCount = Object.keys(frequencyMap).length;
    const diversityRatio = Math.round((uniqueCount / totalPoints) * 100);

    return {
      totalPoints,
      avgValue,
      stdDev,
      dominantElement,
      uniqueCount,
      diversityRatio,
      representativeCard
    };
  }, [safeCorePointsArray, dominantElement]);

  const safeArcanaE = useMemo(() => {
    const pointE = vm.matrixPoints?.E as any; 
    if (!pointE) return null;
    return {
      ...pointE,
      value: pointE.value === 0 ? 22 : pointE.value,
      arcana: pointE.arcana ? {
        ...pointE.arcana,
        id: pointE.arcana.id === 0 ? 22 : pointE.arcana.id
      } : undefined
    };
  }, [vm.matrixPoints]);
  
  const pointsByElement = useMemo(() => {
    if (safeCorePointsArray.length === 0) return null;

    const groups: Record<string, Array<{ key: string; label: string; arcanaName: string }>> = {
      Fire: [], Water: [], Air: [], Earth: [],
    };

    safeCorePointsArray.forEach((point) => {
      const element = point?.arcana?.element;
      if (element && groups[element]) {
        groups[element].push({
          key: point.key,
          label: point.label || point.key,
          arcanaName: point.arcana?.shortName || point.arcana?.matrixName || 'Arcana',
        });
      }
    });

    return {
      Fire: groups.Fire,
      Water: groups.Water,
      Air: groups.Air,
      Earth: groups.Earth,
    };
  }, [safeCorePointsArray]);
  
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
        trait: 'Kecerdasan intelektual strategis, visi kemanusiaan global, keterbukaan ide, dan kebebasan berpikir objektif.',
        advice: 'Gunakan kekuatan udara untuk mengartikulasikan kebenaran batinmu dengan jernih tanpa perlu takut dihakimi lingkungan luar.',
        pointsCount: airPoints.length,
        // Ganti mapping array labels di InsightScreen agar melampirkan nama/ID Arkananya:
pointsLabels: airPoints.map(p => `${p.key} (${p.label || 'Titik'}) - Arcana ${p.arcana?.id ?? p.value}`)

      },
      {
        key: 'Eagle',
        icon: '🦅',
        name: 'Elang (Eagle)',
        element: 'Air',
        zodiac: 'Scorpio',
        color: '#3b82f6',
        trait: 'Kedalaman kompas rasa, intuisi spiritual tajam, transformasi sirkular, dan kepekaan empati batin.',
        advice: 'Pertajam radar intuisimu. Tatap realitas kehidupan dari sudut pandang tinggi seperti elang terbang, jangan tenggelam di gelombang emosi sesaat.',
        pointsCount: waterPoints.length,
        // Ganti mapping array labels di InsightScreen agar melampirkan nama/ID Arkananya:
pointsLabels: airPoints.map(p => `${p.key} (${p.label || 'Titik'}) - Arcana ${p.arcana?.id ?? p.value}`)

      },
      {
        key: 'Lion',
        icon: '🦁',
        name: 'Singa (Lion)',
        element: 'Api',
        zodiac: 'Leo',
        color: '#ef4444',
        trait: 'Gairah transformatif, ambisi kepemimpinan penuh karisma, keberanian mengambil aksi, dan daya dorong proteksi tinggi.',
        advice: 'Gunakan energi singa untuk mendobrak batasan keraguan batinmu. Ambil tindakan tegas sekarang, namun kendalikan agar ego tidak membakar diri.',
        pointsCount: firePoints.length,
        // Ganti mapping array labels di InsightScreen agar melampirkan nama/ID Arkananya:
pointsLabels: airPoints.map(p => `${p.key} (${p.label || 'Titik'}) - Arcana ${p.arcana?.id ?? p.value}`)

      },
      {
        key: 'Ox',
        icon: '🐂',
        name: 'Lembu (Bull / Ox)',
        element: 'Bumi',
        zodiac: 'Taurus',
        color: '#22c55e',
        trait: 'Stabilitas material nyata, kedisiplinan logis yang mengakar, konsistensi jangka panjang, dan ketekunan memanifestasikan kelimpahan.',
        advice: 'Bumi meminta ketabahan. Bangun pondasi finansial dan spiritualmu secara konsisten. Langkah kecil yang berakar jauh lebih kokoh dibanding lompatan instan.',
        // 🛡️ FIX: Properti krusial yang sebelumnya tertinggal dan memicu crash
        pointsCount: earthPoints.length,
        // Ganti mapping array labels di InsightScreen agar melampirkan nama/ID Arkananya:
pointsLabels: airPoints.map(p => `${p.key} (${p.label || 'Titik'}) - Arcana ${p.arcana?.id ?? p.value}`)

      },
    ];
  }, [pointsByElement]);

  // 🚧 KONDISI EARLY RETURN: Ditempatkan dengan aman di bawah seluruh deklarasi Hooks
  if (!vm.hasInsight || !vm.insight) {
    return <EmptyInsight />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <InsightHeader profileName={vm.profileName || 'Profil Utama'} />

        {/* ================= BLOK 1: ELEMENT BANNER ================= */}
        <View style={styles.sectionWrapper}>
          <SectionTitle 
            title="🌌 Refleksi &amp; Intisari Diri" 
            subtitle="Cetak biru elemen murni yang mendominasi getaran jiwamu saat ini."
          />
          <ElementBanner
            element={dominantElement === 'Murni' ? 'Fire' : dominantElement} 
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
              <ArcanaSequenceGridCard 
                data={vm.arcanaSequence}
                onPress={() => setActiveModal('sequence')}
              />
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
            {vm.matrixPoints && (
              vm.userAssessmentState === null ? (
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
                    <Text style={{ color: colors.primary, fontSize: FONT_SIZE.sm, fontWeight: '600' }}>
                      🔄 Ulangi Kuesioner Evolusi
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        </View>

                {/* ================= BLOK 3: ASSESSMENT / EVOLUTION ================= */}
        <View style={styles.sectionWrapper}>
           {/* ... bagian kode kuesioner & roda chakra ... */}
        </View>

        {/* ================= BLOK PENUTUP UTAMA: THE TOTEM SANCTUARY ================= */}
        <TotemSanctuarySection totemAlliance={totemAllianceData} />

        <ShareButton onPress={vm.share} />

      </ScrollView>

      {/* ================= MODALS INJECTIONS LAYER ================= */}
      <ArcanaSequenceDetailModal visible={activeModal === 'sequence'} data={vm.arcanaSequence} onClose={() => setActiveModal(null)} />
      <KarmicTailDetailModal visible={activeModal === 'karmic'} analysis={vm.insight?.advanced?.karmicTail} onClose={() => setActiveModal(null)} />
      <YinYangDetailModal visible={activeModal === 'yinyang'} data={vm.insight?.advanced?.yinYang} onClose={() => setActiveModal(null)} />
      <ChakraDetailModal visible={activeModal === 'chakra'} data={vm.insight?.advanced?.chakras} onClose={() => setActiveModal(null)} />
      <NamedLinesDetailModal visible={activeModal === 'lines'} data={vm.insight?.namedLines} onClose={() => setActiveModal(null)} />
      
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
  sectionWrapper: { marginTop: SPACING.xl },
  gridContainer: { paddingHorizontal: SPACING.md, marginTop: SPACING.sm },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  evolutionContainer: { paddingHorizontal: SPACING.md },
  wheelContainer: { alignItems: 'center', marginTop: SPACING.md },
  retakeButton: { alignSelf: 'center', marginTop: SPACING.md, paddingVertical: SPACING.sm },
});

export default InsightScreen;
 