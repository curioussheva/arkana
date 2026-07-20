import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { Canvas, Path, Circle, Group, BlurMask, LinearGradient, vec, Shadow, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';

import type { DestinyMatrix, DestinyPointKey } from '@core/destiny-matrix/types';
import type { ArcanaDefinition } from '@core/arcana/types';
import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';
import type { ElementType } from '@components/ui/ArkanaCard/types';

// 🛡️ PERBAIKAN LINTER 1: Ubah require() inline menjadi ES6 Static Import di atas berkas
import { POINT_LAYOUT, OUTER_OUTLINE, VERTICAL_DIAGONAL, HORIZONTAL_DIAGONAL } from '@core/destiny-matrix/layout';

// ─── Types ───────────────────────────────────────────
interface Props {
  matrix: DestinyMatrix;
  onPointPress?: (point: DestinyMatrix['points'][DestinyPointKey]) => void;
  labelMode?: 'letters' | 'chakra' | 'element' | 'planet'; 
}

export interface DestinyDiamondHandle {
  exportAsImage: () => Promise<string>;
}

// ─── 🎯 SELEKSI TIER RENDERING (Total 20 Titik Aktif) ───────────────────
const PRIMARY_POINTS: DestinyPointKey[] = ['A', 'B', 'C', 'D', 'E'];
const SECONDARY_POINTS: DestinyPointKey[] = ['F', 'G', 'H', 'I'];
const TERTIARY_POINTS: DestinyPointKey[] = ['J', 'K', 'L', 'M'];
const OUTER_POINTS: DestinyPointKey[] = ['Q', 'R', 'S', 'T'];
const KARMIC_EXT_POINTS: DestinyPointKey[] = ['N', 'O', 'P']; 

const POINT_TIERS = {
  primary: { points: PRIMARY_POINTS, radius: 0.046 },
  secondary: { points: SECONDARY_POINTS, radius: 0.036 },
  tertiary: { points: TERTIARY_POINTS, radius: 0.028 },
  outer: { points: OUTER_POINTS, radius: 0.024 },
  karmicExt: { points: KARMIC_EXT_POINTS, radius: 0.024 }, 
} as const; 

// ─── 🎯 TRANSLASI LABEL HUBUNGAN ALUR KOMPAS SEJATI ───────────────────
function getPointLabel(
  key: DestinyPointKey,
  point: DestinyMatrix['points'][DestinyPointKey],
  mode: Props['labelMode'] = 'letters',
): string {
  if (mode === 'chakra') return point.arcana?.chakra ? point.arcana.chakra.split(' ')[0] : key;
  if (mode === 'element') return point.arcana?.element ?? key;
  if (mode === 'planet') return point.arcana?.planet ?? key;  

  const RELATIONAL_NAME_MAP: Record<string, string> = {
    'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E',
    'R': 'B1', 
    'S': 'C1', 
    'T': 'D1', 
    'J': 'A2', 'K': 'B2', 'L': 'C2', 'M': 'D2',
    'I': 'A3', 'F': 'B3', 'G': 'C3', 'H': 'D3',
    'N': 'N',
    'O': 'O', 
    'P': 'P',
    'Q': 'A1', 
  };

  return RELATIONAL_NAME_MAP[key] || key;
}
 
// ─── Legend Categories Config ────────────────────────
type LegendCategory = 'element' | 'chakra' | 'planet' | 'zodiac';

interface LegendCategoryConfig {
  key: LegendCategory;
  label: string;
  icon: string;
  extract: (arcana: ArcanaDefinition) => string | undefined;
}

const LEGEND_CATEGORIES: LegendCategoryConfig[] = [
  { key: 'element', label: 'Elemen', icon: '🔥', extract: (arcana) => arcana.element },
  { key: 'chakra', label: 'Chakra', icon: '🌀', extract: (arcana) => arcana.chakra },
  { key: 'planet', label: 'Planet', icon: '🪐', extract: (arcana) => arcana.planet },
  { key: 'zodiac', label: 'Zodiak', icon: '♈', extract: (arcana) => arcana.zodiac },
];

function getUniqueValuesForCategory(
  nodes: Array<{ key: DestinyPointKey; point: DestinyMatrix['points'][DestinyPointKey] }>,
  category: LegendCategory,
): string[] {
  const set = new Set<string>();
  nodes.forEach(({ point }) => {
    const arcana = point?.arcana;
    if (!arcana) return;
    const value = LEGEND_CATEGORIES.find(c => c.key === category)?.extract(arcana);
    if (value) set.add(value);
  });
  return Array.from(set).sort();
}

// ─── Legend Item Component ───────────────────────────
function LegendItem({
  color,
  label,
  isHighlighted,
  onPress,
}: {
  color: string;
  label: string;
  icon: string;
  isHighlighted: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[legendStyles.item, isHighlighted && legendStyles.itemHighlighted]}
    >
      <View style={[legendStyles.dot, { backgroundColor: color }]}>
        <View style={legendStyles.dotInner} />
      </View>
      <Text style={[legendStyles.text, isHighlighted && legendStyles.textHighlighted]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Component ──────────────────────────────────
export const DestinyDiamond = forwardRef<DestinyDiamondHandle, Props>(
  function DestinyDiamond({ matrix, onPointPress, labelMode = 'letters' }, ref) {
    const { width: screenWidth } = useWindowDimensions();
    const colors = useThemeStore(state => state.getColors());

    const [highlightedPointKey, setHighlightedPointKey] = useState<DestinyPointKey | null>(null);
    const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [activeCategory, setActiveCategory] = useState<LegendCategory>('element');
    const [activeFilterValue, setActiveFilterValue] = useState<string | null>(null);

    const captureTargetRef = useRef<View>(null);
    const containerRef = useRef<View>(null);

    useEffect(() => {
      return () => {
        if (highlightTimer.current) clearTimeout(highlightTimer.current);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      exportAsImage: async () => {
        if (!captureTargetRef.current) throw new Error('Diagram belum siap');
        return captureRef(captureTargetRef, { format: 'png', quality: 1 });
      },
    }));

    const HORIZONTAL_PADDING = 16;
    const canvasSize = screenWidth - HORIZONTAL_PADDING * 2 - 2; 
    const contentRadius = canvasSize * 0.345;
    const origin = canvasSize / 2;

    const toPixel = useCallback(
      (key: DestinyPointKey) => {
        // 🛡️ Menggunakan objek koordinat dari static import di atas
        const coords = POINT_LAYOUT[key] || { x: 0, y: 0 };
        return {
          x: origin + coords.x * contentRadius,
          y: origin + coords.y * contentRadius,
        };
      },
      [origin, contentRadius],
    );

    const paths = useMemo(
      () => ({
        outline: pathFromKeys(OUTER_OUTLINE, toPixel),
        vertical: pathFromKeys(VERTICAL_DIAGONAL, toPixel),
        horizontal: pathFromKeys(HORIZONTAL_DIAGONAL, toPixel),
      }),
      [toPixel],
    );

    const allNodes = useMemo(() => {
      const result: Array<{
        key: DestinyPointKey;
        point: DestinyMatrix['points'][DestinyPointKey];
        pixel: { x: number; y: number };
        radius: number;
      }> = [];
      Object.entries(POINT_TIERS).forEach(([tierConfigName, tierConfig]) => {
        tierConfig.points.forEach(key => {
          const point = matrix.points[key];
          if (point) {
            result.push({
              key,
              point,
              pixel: toPixel(key),
              radius: canvasSize * (POINT_TIERS as any)[tierConfigName].radius,
            });
          }
        });
      });
      return result;
    }, [matrix, canvasSize, toPixel]);

    const uniqueFilterValues = useMemo(
      () => getUniqueValuesForCategory(allNodes, activeCategory),
      [allNodes, activeCategory],
    );

    const filteredNodes = useMemo(() => {
      if (!activeFilterValue) return allNodes;
      return allNodes.filter(node => {
        const arcana = node.point?.arcana;
        if (!arcana) return false;
        const value = LEGEND_CATEGORIES.find(c => c.key === activeCategory)?.extract(arcana);
        return value === activeFilterValue;
      });
    }, [allNodes, activeFilterValue, activeCategory]);

    // Shared Values untuk Gesture Zoom & Pan
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedScale = useSharedValue(1);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
      .onStart(() => { savedScale.value = scale.value; })
      .onUpdate((event) => {
        scale.value = Math.max(0.9, Math.min(3, savedScale.value * event.scale));
      })
      .onEnd(() => { savedScale.value = scale.value; });

    const panGesture = Gesture.Pan()
      .onStart(() => {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      })
      .onUpdate((event) => {
        const maxPan = canvasSize * (scale.value - 1) / 2;
        translateX.value = Math.max(-maxPan, Math.min(maxPan, savedTranslateX.value + event.translationX));
        translateY.value = Math.max(-maxPan, Math.min(maxPan, savedTranslateY.value + event.translationY));
      })
      .onEnd(() => {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      });

    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedCanvasStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    const handleNodePress = useCallback(
      (node: typeof allNodes[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setHighlightedPointKey(node.key);
        onPointPress?.(node.point);
        if (highlightTimer.current) clearTimeout(highlightTimer.current);
        highlightTimer.current = setTimeout(() => setHighlightedPointKey(null), 2000);
      },
      [onPointPress],
    );

    const handleLegendPress = useCallback((value: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setActiveFilterValue(prev => (prev === value ? null : value));
    }, []);

    const backgroundCircle = useMemo(() => {
      const r = contentRadius * 1.1;
      return `M${origin - r},${origin} A${r},${r} 0 1,1 ${origin + r},${origin} A${r},${r} 0 1,1 ${origin - r},${origin} Z`;
    }, [origin, contentRadius]);

    const baseFontStyle = useMemo(() => ({
      fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
      fontWeight: 'bold' as const,
    }), []);

    return (
      <View style={containerStyles.wrapper} ref={containerRef}>
        <View style={containerStyles.canvasMask}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[animatedCanvasStyle, { width: canvasSize, height: canvasSize }]}>
              <View
                ref={captureTargetRef}
                collapsable={false}
                style={[
                  containerStyles.canvasContainer,
                  {
                    width: canvasSize,
                    height: canvasSize,
                    backgroundColor: colors.backgroundLight,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Canvas style={StyleSheet.absoluteFill}>
                  <Path path={backgroundCircle} style="fill" color={colors.primary + '05'} />

                  {/* Garis Geometris */}
                  <Group>
                    <Path path={paths.outline} style="stroke" strokeWidth={2} color={colors.border} strokeCap="round" strokeJoin="round">
                      <BlurMask blur={1} style="normal" />
                    </Path>
                    <Path path={paths.vertical} style="stroke" strokeWidth={1.5} color={colors.borderLight + '80'} strokeCap="round" />
                    <Path path={paths.horizontal} style="stroke" strokeWidth={1.5} color={colors.borderLight + '80'} strokeCap="round" />
                  </Group>

                  {/* Dekorasi Bintang */}
                  <Group opacity={0.3}>
                    {[0, 90, 180, 270].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const r = contentRadius * 1.15;
                      return (
                        <Circle key={`star-${i}`} cx={origin + r * Math.cos(rad)} cy={origin + r * Math.sin(rad)} r={3} color={colors.primary} />
                      );
                    })}
                  </Group>

                  {/* Bulatan Node (Fisik Lingkaran) */}
                  {allNodes.map(node => {
                    const isFilteredOut = activeFilterValue ? !filteredNodes.some(fn => fn.key === node.key) : false;
                    const element = node.point?.arcana?.element;
                    const gradientColors = element
                      ? (ELEMENT_STYLES[element as ElementType]?.gradient ?? [colors.primary, colors.primaryDark])
                      : [colors.primary, colors.primaryDark];
                    const baseOpacity = isFilteredOut ? 0.15 : 1;

                    return (
                      <Group key={`node-${node.key}`} opacity={baseOpacity}>
                        {(highlightedPointKey === node.key || (!isFilteredOut && activeFilterValue)) && (
                          <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius * 2}>
                            <LinearGradient start={vec(node.pixel.x - node.radius, node.pixel.y - node.radius)} end={vec(node.pixel.x + node.radius, node.pixel.y + node.radius)} colors={[gradientColors[0] + '60', 'transparent']} />
                            <BlurMask blur={node.radius * 1.5} style="normal" />
                          </Circle>
                        )}
                        <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius}>
                          <LinearGradient start={vec(node.pixel.x - node.radius, node.pixel.y - node.radius)} end={vec(node.pixel.x + node.radius, node.pixel.y + node.radius)} colors={gradientColors} />
                          <Shadow dx={0} dy={2} blur={4} color="rgba(0,0,0,0.4)" />
                        </Circle>
                        <Circle cx={node.pixel.x - node.radius * 0.2} cy={node.pixel.y - node.radius * 0.2} r={node.radius * 0.4} color="rgba(255,255,255,0.25)" />
                      </Group>
                    );
                  })}

                  {/* Render Teks Skia (Nama Titik Dinamis A1-E2 & Skor Angka) */}
                  {allNodes.map(node => {
                    const isFilteredOut = activeFilterValue ? !filteredNodes.some(fn => fn.key === node.key) : false;
                    if (isFilteredOut) return null;

                    const keySize = Math.max(9, node.radius * 0.46);
                    const valSize = Math.max(8, node.radius * 0.36);

                    const fontForKey = matchFont({ ...baseFontStyle, fontSize: keySize });
                    const fontForVal = matchFont({ ...baseFontStyle, fontSize: valSize });

                    const txtKey = getPointLabel(node.key, node.point, labelMode);
                    const txtVal = String(node.point?.value ?? '0');

                    const xKey = node.pixel.x - (keySize * 0.31 * txtKey.length);
                    const yKey = node.pixel.y - 1;
                    const xVal = node.pixel.x - (valSize * 0.31 * txtVal.length);
                    const yVal = node.pixel.y + valSize + 1;

                    return (
                      <Group key={`skia-txt-${node.key}`}>
                        {/* Shadow Teks untuk Kontras Dark Mode */}
                        <SkiaText x={xKey} y={yKey + 0.5} text={txtKey} font={fontForKey} color="rgba(0,0,0,0.85)" />
                        <SkiaText x={xVal} y={yVal + 0.5} text={txtVal} font={fontForVal} color="rgba(0,0,0,0.85)" />
                        {/* Teks Utama Putih */}
                        <SkiaText x={xKey} y={yKey} text={txtKey} font={fontForKey} color="#FFFFFF" />
                        <SkiaText x={xVal} y={yVal} text={txtVal} font={fontForVal} color="#FFFFFF" />
                      </Group>
                    );
                  })}
                </Canvas>

                {/* Touch Overlays (Transparan) */}
                {allNodes.map(node => {
                  const touchSize = node.radius * 2 * 1.6;
                  return (
                    <TouchableOpacity
                      key={`touch-${node.key}`}
                      activeOpacity={0.6}
                      onPress={() => handleNodePress(node)}
                      onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        handleNodePress(node);
                      }}
                      style={[
                        containerStyles.touchTarget,
                        {
                          left: node.pixel.x - touchSize / 2,
                          top: node.pixel.y - touchSize / 2,
                          width: touchSize,
                          height: touchSize,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* ─── Legenda Interaktif ─── */}
        <View style={containerStyles.legendContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={containerStyles.categoryScroll}>
            {LEGEND_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => {
                  setActiveCategory(cat.key);
                  setActiveFilterValue(null); 
                }}
                style={[
                  containerStyles.categoryChip,
                  activeCategory === cat.key && { backgroundColor: colors.primary + '25', borderColor: colors.primary + '40' },
                ]}
              >
                <Text style={containerStyles.categoryIcon}>{cat.icon}</Text>
                <Text style={[containerStyles.categoryText, activeCategory === cat.key && { color: colors.text, fontWeight: '700' }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={containerStyles.legendItems}>
            {uniqueFilterValues.map(value => {
              let color = colors.primary;
              if (activeCategory === 'element') {
                color = ELEMENT_STYLES[value as ElementType]?.color ?? colors.primary;
              } else {
                const matched = allNodes.find(n => LEGEND_CATEGORIES.find(c => c.key === activeCategory)?.extract(n.point.arcana!) === value);
                if (matched?.point?.arcana?.element) {
                  color = ELEMENT_STYLES[matched.point.arcana.element as ElementType]?.color ?? colors.primary;
                }
              }
              return (
                <LegendItem
                  key={value}
                  color={color}
                  label={value}
                  icon={''} 
                  isHighlighted={activeFilterValue === value}
                  onPress={() => handleLegendPress(value)}
                />
              );
            })}
          </View>
        </View>

        <Text style={[containerStyles.hint, { color: colors.textMuted }]}>
          💡 Tap node untuk detail · Long press sorot · Pinch & seret untuk eksplorasi peta
        </Text>
      </View>
    );
  },
);

DestinyDiamond.displayName = 'DestinyDiamond';

function pathFromKeys(keys: DestinyPointKey[], toPixel: (key: DestinyPointKey) => { x: number; y: number }): string {
  if (!keys || !keys.length) return '';
  return keys.map((k, i) => {
    const p = toPixel(k);
    return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
  }).join(' ') + ' Z';
}

// ─── Styles ──────────────────────────────────────────
const BORDER_RADIUS_VAL = { md: 12 };

const containerStyles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', width: '100%' },
  canvasMask: {
    borderRadius: BORDER_RADIUS_VAL.md,
    overflow: 'hidden', 
  },
  canvasContainer: {
    borderWidth: 1,
    position: 'relative',
  },
  touchTarget: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  legendContainer: { marginTop: 16, width: '100%', paddingHorizontal: 4 },
  categoryScroll: { flexDirection: 'row', marginBottom: 12 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  categoryIcon: { fontSize: 13, marginRight: 4 },
  categoryText: { fontSize: 11, color: '#94A3B8' },
  legendItems: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  hint: { fontSize: 10, textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
});

const legendStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  itemHighlighted: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  dot: { width: 8, height: 8, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  dotInner: { width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.6)' },
  text: { fontSize: 10, color: '#94A3B8' },
  textHighlighted: { color: '#FFF', fontWeight: '700' },
});
 