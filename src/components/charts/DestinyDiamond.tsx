// src/components/charts/DestinyDiamond.tsx
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import {
  Canvas,
  Path,
  Circle,
  Group,
  BlurMask,
  LinearGradient,
  vec,
  Shadow,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import {
  POINT_LAYOUT,
  OUTER_OUTLINE,
  VERTICAL_DIAGONAL,
  HORIZONTAL_DIAGONAL,
} from '@core/destiny-matrix/layout';
import type { DestinyMatrix, DestinyPointKey } from '@core/destiny-matrix/types';
import type { ArcanaDefinition } from '@core/arcana/types';
import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';
import type { ElementType } from '@components/ui/ArkanaCard/types';

// ─── Types ───────────────────────────────────────────
interface Props {
  matrix: DestinyMatrix;
  onPointPress?: (point: DestinyMatrix['points'][DestinyPointKey]) => void;
}

export interface DestinyDiamondHandle {
  exportAsImage: () => Promise<string>;
}

type ThemeColors = ReturnType<
  ReturnType<typeof useThemeStore.getState>['getColors']
>;

// ─── Point Tiers ─────────────────────────────────────
const PRIMARY_POINTS: DestinyPointKey[] = ['A', 'B', 'C', 'D', 'E'];
const SECONDARY_POINTS: DestinyPointKey[] = ['F', 'G', 'H', 'I'];
const TERTIARY_POINTS: DestinyPointKey[] = ['J', 'K', 'L', 'M'];
const OUTER_POINTS: DestinyPointKey[] = ['N', 'O', 'P', 'Q', 'R', 'S', 'T'];

const POINT_TIERS = {
  primary: { points: PRIMARY_POINTS, radius: 0.052, glowMultiplier: 1.8 },
  secondary: { points: SECONDARY_POINTS, radius: 0.04, glowMultiplier: 1.6 },
  tertiary: { points: TERTIARY_POINTS, radius: 0.032, glowMultiplier: 1.4 },
  outer: { points: OUTER_POINTS, radius: 0.026, glowMultiplier: 1.2 },
} as const;

// ─── Helper Functions ────────────────────────────────
function getElementColor(
  element: ArcanaDefinition['element'],
  colors: ThemeColors,
): string {
  const style = ELEMENT_STYLES[element as ElementType];
  return style?.color ?? colors.primary;
}

function getElementGradient(
  element: ArcanaDefinition['element'],
  colors: ThemeColors,
): [string,string] {
  const style = ELEMENT_STYLES[element as ElementType];
  return style?.gradient ?? [
    colors.primary,
    colors.primaryDark,
  ];
}

function pathFromKeys(
  keys: DestinyPointKey[],
  toPixel: (key: DestinyPointKey) => { x: number; y: number }
): string {
  if (!keys.length) return '';
  return keys
    .map((key, i) => {
      const p = toPixel(key);
      return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
    })
    .join(' ') + ' Z';
}

// ─── Animated Node Component ─────────────────────────
interface AnimatedNodeProps {
  pixel: { x: number; y: number };
  radius: number;
  color: string;
  gradient: [string, string];
  isHighlighted: boolean;
}

function AnimatedNode({
  pixel,
  radius,
  color,
  gradient,
  isHighlighted,
}: AnimatedNodeProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);
  
  React.useEffect(() => {
    if (isHighlighted) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.6, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withSpring(1);
      opacity.value = withTiming(0.8);
    }
  }, [isHighlighted, scale, opacity]);
  
  return (
    <Group>
      {/* Outer glow */}
      <Circle
        cx={pixel.x}
        cy={pixel.y}
        r={radius * 2}
        opacity={opacity}
      >
        <LinearGradient
          start={vec(pixel.x - radius, pixel.y - radius)}
          end={vec(pixel.x + radius, pixel.y + radius)}
          colors={[color + '40', 'transparent']}
        />
        <BlurMask blur={radius * 1.5} style="normal" />
      </Circle>
      
      {/* Main node circle */}
      <Circle
        cx={pixel.x}
        cy={pixel.y}
        r={radius}
      >
        <LinearGradient
          start={vec(pixel.x - radius, pixel.y - radius)}
          end={vec(pixel.x + radius, pixel.y + radius)}
          colors={gradient}
        />
        <Shadow dx={0} dy={2} blur={4} color="rgba(0,0,0,0.5)" />
      </Circle>
      
      {/* Inner highlight */}
      <Circle
        cx={pixel.x - radius * 0.2}
        cy={pixel.y - radius * 0.2}
        r={radius * 0.4}
        color="rgba(255,255,255,0.3)"
      />
    </Group>
  );
}

// ─── Legend Component ────────────────────────────────
function LegendItem({ color, label, icon }: { color: string; label: string; icon: string }) {
  return (
    <View style={legendStyles.item}>
      <View style={[legendStyles.dot, { backgroundColor: color }]}>
        <View style={legendStyles.dotInner} />
      </View>
      <Text style={legendStyles.icon}>{icon}</Text>
      <Text style={legendStyles.text}>{label}</Text>
    </View>
  );
}

// ─── Main Component ──────────────────────────────────
export const DestinyDiamond = forwardRef<DestinyDiamondHandle, Props>(
  function DestinyDiamond({ matrix, onPointPress }, ref) {
    const { width: screenWidth } = useWindowDimensions();
    const colors = useThemeStore(state => state.getColors());
    
    // State
    const [highlightedPoint, setHighlightedPoint] = useState<DestinyPointKey | null>(null);
    
    // Refs
    const captureTargetRef = useRef<View>(null);
    
    // Export functionality
    useImperativeHandle(ref, () => ({
      exportAsImage: async () => {
        if (!captureTargetRef.current) {
          throw new Error('Diagram belum siap untuk diekspor');
        }
        return captureRef(captureTargetRef, {
          format: 'png',
          quality: 1,
        });
      },
    }));
    
    // Canvas dimensions
    const canvasSize = screenWidth - SPACING.md * 2 - 16;
    const contentRadius = canvasSize * 0.33;
    const origin = canvasSize / 2;
    
    // Coordinate transformation
    const toPixel = useCallback(
      (key: DestinyPointKey) => {
        const { x, y } = POINT_LAYOUT[key];
        return {
          x: origin + x * contentRadius,
          y: origin + y * contentRadius,
        };
      },
      [origin, contentRadius]
    );
    
    // Memoized paths
    const paths = useMemo(() => ({
      outline: pathFromKeys(OUTER_OUTLINE, toPixel),
      vertical: pathFromKeys(VERTICAL_DIAGONAL, toPixel),
      horizontal: pathFromKeys(HORIZONTAL_DIAGONAL, toPixel),
    }), [toPixel]);
    
    // Memoized nodes
    const nodes = useMemo(() => {
      const allNodes: Array<{
        key: DestinyPointKey;
        point: DestinyMatrix['points'][DestinyPointKey];
        pixel: { x: number; y: number };
        radius: number;
        tier: keyof typeof POINT_TIERS;
      }> = [];
      
      Object.entries(POINT_TIERS).forEach(([tierName, tierConfig]) => {
        tierConfig.points.forEach((key) => {
          const point = matrix.points[key];
          if (!point) return;
          
          allNodes.push({
            key,
            point,
            pixel: toPixel(key),
            radius: canvasSize * tierConfig.radius,
            tier: tierName as keyof typeof POINT_TIERS,
          });
        });
      });
      
      return allNodes;
    }, [matrix, canvasSize, toPixel]);
    
    // Handle node press
    const handleNodePress = useCallback(
      (node: typeof nodes[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setHighlightedPoint(node.key);
        onPointPress?.(node.point);
        
        setTimeout(() => setHighlightedPoint(null), 2000);
      },
      [onPointPress]
    );
    
    // Background pattern path
    const backgroundCircle = useMemo(() => {
      const r = contentRadius * 1.1;
      return `M${origin - r},${origin} A${r},${r} 0 1,1 ${origin + r},${origin} A${r},${r} 0 1,1 ${origin - r},${origin} Z`;
    }, [origin, contentRadius]);
    
    return (
      <View style={containerStyles.wrapper}>
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
            {/* Background circle */}
            <Path
              path={backgroundCircle}
              style="fill"
              color={colors.primary + '05'}
            />
            
            {/* Connecting lines */}
            <Group>
              <Path
                path={paths.outline}
                style="stroke"
                strokeWidth={2}
                color={colors.border}
                strokeCap="round"
                strokeJoin="round"
              >
                <BlurMask blur={1} style="normal" />
              </Path>
              
              <Path
                path={paths.vertical}
                style="stroke"
                strokeWidth={1.5}
                color={colors.borderLight + '80'}
                strokeCap="round"
              />
              
              <Path
                path={paths.horizontal}
                style="stroke"
                strokeWidth={1.5}
                color={colors.borderLight + '80'}
                strokeCap="round"
              />
            </Group>
            
            {/* Decorative elements */}
            <Group opacity={0.3}>
              {[0, 90, 180, 270].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = contentRadius * 1.15;
                const x = origin + r * Math.cos(rad);
                const y = origin + r * Math.sin(rad);
                return (
                  <Circle
                    key={`star-${i}`}
                    cx={x}
                    cy={y}
                    r={3}
                    color={colors.primary}
                  />
                );
              })}
            </Group>
            
            {/* Render nodes */}
            {nodes.map((node) => {
              const elementColor = getElementColor(node.point.arcana.element, colors);
              const elementGradient = getElementGradient(node.point.arcana.element, colors);
              
              return (
                <AnimatedNode
                  key={node.key}
                  pixel={node.pixel}
                  radius={node.radius}
                  color={elementColor}
                  gradient={elementGradient}
                  isHighlighted={highlightedPoint === node.key}
                />
              );
            })}
          </Canvas>
          
          {/* Touch targets overlay */}
          {nodes.map((node) => (
            <TouchableOpacity
              key={`touch-${node.key}`}
              activeOpacity={0.6}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => handleNodePress(node)}
              onLongPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setHighlightedPoint(node.key);
                onPointPress?.(node.point);
              }}
              style={[
                containerStyles.touchTarget,
                {
                  left: node.pixel.x - 20,
                  top: node.pixel.y - 20,
                  width: 40,
                  height: 40,
                },
              ]}
            >
              <Text style={[containerStyles.labelKey, { color: colors.text }]}>
                {node.key}
              </Text>
              <Text style={[containerStyles.labelValue, { color: colors.text }]}>
                {node.point.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Element Legend */}
        <View style={containerStyles.legend}>
          {Object.entries(ELEMENT_STYLES).map(([element, style]) => (
            <LegendItem
              key={element}
              color={style.color}
              label={element}
              icon={style.icon}
            />
          ))}
        </View>
        
        <Text style={[containerStyles.hint, { color: colors.textMuted }]}>
          💡 Tap node untuk detail • Long press untuk highlight
        </Text>
      </View>
    );
  }
);

DestinyDiamond.displayName = 'DestinyDiamond';

// ─── Styles ──────────────────────────────────────────
const SPACING = {
  md: 16,
};

const BORDER_RADIUS = {
  md: 8,
};

const containerStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  canvasContainer: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  touchTarget: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelKey: {
    fontSize: 10,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  labelValue: {
    fontSize: 8,
    fontWeight: '600',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  hint: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

const legendStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  dotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  icon: {
    fontSize: 14,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
});
 