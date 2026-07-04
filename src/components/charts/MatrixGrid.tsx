import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Circle, Group, BlurMask } from '@shopify/react-native-skia';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { EnergyMatrix } from '@core/numerology/types';

interface Props {
  matrix: EnergyMatrix;
}

/**
 * Converts an "hsl(h, s%, l%)" string (as produced by engine.ts) into an
 * "rgba(r,g,b,a)" string, so Skia can modulate alpha independently for
 * the glow layer vs. the sharp core layer.
 */
function hslToRgba(hsl: string, alpha: number): string {
  const match = hsl.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
  if (!match) return `rgba(255,255,255,${alpha})`;

  const h = parseFloat(match[1]) / 360;
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return `rgba(${v},${v},${v},${alpha})`;
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return `rgba(${r},${g},${b},${alpha})`;
}

export function MatrixGrid({ matrix }: Props) {
  const { energyGrid } = matrix;
  const gridSize = energyGrid.dimensions[0];
  const canvasSize = Dimensions.get('window').width - SPACING.md * 2 - 16;
  const cellSize = canvasSize / gridSize;

  // Precompute per-cell glow geometry/color once per matrix, rather than
  // recalculating on every re-render.
  const glowCells = useMemo(() => {
    return energyGrid.cells.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const cx = colIndex * cellSize + cellSize / 2;
        const cy = rowIndex * cellSize + cellSize / 2;
        const coreRadius = (cellSize / 2) * (0.25 + cell.intensity * 0.35);
        const glowRadius = (cellSize / 2) * (0.5 + cell.intensity * 0.5);

        return {
          key: `${rowIndex}-${colIndex}`,
          cx,
          cy,
          coreRadius,
          glowRadius,
          glowColor: hslToRgba(cell.color, 0.55 + cell.intensity * 0.35),
          coreColor: hslToRgba(cell.color, 0.9),
          blurAmount: 4 + cell.intensity * 10,
          value: cell.value,
        };
      })
    );
  }, [energyGrid, cellSize]);

  return (
    <View style={styles.container}>
      <View style={[styles.gridWrap, { width: canvasSize, height: canvasSize }]}>
        <Canvas style={StyleSheet.absoluteFill}>
          {glowCells.map((c) => (
            <Group key={c.key}>
              {/* Outer glow (bloom) */}
              <Circle cx={c.cx} cy={c.cy} r={c.glowRadius} color={c.glowColor}>
                <BlurMask blur={c.blurAmount} style="normal" />
              </Circle>
              {/* Sharp core */}
              <Circle cx={c.cx} cy={c.cy} r={c.coreRadius} color={c.coreColor} />
            </Group>
          ))}
        </Canvas>

        {/* Value labels overlaid on the canvas. Skia <Text> needs manually
            loaded font data, so plain RN Text stays simpler and sharper
            at this small a size. */}
        {glowCells.map((c) => (
          <View
            key={`label-${c.key}`}
            pointerEvents="none"
            style={[
              styles.labelWrap,
              { left: c.cx - cellSize / 2, top: c.cy - cellSize / 2, width: cellSize, height: cellSize },
            ]}
          >
            <Text style={styles.cellText}>{c.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Dominant: {energyGrid.summary.dominantNumber}</Text>
        <Text style={styles.summaryText}>Weakest: {energyGrid.summary.weakestNumber}</Text>
        <Text style={styles.summaryText}>Balance: {Math.round(energyGrid.summary.balance * 100)}%</Text>
        <Text style={styles.summaryText}>Intensity: {Math.round(energyGrid.summary.intensity * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  gridWrap: {
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
  cellText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
    width: '100%',
  },
  summaryText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginVertical: SPACING.xs,
  },
});
 