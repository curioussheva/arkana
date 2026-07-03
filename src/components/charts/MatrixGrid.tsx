import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { EnergyMatrix } from '@core/numerology/types';

interface Props {
  matrix: EnergyMatrix;
}

export function MatrixGrid({ matrix }: Props) {
  const { energyGrid } = matrix;
  const cellSize = (Dimensions.get('window').width - SPACING.md * 2 - 16) / 9;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {energyGrid.cells.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  { 
                    width: cellSize, 
                    height: cellSize,
                    backgroundColor: cell.color,
                    opacity: 0.3 + cell.intensity * 0.7,
                  },
                ]}
              >
                <Text style={styles.cellText}>{cell.value}</Text>
              </View>
            ))}
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
  container: { alignItems: 'center' },
  grid: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  cell: { justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.border },
  cellText: { fontSize: FONT_SIZE.xs, color: COLORS.text, fontWeight: '600' },
  summary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: SPACING.md, width: '100%' },
  summaryText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginVertical: SPACING.xs },
});
