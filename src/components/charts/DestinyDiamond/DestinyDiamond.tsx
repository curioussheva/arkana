// src/components/charts/DestinyDiamond/DestinyDiamond.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';

// 1. Import komponen utama dari Skia & Gesture Handler
import { Canvas, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// 2. Import Types & Layout Data
import type { DestinyMatrix, DestinyPointKey } from '@core/destiny-matrix/types';
import type { ArcanaDefinition } from '@core/arcana/types';
import { useThemeStore } from '@store/theme-store';

// 3. Import Hook Geometry & Sub-Komponen yang baru saja dibuat
import { useDiagramGeometry } from './hooks/useDiagramGeometry';
import { useDiagramPalette } from './hooks/useDiagramPalette';
import { DiagramLines } from './components/DiagramLines';
import { ChannelSymbols } from './components/ChannelSymbols';
import { NodeCircles } from './components/NodeCircles';
import { NodeValues } from './components/NodeValues';
import { TimelineAgeLabels } from './components/TimelineAgeLabels';
import { TouchOverlay } from './components/TouchOverlay';

// Import komponen Legend bawaan (atau buat file LegendControls terpisah)
import { LegendControls, LegendCategory, LEGEND_CATEGORIES } from './components/LegendControls';
import { LegendItem } from './components/LegendItem';
import { resolveCategoryColor, resolveCategoryColorShades } from './utils/nodeColor';

// CATATAN: palette sekarang 100% berasal dari useDiagramPalette() (theme-aware).
// Konstanta VICTORIA lokal yang sebelumnya di-hardcode di file ini sudah
// dihapus — jangan tambahkan lagi sumber warna paralel di sini.

const POINT_TIERS = {
  primary: { points: ['E', 'A', 'B', 'C', 'D'] as DestinyPointKey[], radius: 0.042 },
  secondary: { points: ['F', 'G', 'H', 'I'] as DestinyPointKey[], radius: 0.038 },
  chakra: { points: ['A1', 'B1', 'C1', 'D1', 'F1', 'G1', 'H1', 'I1'] as DestinyPointKey[], radius: 0.024 },
  channels: { points: ['LM_Center', 'Money', 'Love'] as DestinyPointKey[], radius: 0.020 },
  companions: { points: ['SubA', 'SubB', 'SubC', 'SubD', 'SubF', 'SubG', 'SubH', 'SubI'] as DestinyPointKey[], radius: 0.024 },
  timeline: { points: ['T10', 'T20', 'T25', 'T30', 'T35', 'T40', 'T50', 'T60', 'T75'] as DestinyPointKey[], radius: 0.018 },
  powerCenters: { points: ['FamilyCenter', 'UnifiedCenter'] as DestinyPointKey[], radius: 0.028 },
  // Ditambahkan kembali — sebelumnya sempat kelewat saat penggabungan
  // fitur lama, formula sudah ada sejak beberapa sesi lalu tapi belum
  // pernah masuk tier manapun.
  heartDesire: { points: ['HeartDesirePhysical', 'HeartDesireSpiritual'] as DestinyPointKey[], radius: 0.022 },
} as const;

type TierKey = keyof typeof POINT_TIERS;

interface Props {
  matrix: DestinyMatrix;
  onPointPress?: (point: DestinyMatrix['points'][DestinyPointKey]) => void;
  valueSuffix?: string;
  showHeader?: boolean;
  showCredit?: boolean;
  showExtraLabels?: boolean;
  showSpark?: boolean;
  userName?: string;
  birthDate?: string;
  ageOrder?: DestinyPointKey[];
  extraLabels?: Array<{
    text: string;
    x: number;
    y: number;
    fontSize?: number;
    color?: string;
  }>;
}

export interface DestinyDiamondHandle {
  exportAsImage: () => Promise<string>;
}

export const DestinyDiamond = forwardRef<DestinyDiamondHandle, Props>(function DestinyDiamond(
  {
    matrix,
    onPointPress,
    valueSuffix = '',
    showHeader = true,
    showCredit = false,
    showExtraLabels = false,
    showSpark = true,
    userName = '',
    birthDate = '',
    ageOrder,
    extraLabels = [],
  },
  ref
) {
  const { width: screenWidth } = useWindowDimensions();
  const canvasSize = screenWidth - 32;

  // Menggunakan custom hook geometry
  const { origin, contentRadius, toPixel, pathFromKeys } = useDiagramGeometry(canvasSize);

  // Palette theme-aware (dark/light) — satu-satunya sumber warna diagram
  const palette = useDiagramPalette();

  // States
  const [highlightedPointKey, setHighlightedPointKey] = useState<DestinyPointKey | null>(null);
  const [activeCategory, setActiveCategory] = useState<'element' | 'chakra' | 'planet' | 'zodiac'>('element');
  const [activeFilterValue, setActiveFilterValue] = useState<string | null>(null);
  const captureTargetRef = useRef<View>(null);

  // Compute Nodes Data — termasuk fillColors & strokeColor mengikuti
  // kategori legend aktif (element/chakra/planet/zodiac). Warna kategori
  // sekarang jadi FILL gradient (terang->gelap), bukan cuma border tipis
  // yang kurang terlihat di background gelap.
  const allNodes = useMemo(() => {
    const result: Array<any> = [];
    const extract = LEGEND_CATEGORIES.find(c => c.key === activeCategory)?.extract;

    (Object.keys(POINT_TIERS) as TierKey[]).forEach(tierKey => {
      const tier = POINT_TIERS[tierKey];
      tier.points.forEach(key => {
        const point = matrix?.points?.[key];
        if (point) {
          const categoryValue = point.arcana && extract ? extract(point.arcana) : undefined;
          const shades = resolveCategoryColorShades(
            activeCategory,
            categoryValue,
            palette.elements as Record<string, string> | undefined,
            palette.goldPrimary
          );
          result.push({
            key,
            tier: tierKey,
            point,
            pixel: toPixel(key),
            radius: canvasSize * tier.radius,
            categoryValue,
            strokeColor: shades.dark,
            fillColors: [shades.light, shades.dark] as [string, string],
            textColor: shades.textColor,
          });
        }
      });
    });
    return result;
  }, [matrix, canvasSize, toPixel, activeCategory, palette.elements, palette.goldPrimary]);

  // Filter highlight sekarang ikut kategori aktif (element/chakra/planet/
  // zodiac) — sebelumnya hardcode ke element saja, jadi filter di tab
  // Chakra/Planet/Zodiak tidak pernah benar-benar menyaring apa pun.
  const filteredNodes = useMemo(() => {
    if (!activeFilterValue) return allNodes;
    return allNodes.filter(node => node.categoryValue === activeFilterValue);
  }, [allNodes, activeFilterValue]);

  const agePath = useMemo(() => {
    if (!ageOrder || ageOrder.length < 2) return '';
    return pathFromKeys(ageOrder as string[], false);
  }, [ageOrder, pathFromKeys]);

  // Gestures Setup
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch().onUpdate(event => {
    scale.value = Math.max(0.9, Math.min(3.2, event.scale));
  });

  const panGesture = Gesture.Pan().onUpdate(event => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedCanvasStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Function penolong untuk ekstrak nilai unik
  const uniqueFilterValues = useMemo(() => {
    const set = new Set<string>();
    const extract = LEGEND_CATEGORIES.find(c => c.key === activeCategory)?.extract;
    if (!extract) return [];

    allNodes.forEach(({ point }) => {
      const v = point?.arcana ? extract(point.arcana) : undefined;
      if (v) set.add(v);
    });

    return Array.from(set).sort();
  }, [allNodes, activeCategory]);

  const handleNodePress = useCallback((node: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setHighlightedPointKey(node.key);
    onPointPress?.(node.point);
  }, [onPointPress]);

  useImperativeHandle(ref, () => ({
    exportAsImage: async () => {
      if (!captureTargetRef.current) throw new Error('Diagram belum siap');
      return captureRef(captureTargetRef, { format: 'png', quality: 1 });
    },
  }));

  // Font untuk extraLabels — HARUS SkiaText (bukan RN <Text>) karena
  // dirender di dalam <Canvas>. Sebelumnya cuma placeholder `null`.
  const extraLabelFont = useMemo(
    () =>
      matchFont({
        fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
        fontSize: 12,
        fontWeight: 'bold',
      }),
    []
  );

  return (
  <View style={styles.wrapper}>
    {/* ===== HEADER (dikembalikan) ===== */}
    {showHeader && (
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.goldPrimary }]}>
          {userName || 'Peta Matriks Takdir'}
        </Text>
        {birthDate ? (
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>
            {birthDate}
          </Text>
        ) : null}
      </View>
    )}

    <View
      style={[
        styles.canvasMask,
        { backgroundColor: palette.background, borderColor: palette.borderGold },
      ]}
    >
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[animatedCanvasStyle, { width: canvasSize, height: canvasSize }]}>
          <View ref={captureTargetRef} collapsable={false} style={{ width: canvasSize, height: canvasSize }}>

            {/* Canvas Skia Utama dengan Sub-Komponen */}
            <Canvas style={StyleSheet.absoluteFill}>
              {/* Layer 1: Garis Rangka Diagram */}
              <DiagramLines
                pathFromKeys={pathFromKeys}
                toPixel={toPixel}
                palette={palette}
                agePath={agePath}
                origin={origin}
                contentRadius={contentRadius}
              />

              {/* Layer 1b: Simbol $ (Money) & ♥ (Love) */}
              <ChannelSymbols toPixel={toPixel} palette={palette} />

              {/* Layer 2: Bulatan Node & Halo Spark */}
              <NodeCircles
                allNodes={allNodes}
                highlightedPointKey={highlightedPointKey}
                activeFilterValue={activeFilterValue}
                filteredNodes={filteredNodes}
                palette={palette}
                showSpark={showSpark}
              />

              {/* Layer 3: Angka di Dalam Node */}
              <NodeValues
                allNodes={allNodes}
                activeFilterValue={activeFilterValue}
                filteredNodes={filteredNodes}
                valueSuffix={valueSuffix}
                palette={palette}
              />

              {/* Layer 4: Label Timeline Usia */}
              <TimelineAgeLabels
                origin={origin}
                contentRadius={contentRadius}
                textColor={palette.goldDark}
              />

              {/* Layer Extra Labels (opsional) — sekarang benar-benar
                  render pakai SkiaText, bukan placeholder null lagi. */}
              {showExtraLabels && extraLabelFont &&
                extraLabels?.map((label, idx) => (
                  <SkiaText
                    key={`extra-label-${idx}`}
                    x={label.x}
                    y={label.y}
                    text={label.text}
                    font={extraLabelFont}
                    color={label.color ?? palette.textMuted}
                  />
                ))}
            </Canvas>

            {/* Layer 5: Target Sentuh/Tap */}
            <TouchOverlay
              allNodes={allNodes}
              onNodePress={handleNodePress}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>

      {/* Legend Controls */}
      <LegendControls
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveFilterValue(null);
        }}
        activeFilterValue={activeFilterValue}
        onSelectFilterValue={(val) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          setActiveFilterValue(prev => (prev === val ? null : val));
        }}
        uniqueFilterValues={uniqueFilterValues}
        palette={palette}
      />
    {/* ===== CREDIT (dikembalikan) ===== */}
    {showCredit && (
      <Text style={[styles.credit, { color: palette.goldDark }]}>
        CuriousSheva
      </Text>
    )}
  </View>
);
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 4,
  },
  canvasMask: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginTop: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 2,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  credit: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 6,
    textAlign: 'center',
  },
});
 