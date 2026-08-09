import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DestinyMatrix } from '@core/destiny-matrix/types';

interface LineAncestryCardProps {
  matrix: DestinyMatrix;
}

export function LineAncestryCard({ matrix }: LineAncestryCardProps) {
  // Nilai jalur silsilah pria & wanita berdasarkan kalkulasi takdir
  const malePoints = [
    matrix?.points?.J?.value ?? 0,
    matrix?.points?.K?.value ?? 0,
    matrix?.points?.L?.value ?? 0,
  ];

  const femalePoints = [
    matrix?.points?.M?.value ?? 0,
    matrix?.points?.N?.value ?? 0,
    matrix?.points?.O?.value ?? 0,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ancestry Lines (Garis Keturunan)</Text>

      {/* Male Line */}
      <View style={styles.lineRow}>
        <View style={styles.labelContainer}>
          <View style={[styles.indicator, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.lineLabel}>Male Generation Line</Text>
        </View>
        <View style={styles.badgeRow}>
          {malePoints.map((val, idx) => (
            <View key={`male-${idx}`} style={styles.badge}>
              <Text style={styles.badgeText}>{val === 0 ? 22 : val}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Female Line */}
      <View style={styles.lineRow}>
        <View style={styles.labelContainer}>
          <View style={[styles.indicator, { backgroundColor: '#EC4899' }]} />
          <Text style={styles.lineLabel}>Female Generation Line</Text>
        </View>
        <View style={styles.badgeRow}>
          {femalePoints.map((val, idx) => (
            <View key={`female-${idx}`} style={styles.badge}>
              <Text style={styles.badgeText}>{val === 0 ? 22 : val}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  title: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  labelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  indicator: { width: 10, height: 10, borderRadius: 5 },
  lineLabel: { fontSize: 12, fontWeight: '600', color: '#334155' },
  badgeRow: { flexDirection: 'row', gap: 6 },
  badge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
});
