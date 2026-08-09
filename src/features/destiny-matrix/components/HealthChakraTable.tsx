// src/features/destiny-matrix/components/HealthChakraTable.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateHealthMap } from '@core/destiny-matrix/calculator/chakra';
import type { DestinyMatrix } from '@core/destiny-matrix/types';
// Satu sumber warna chakra yang sama dipakai node coloring di DestinyDiamond
// — jangan bikin peta warna kedua di sini (pernah jadi masalah berulang).
// Sesuaikan path relatif kalau alias @components belum di-setup.
import { resolveCategoryColor } from '@components/charts/DestinyDiamond/utils/nodeColor';

interface HealthChakraTableProps {
  matrix: DestinyMatrix;
}

// Urutan spektrum standar: Muladhara(bawah) -> Sahasrara(atas)
const CHAKRA_ROWS: Array<{
  key: keyof ReturnType<typeof calculateHealthMap>['heavenLine'];
  label: string;
  description: string;
}> = [
  { key: 'sahasrara', label: 'Sahasrara', description: 'Mission' },
  { key: 'ajna', label: 'Ajna', description: 'Destiny, egregores' },
  { key: 'vishudha', label: 'Vishuddha', description: 'Destiny, egregores' },
  { key: 'anahata', label: 'Anahata', description: 'Relationships, picture' },
  { key: 'manipura', label: 'Manipura', description: 'Status, possessions' },
  { key: 'svadhisthana', label: 'Svadhisthana', description: 'Love of children, Joy' },
  { key: 'muladhara', label: 'Muladhara', description: 'Body, materia' },
];

export function HealthChakraTable({ matrix }: HealthChakraTableProps) {
  // Dihitung dari titik A-E aktual matrix — sebelumnya CHAKRA_DATA hardcode
  // statis, tidak berubah walau profil/tanggal lahir beda. Sekarang benar
  // dinamis, dan tervalidasi terhadap kalkulator resmi matricaladini.ru.
  const healthMap = useMemo(() => {
    const A = matrix.points.A?.value;
    const B = matrix.points.B?.value;
    const C = matrix.points.C?.value;
    const D = matrix.points.D?.value;
    const E = matrix.points.E?.value;
    if (
      A === undefined ||
      B === undefined ||
      C === undefined ||
      D === undefined ||
      E === undefined
    ) {
      return null;
    }
    return calculateHealthMap({ A, B, C, D, E });
  }, [matrix]);

  if (!healthMap) return null;

  const { heavenLine, earthLine, totalHealthKeys } = healthMap;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Card</Text>

      {/* Table Header — istilah resmi Ladini: Sky/Earth/Key to Health,
          bukan "Physics/Energy/Emotions" (tidak ditemukan di sumber). */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 2 }]}>Chakra</Text>
        <Text style={styles.headerCell}>Sky</Text>
        <Text style={styles.headerCell}>Earth</Text>
        <Text style={[styles.headerCell, { flex: 1.6 }]}>Key to Health</Text>
      </View>

      {/* Table Rows */}
      {CHAKRA_ROWS.map(row => {
        const sky = heavenLine[row.key];
        const earth = earthLine[row.key];
        const total = totalHealthKeys[row.key];
        const color = resolveCategoryColor('chakra', row.label, undefined, '#94A3B8');

        return (
          <View key={row.key} style={styles.row}>
            <View
              style={[styles.cell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 6 }]}
            >
              <View style={[styles.dot, { backgroundColor: color }]} />
              <View>
                <Text style={styles.chakraName}>{row.label}</Text>
                <Text style={styles.chakraDesc}>{row.description}</Text>
              </View>
            </View>
            <Text style={styles.cellText}>{sky}</Text>
            <Text style={styles.cellText}>{earth}</Text>
            <Text style={[styles.cellText, { flex: 1.6 }]}>
              {sky}, {earth}, {total}
            </Text>
          </View>
        );
      })}
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
  },
  title: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 8,
  },
  headerCell: { flex: 1, fontSize: 11, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 8,
    alignItems: 'center',
  },
  cell: { flex: 1 },
  cellText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#334155', textAlign: 'center' },
  chakraName: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  chakraDesc: { fontSize: 9, color: '#94A3B8' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
