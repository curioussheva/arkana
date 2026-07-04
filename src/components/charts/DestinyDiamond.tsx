import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Path, Circle, Group, BlurMask } from '@shopify/react-native-skia';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import {
  POINT_LAYOUT,
  OUTER_OUTLINE,
  VERTICAL_DIAGONAL,
  HORIZONTAL_DIAGONAL,
} from '@core/destiny-matrix/layout';
import type { DestinyMatrix, DestinyPointKey } from '@core/destiny-matrix/types';
import type { ArkanaInfo } from '@core/numerology/types';

interface Props {
  matrix: DestinyMatrix;
}

const PRIMARY_POINTS: DestinyPointKey[] = ['A', 'B', 'C', 'D', 'E'];
const SECONDARY_POINTS: DestinyPointKey[] = ['F', 'G', 'H', 'I'];

function elementColor(element: ArkanaInfo['element']): string {
  switch (element) {
    case 'Fire':
      return COLORS.fire;
    case 'Water':
      return COLORS.water;
    case 'Air':
      return COLORS.air;
    case 'Earth':
      return COLORS.earth;
    default:
      return COLORS.primary;
  }
}

function pathFromKeys(
  keys: DestinyPointKey[],
  toPixel: (key: DestinyPointKey) => { x: number; y: number }
): string {
  return keys
    .map((key, i) => {
      const p = toPixel(key);
      return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
    })
    .join(' ');
}

export function DestinyDiamond({ matrix }: Props) {
  const canvasSize = Dimensions.get('window').width - SPACING.md * 2 - 16;
  const contentRadius = canvasSize * 0.42; // leaves margin for node circles + labels
  const origin = canvasSize / 2;

  const toPixel = (key: DestinyPointKey) => {
    const { x, y } = POINT_LAYOUT[key];
    return {
      x: origin + x * contentRadius,
      y: origin + y * contentRadius,
    };
  };

  const nodes = useMemo(() => {
    return (Object.keys(POINT_LAYOUT) as DestinyPointKey[]).map((key) => {
      const point = matrix.points[key];
      const pixel = toPixel(key);
      const isPrimary = PRIMARY_POINTS.includes(key);
      const isSecondary = SECONDARY_POINTS.includes(key);
      const radius = isPrimary
        ? canvasSize * 0.052
        : isSecondary
          ? canvasSize * 0.04
          : canvasSize * 0.032;
      const color = elementColor(point.arcana.element);

      return { key, point, pixel, radius, color };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrix, canvasSize]);

  const outlinePath = useMemo(() => pathFromKeys(OUTER_OUTLINE, toPixel), [canvasSize]);
  const verticalPath = useMemo(() => pathFromKeys(VERTICAL_DIAGONAL, toPixel), [canvasSize]);
  const horizontalPath = useMemo(() => pathFromKeys(HORIZONTAL_DIAGONAL, toPixel), [canvasSize]);

  return (
    <View style={styles.container}>
      <View style={[styles.canvasWrap, { width: canvasSize, height: canvasSize }]}>
        <Canvas style={StyleSheet.absoluteFill}>
          {/* Connecting lines */}
          <Path path={outlinePath} style="stroke" strokeWidth={2} color={COLORS.border} />
          <Path path={verticalPath} style="stroke" strokeWidth={1.5} color={COLORS.borderLight} />
          <Path path={horizontalPath} style="stroke" strokeWidth={1.5} color={COLORS.borderLight} />

          {/* Nodes with soft glow */}
          {nodes.map((node) => (
            <Group key={node.key}>
              <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius * 1.6} color={`${node.color}55`}>
                <BlurMask blur={node.radius * 0.6} style="normal" />
              </Circle>
              <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius} color={node.color} />
            </Group>
          ))}
        </Canvas>

        {/* Labels overlaid on the canvas */}
        {nodes.map((node) => (
          <View
            key={`label-${node.key}`}
            pointerEvents="none"
            style={[
              styles.labelWrap,
              { left: node.pixel.x - 18, top: node.pixel.y - 18, width: 36, height: 36 },
            ]}
          >
            <Text style={styles.keyText}>{node.key}</Text>
            <Text style={styles.valueText}>{node.point.value}</Text>
          </View>
        ))}
      </View>

      {/* Element legend */}
      <View style={styles.legend}>
        <LegendItem color={COLORS.fire} label="Fire" />
        <LegendItem color={COLORS.water} label="Water" />
        <LegendItem color={COLORS.air} label="Air" />
        <LegendItem color={COLORS.earth} label="Earth" />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  canvasWrap: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  labelWrap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.text,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 1 },
  },
  valueText: {
    fontSize: 9,
    color: COLORS.text,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 1 },
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});
