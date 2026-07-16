import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnergyLines } from './EnergyLines';

interface MatrixCanvasProps {
  primaryPoints: { A: number; B: number; C: number; D: number; E: number } | undefined;
  colors: any;
}

export function MatrixCanvas({ primaryPoints, colors }: MatrixCanvasProps) {
  const CANVAS_SIZE = 280;
  
  if (!primaryPoints) return null;

  return (
    <View style={styles.canvasContainer}>
      <View style={[styles.diamondFrame, { width: CANVAS_SIZE, height: CANVAS_SIZE, borderColor: colors.primary }]}>
        
        {/* Garis Jembatan Energi Internal */}
        <EnergyLines size={CANVAS_SIZE} colors={colors} />

        {/* Titik A (Atas - Jiwa Spirit) */}
        <View style={[styles.node, styles.topNode, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.nodeText, { color: colors.text }]}>{primaryPoints.A}</Text>
        </View>

        {/* Titik B (Kanan - Finansial) */}
        <View style={[styles.node, styles.rightNode, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.nodeText, { color: colors.text }]}>{primaryPoints.B}</Text>
        </View>

        {/* Titik C (Bawah - Karma) */}
        <View style={[styles.node, styles.bottomNode, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.nodeText, { color: colors.text }]}>{primaryPoints.C}</Text>
        </View>

        {/* Titik D (Kiri - Leluhur) */}
        <View style={[styles.node, styles.leftNode, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.nodeText, { color: colors.text }]}>{primaryPoints.D}</Text>
        </View>

        {/* Titik E (Pusat - Zona Kenyamanan Jiwa) */}
        <View style={[styles.centerNode, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <Text style={styles.centerNodeText}>{primaryPoints.E}</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: { alignItems: 'center', marginVertical: 24, justifyContent: 'center' },
  diamondFrame: { transform: [{ rotate: '45deg' }], borderWidth: 2, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  node: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '-45deg' }] },
  topNode: { top: -18, left: '50%', marginLeft: -18 },
  rightNode: { right: -18, top: '50%', marginTop: -18 },
  bottomNode: { bottom: -18, left: '50%', marginLeft: -18 },
  leftNode: { left: -18, top: '50%', marginTop: -18 },
  centerNode: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-45deg' }], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  centerNodeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  nodeText: { fontWeight: '700', fontSize: 13 },
});
