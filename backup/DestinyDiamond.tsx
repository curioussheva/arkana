// src/components/charts/DestinyDiamond.tsx
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
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import {
  Canvas,
  Path,
  Group,
  Circle,
  LinearGradient,
  Text as SkiaText,
  vec,
  DashPathEffect,
  BlurMask,
  Shadow,
  matchFont,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import type { DestinyMatrix, DestinyPointKey } from '@core/destiny-matrix/types';
import type { ArcanaDefinition } from '@core/arcana/types';
import {
  POINT_LAYOUT,
  OUTER_OUTLINE,
  ANCESTRAL_OUTLINE,
  VERTICAL_DIAGONAL,
  HORIZONTAL_DIAGONAL,
  MALE_GENERATION_LINE,
  FEMALE_GENERATION_LINE,
  TIMELINE_AGE_LABELS,
} from '@core/destiny-matrix/layout';
import { useThemeStore } from '@store/theme-store';

const VICTORIA = {
  goldPrimary: '#D4AF37',
  goldLight: '#F3E5AB',
  goldDark: '#8C6D23',
  goldGlow: 'rgba(212, 175, 55, 0.45)',
  lineStroke: 'rgba(212, 175, 55, 0.35)',
  borderGold: 'rgba(212, 175, 55, 0.25)',
  maleLine: 'rgba(138, 66, 184, 0.7)',
  femaleLine: 'rgba(216, 67, 21, 0.7)',
  loveMoneyDash: 'rgba(212, 175, 55, 0.55)',
  centerNode: ['#FFF066', '#FFD700'] as [string, string],
  topNode: ['#A066C5', '#8A42B8'] as [string, string],
  spark: 'rgba(255, 255, 255, 0.22)',
  labelShadow: '#000000',
};

const POINT_TIERS = {
  primary: {
    points: ['E', 'A', 'B', 'C', 'D'] as DestinyPointKey[],
    radius: 0.042,
  },
  secondary: {
    points: ['F', 'G', 'H', 'I'] as DestinyPointKey[],
    radius: 0.036,
  },
  chakra: {
    points: ['A1', 'B1', 'C1', 'D1', 'F1', 'G1', 'H1', 'I1'] as DestinyPointKey[],
    radius: 0.026,
  },
  channels: {
    points: ['LM_Center', 'Money', 'Love'] as DestinyPointKey[],
    radius: 0.020,
  },
  companions: {
    points: ['SubA', 'SubB', 'SubC', 'SubD', 'SubF', 'SubG', 'SubH', 'SubI'] as DestinyPointKey[],
    radius: 0.026,
  },
  timeline: {
    points: ['T10', 'T20', 'T25', 'T30', 'T35', 'T40', 'T50', 'T60', 'T75'] as DestinyPointKey[],
    radius: 0.018,
  },
} as const;

type TierKey = keyof typeof POINT_TIERS;

interface ExtraLabel {
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
}

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
  extraLabels?: ExtraLabel[];
  labelMode?: 'letters' | 'chakra' | 'element' | 'planet' | 'value' | 'dual';
}

export interface DestinyDiamondHandle {
  exportAsImage: () => Promise<string>;
}

type LegendCategory = 'element' | 'chakra' | 'planet' | 'zodiac';

interface LegendCategoryConfig {
  key: LegendCategory;
  label: string;
  icon: string;
  extract: (arcana: ArcanaDefinition) => string | undefined;
}

const LEGEND_CATEGORIES: LegendCategoryConfig[] = [
  { key: 'element', label: 'Elemen', icon: '✦', extract: a => a.element },
  { key: 'chakra', label: 'Chakra', icon: '◎', extract: a => a.chakra },
  { key: 'planet', label: 'Planet', icon: '◐', extract: a => a.planet },
  { key: 'zodiac', label: 'Zodiak', icon: '✧', extract: a => a.zodiac },
];

function getUniqueValuesForCategory(
  nodes: Array<{ key: DestinyPointKey; point: DestinyMatrix['points'][DestinyPointKey] }>,
  category: LegendCategory
): string[] {
  const set = new Set<string>();
  const extract = LEGEND_CATEGORIES.find(c => c.key === category)?.extract;
  if (!extract) return [];
  nodes.forEach(({ point }) => {
    const v = point?.arcana ? extract(point.arcana) : undefined;
    if (v) set.add(v);
  });
  return Array.from(set).sort();
}

function useDiagramPalette() {
  const themeColors = useThemeStore(state => state.getColors());
  const isDark = useThemeStore(state => state.isDark());

  return useMemo(() => {
    return {
      background: themeColors.background,
      surface: themeColors.surface,
      text: themeColors.text,
      textMuted: themeColors.textMuted,
      textSecondary: themeColors.textSecondary ?? themeColors.textMuted,
      primary: themeColors.primary,
      primaryLight: themeColors.primaryLight,
      border: themeColors.border,
      nodeBg: isDark
        ? (['#1F1D27', '#0A090D'] as [string, string])
        : ([themeColors.surfaceLight || '#E8E4F0', themeColors.surfaceDark || '#D0CBD8'] as [
            string,
            string,
          ]),
      valueText: isDark ? '#F3E5AB' : themeColors.text,
      goldPrimary: VICTORIA.goldPrimary,
      goldLight: VICTORIA.goldLight,
      goldDark: VICTORIA.goldDark,
      goldGlow: VICTORIA.goldGlow,
      lineStroke: isDark ? VICTORIA.lineStroke : 'rgba(140, 109, 35, 0.45)',
      borderGold: isDark ? VICTORIA.borderGold : 'rgba(140, 109, 35, 0.3)',
      maleLine: VICTORIA.maleLine,
      femaleLine: VICTORIA.femaleLine,
      loveMoneyDash: VICTORIA.loveMoneyDash,
      centerNode: VICTORIA.centerNode,
      topNode: VICTORIA.topNode,
      spark: VICTORIA.spark,
      labelShadow: VICTORIA.labelShadow,
      elements: themeColors.elements,
      mysticalGlow: themeColors.tarot?.mysticalGlow ?? VICTORIA.goldGlow,
    };
  }, [themeColors, isDark]);
}

function LegendItem({
  color,
  label,
  isHighlighted,
  onPress,
  textMuted,
}: {
  color: string;
  label: string;
  isHighlighted: boolean;
  onPress: () => void;
  textMuted: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        legendStyles.item,
        isHighlighted && {
          backgroundColor: VICTORIA.goldGlow,
          borderColor: VICTORIA.goldPrimary,
        },
      ]}
    >
      <View
        style={[
          legendStyles.dotBorder,
          isHighlighted && { borderColor: VICTORIA.goldPrimary },
        ]}
      >
        <View style={[legendStyles.dotInner, { backgroundColor: color }]} />
      </View>
      <Text
        style={[
          legendStyles.text,
          { color: textMuted },
          isHighlighted && { color: '#FFFFFF', fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
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
  const palette = useDiagramPalette();

  const [highlightedPointKey, setHighlightedPointKey] = useState<DestinyPointKey | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeCategory, setActiveCategory] = useState<LegendCategory>('element');
  const [activeFilterValue, setActiveFilterValue] = useState<string | null>(null);
  const captureTargetRef = useRef<View>(null);

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
  const canvasSize = screenWidth - HORIZONTAL_PADDING * 2;
  const contentRadius = canvasSize * 0.38; // Radius konten disesuaikan agar label usia tidak terpotong layar
  const origin = canvasSize / 2;

  const toPixel = useCallback(
    (key: string) => {
      const coords = POINT_LAYOUT[key] || { x: 0, y: 0 };
      return {
        x: origin + coords.x * contentRadius,
        y: origin + coords.y * contentRadius,
      };
    },
    [origin, contentRadius]
  );

  const pathFromKeys = useCallback(
    (keys: readonly string[], close: boolean = true): string => {
      if (!keys?.length) return '';
      const path = keys
        .map((k, i) => {
          const p = toPixel(k);
          return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
        })
        .join(' ');
      return close ? path + ' Z' : path;
    },
    [toPixel]
  );

  const paths = useMemo(
    () => ({
      personalSquare: pathFromKeys(OUTER_OUTLINE),
      ancestralSquare: pathFromKeys(ANCESTRAL_OUTLINE),
      vertical: pathFromKeys(VERTICAL_DIAGONAL, false),
      horizontal: pathFromKeys(HORIZONTAL_DIAGONAL, false),
      maleLine: pathFromKeys(MALE_GENERATION_LINE, false),
      femaleLine: pathFromKeys(FEMALE_GENERATION_LINE, false),
    }),
    [pathFromKeys]
  );

  const agePath = useMemo(() => {
    if (!ageOrder || ageOrder.length < 2) return '';
    return pathFromKeys(ageOrder as string[], false);
  }, [ageOrder, pathFromKeys]);

  const outerOctagonPath = useMemo(() => {
    return pathFromKeys(['A', 'F', 'B', 'G', 'C', 'H', 'D', 'I'], true);
  }, [pathFromKeys]);

  const allNodes = useMemo(() => {
    const result: Array<{
      key: DestinyPointKey;
      point: DestinyMatrix['points'][DestinyPointKey];
      pixel: { x: number; y: number };
      radius: number;
    }> = [];

    (Object.keys(POINT_TIERS) as TierKey[]).forEach(tierKey => {
      const tier = POINT_TIERS[tierKey];
      tier.points.forEach(key => {
        const point = matrix?.points?.[key];
        if (point) {
          result.push({
            key,
            point,
            pixel: toPixel(key),
            radius: canvasSize * tier.radius,
          });
        }
      });
    });
    return result;
  }, [matrix, canvasSize, toPixel]);

  const uniqueFilterValues = useMemo(
    () => getUniqueValuesForCategory(allNodes, activeCategory),
    [allNodes, activeCategory]
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

  // Gestures
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate(event => {
      scale.value = Math.max(0.9, Math.min(3.2, savedScale.value * event.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate(event => {
      const maxPan = (canvasSize * (scale.value - 1)) / 2;
      translateX.value = Math.max(
        -maxPan,
        Math.min(maxPan, savedTranslateX.value + event.translationX)
      );
      translateY.value = Math.max(
        -maxPan,
        Math.min(maxPan, savedTranslateY.value + event.translationY)
      );
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
    (node: (typeof allNodes)[0]) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setHighlightedPointKey(node.key);
      onPointPress?.(node.point);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightedPointKey(null), 2500);
    },
    [onPointPress]
  );

  const handleLegendPress = useCallback((value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setActiveFilterValue(prev => (prev === value ? null : value));
  }, []);

  const baseFontStyle = useMemo(
    () => ({
      fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
      fontWeight: 'bold' as const,
    }),
    []
  );

  const lovePt = toPixel('Love');
  const moneyPt = toPixel('Money');

  return (
    <View style={containerStyles.wrapper}>
      {showHeader && (
        <View style={containerStyles.header}>
          <Text style={[containerStyles.title, { color: palette.goldPrimary }]}>
            {userName || 'Peta Matriks Takdir'}
          </Text>
          {birthDate ? (
            <Text style={[containerStyles.subtitle, { color: palette.textMuted }]}>{birthDate}</Text>
          ) : null}
        </View>
      )}

      <View
        style={[
          containerStyles.canvasMask,
          { backgroundColor: palette.background, borderColor: palette.borderGold },
        ]}
      >
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
                  backgroundColor: palette.background,
                },
              ]}
            >
              <Canvas style={StyleSheet.absoluteFill}>
                {/* 1. Bingkai Oktagon Luar */}
                <Path
                  path={outerOctagonPath}
                  style="stroke"
                  strokeWidth={1.5}
                  color={palette.goldPrimary}
                >
                  <BlurMask blur={1.2} style="solid" />
                </Path>

                {/* 2. Dua Persegi (Personal & Ancestral) */}
                <Path
                  path={paths.personalSquare}
                  style="stroke"
                  strokeWidth={1.5}
                  color={palette.lineStroke}
                />
                <Path
                  path={paths.ancestralSquare}
                  style="stroke"
                  strokeWidth={1.5}
                  color={palette.lineStroke}
                />

                {/* 3. Garis Sumbu Utama */}
                <Path
                  path={paths.vertical}
                  style="stroke"
                  strokeWidth={1.1}
                  color={palette.lineStroke}
                />
                <Path
                  path={paths.horizontal}
                  style="stroke"
                  strokeWidth={1.1}
                  color={palette.lineStroke}
                />

                {/* 4. Garis Generasi Leluhur */}
                <Path
                  path={paths.maleLine}
                  style="stroke"
                  strokeWidth={1.6}
                  color={palette.maleLine}
                  strokeCap="round"
                />
                <Path
                  path={paths.femaleLine}
                  style="stroke"
                  strokeWidth={1.6}
                  color={palette.femaleLine}
                  strokeCap="round"
                />

                {/* 5. Channel Love/Money Dashed Line */}
                {lovePt && moneyPt && (
                  <Path
                    path={`M${lovePt.x},${lovePt.y} L${moneyPt.x},${moneyPt.y}`}
                    style="stroke"
                    strokeWidth={1.4}
                    color={palette.loveMoneyDash}
                  >
                    <DashPathEffect intervals={[5, 4]} />
                  </Path>
                )}

                {/* 6. Age Trajectory Path */}
                {agePath ? (
                  <Path
                    path={agePath}
                    style="stroke"
                    strokeWidth={1.5}
                    color={palette.goldPrimary}
                    strokeCap="round"
                    opacity={0.55}
                  />
                ) : null}

                {/* 7. Render Node Circles */}
                {allNodes.map(node => {
                  const isFilteredOut = activeFilterValue
                    ? !filteredNodes.some(fn => fn.key === node.key)
                    : false;
                  const baseOpacity = isFilteredOut ? 0.14 : 1;

                  let bgColors: [string, string] = palette.nodeBg;
                  if (node.key === 'E') bgColors = palette.centerNode;
                  else if (node.key === 'A' || node.key === 'B') bgColors = palette.topNode;

                  const element = node.point?.arcana?.element;
                  const strokeColor =
                    element && palette.elements
                      ? (palette.elements as Record<string, string>)[element.toLowerCase()] ||
                        palette.goldPrimary
                      : palette.goldPrimary;

                  return (
                    <Group key={`node-${node.key}`} opacity={baseOpacity}>
                      {(highlightedPointKey === node.key ||
                        (!isFilteredOut && !!activeFilterValue)) && (
                        <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius * 2.1}>
                          <LinearGradient
                            start={vec(node.pixel.x - node.radius, node.pixel.y - node.radius)}
                            end={vec(node.pixel.x + node.radius, node.pixel.y + node.radius)}
                            colors={[palette.goldGlow, 'transparent']}
                          />
                          <BlurMask blur={node.radius * 1.8} style="normal" />
                        </Circle>
                      )}

                      <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius}>
                        <LinearGradient
                          start={vec(node.pixel.x - node.radius, node.pixel.y - node.radius)}
                          end={vec(node.pixel.x + node.radius, node.pixel.y + node.radius)}
                          colors={bgColors}
                        />
                        <Shadow dx={0} dy={2} blur={3} color="rgba(0,0,0,0.55)" />
                      </Circle>

                      <Circle
                        cx={node.pixel.x}
                        cy={node.pixel.y}
                        r={node.radius}
                        style="stroke"
                        strokeWidth={1.15}
                        color={strokeColor}
                      />

                      {showSpark && (
                        <Circle
                          cx={node.pixel.x - node.radius * 0.28}
                          cy={node.pixel.y - node.radius * 0.28}
                          r={node.radius * 0.28}
                          color={palette.spark}
                        />
                      )}
                    </Group>
                  );
                })}

                {/* 8. Node Value Text */}
                {allNodes.map(node => {
                  const isFilteredOut = activeFilterValue
                    ? !filteredNodes.some(fn => fn.key === node.key)
                    : false;
                  if (isFilteredOut) return null;

                  const raw = node.point?.value;
                  //if (raw === undefined || raw === null || raw === '') return null;
                  const valStr = `${raw}${valueSuffix}`;

                  const fontSize = Math.max(9, node.radius * 0.88);
                  const font = matchFont({ ...baseFontStyle, fontSize });
                  if (!font) return null;

                  const textWidth = font.getTextWidth?.(valStr) ?? fontSize * 0.55 * valStr.length;
                  const x = node.pixel.x - textWidth / 2;
                  const y = node.pixel.y + fontSize * 0.35;

                  let txtColor = palette.valueText;
                  if (node.key === 'E') txtColor = '#1A1500';
                  else if (node.key === 'A' || node.key === 'B') txtColor = '#FFFFFF';

                  return (
                    <Group key={`skia-txt-${node.key}`}>
                      <SkiaText
                        x={x + 0.5}
                        y={y + 0.5}
                        text={valStr}
                        font={font}
                        color={palette.labelShadow}
                      />
                      <SkiaText x={x} y={y} text={valStr} font={font} color={txtColor} />
                    </Group>
                  );
                })}

                {/* 9. Timeline Age Labels (Didorong ke luar node agar tidak bertabrakan) */}
                {Object.entries(TIMELINE_AGE_LABELS).map(([key, label]) => {
                  const coords = POINT_LAYOUT[key];
                  if (!coords) return null;

                  const px = origin + coords.x * contentRadius;
                  const py = origin + coords.y * contentRadius;

                  const len = Math.hypot(coords.x, coords.y) || 1;
                  // Diberi offset pendorongan radial 18px ke luar
                  const push = 18;
                  const ox = (coords.x / len) * push;
                  const oy = (coords.y / len) * push;

                  const fontSize = 10;
                  const font = matchFont({ ...baseFontStyle, fontSize });
                  if (!font) return null;

                  const tw = font.getTextWidth?.(label) ?? label.length * 6;
                  const x = px + ox - tw / 2;
                  const y = py + oy + fontSize * 0.35;

                  return (
                    <SkiaText
                      key={`age-${key}`}
                      x={x}
                      y={y}
                      text={label}
                      font={font}
                      color={palette.goldDark}
                      opacity={0.9}
                    />
                  );
                })}

                {/* 10. Extra Labels Opsional */}
                {showExtraLabels && (
                  <Group>
                    <SkiaText
                      x={12}
                      y={26}
                      text="Kalkulasi personal"
                      font={matchFont({ ...baseFontStyle, fontSize: 12 })}
                      color={palette.goldLight}
                    />
                    <SkiaText
                      x={canvasSize - 96}
                      y={26}
                      text="Kartu kesehatan"
                      font={matchFont({ ...baseFontStyle, fontSize: 12 })}
                      color={palette.goldLight}
                    />
                  </Group>
                )}

                {extraLabels.map((label, idx) => (
                  <SkiaText
                    key={`extra-${idx}`}
                    x={label.x}
                    y={label.y}
                    text={label.text}
                    font={matchFont({ ...baseFontStyle, fontSize: label.fontSize ?? 12 })}
                    color={label.color ?? palette.textMuted}
                  />
                ))}
              </Canvas>

              {/* Touch targets */}
              {allNodes.map(node => {
                const touchSize = node.radius * 2.3;
                return (
                  <TouchableOpacity
                    key={`touch-${node.key}`}
                    activeOpacity={0.6}
                    onPress={() => handleNodePress(node)}
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

      {/* Legend & Filter Controls */}
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
                { borderColor: palette.borderGold },
                activeCategory === cat.key && {
                  backgroundColor: palette.goldGlow,
                  borderColor: palette.goldPrimary,
                },
              ]}
            >
              <Text style={[containerStyles.categoryIcon, { color: palette.goldLight }]}>
                {cat.icon}
              </Text>
              <Text
                style={[
                  containerStyles.categoryText,
                  { color: palette.textMuted },
                  activeCategory === cat.key && {
                    color: palette.goldLight,
                    fontWeight: '700',
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={containerStyles.legendItems}>
          {uniqueFilterValues.map(value => {
            let color = palette.goldPrimary;
            if (activeCategory === 'element' && palette.elements) {
              const elMap = palette.elements as Record<string, string>;
              color = elMap[value.toLowerCase()] || elMap[value] || color;
            }
            return (
              <LegendItem
                key={value}
                color={color}
                label={value}
                isHighlighted={activeFilterValue === value}
                onPress={() => handleLegendPress(value)}
                textMuted={palette.textMuted}
              />
            );
          })}
        </View>
      </View>

      <Text style={[containerStyles.hint, { color: palette.goldDark }]}>
        Tap node · Pinch & seret untuk navigasi
      </Text>

      {showCredit && (
        <Text style={[containerStyles.credit, { color: palette.borderGold }]}>
          Victoria Amothrace
        </Text>
      )}
    </View>
  );
});

DestinyDiamond.displayName = 'DestinyDiamond';

const containerStyles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', width: '100%', paddingTop: 4, paddingBottom: 8 },
  header: { alignItems: 'center', marginBottom: 8, marginTop: 4 },
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
  canvasMask: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  canvasContainer: { position: 'relative' },
  touchTarget: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  legendContainer: { marginTop: 12, width: '100%', paddingHorizontal: 8 },
  categoryScroll: { flexDirection: 'row', marginBottom: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 0.8,
  },
  categoryIcon: { fontSize: 11, marginRight: 6 },
  categoryText: { fontSize: 12 },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  hint: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  credit: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 6,
    textAlign: 'center',
  },
});

const legendStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(19, 18, 24, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 0.8,
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  dotBorder: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: { width: 5, height: 5, borderRadius: 2.5 },
  text: { fontSize: 10 },
});
  