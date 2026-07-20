// Berkas: src/features/insight/components/features/DestinyAnchorGridCard.tsx

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { ArcanaDefinition } from '@core/arcana/types';

interface MatrixPoint {
  key: string;            // Contoh: 'A', 'B', 'J', 'Q' (Position Key Asli dari Engine)
  label: string;          // Contoh: 'Hari Lahir', 'Titik Pusat'
  arcana: ArcanaDefinition; 
  interpretation: string;
}

// Tambahkan tipe data hasil normalisasi untuk mengusir warning 'any'
interface NormalizedMatrixPoint extends MatrixPoint {
  spatialKey: string;
}

interface Props {
  points?: MatrixPoint[];
  onPress?: () => void;
}

// 🎯 SINKRONISASI PETA KOMPAS SEJATI: Menyelaraskan translasi alfabet mesin ke kode spasial
const GEOMETRIC_KEY_MAP: Record<string, string> = {
  'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E',
  'J': 'A2', 'K': 'B2', 'L': 'C2', 'M': 'D2',
  'I': 'A3', 'F': 'B3', 'G': 'C3', 'H': 'D3',
  'Q': 'A1', 'R': 'B1', 'S': 'C1', 'T': 'D1',
  'N': 'N',  'O': 'O',  'P': 'P',
  'A1': 'A1', 'A2': 'A2', 'A3': 'A3',
  'B1': 'B1', 'B2': 'B2', 'B3': 'B3',
  'C1': 'C1', 'C2': 'C2', 'C3': 'C3',
  'D1': 'D1', 'D2': 'D2', 'D3': 'D3',
};

export function DestinyAnchorGridCard({ points, onPress }: Props) {
  const colors = useThemeStore((state) => state.getColors());
  
  // 🎯 NORMALISASI DATA DATA SEBELUM DI-FIND: Translasikan key mentah ke spatialKey
  const normalizedPoints = useMemo((): NormalizedMatrixPoint[] => {
    if (!points) return [];
    return points.map(p => ({
      ...p,
      spatialKey: GEOMETRIC_KEY_MAP[p.key] || p.key
    }));
  }, [points]);

  const nodeA = normalizedPoints.find(p => p.spatialKey === 'A'); // Mental / Karakter
  const nodeB = normalizedPoints.find(p => p.spatialKey === 'B'); // Spiritual / Proteksi
  const nodeE = normalizedPoints.find(p => p.spatialKey === 'E'); // Pusat Jiwa / Zona Nyaman
  const nodeC = normalizedPoints.find(p => p.spatialKey === 'C'); // Material / Finansial
  const nodeD = normalizedPoints.find(p => p.spatialKey === 'D'); // Karma Masa Lalu

  const hasData = !!(nodeA || nodeB || nodeE || nodeC || nodeD);

  // Helper untuk merender baris jangkar takdir dengan tipe data strict
  const renderAnchorRow = (node?: NormalizedMatrixPoint, badgeColor?: string) => {
    if (!node) return null;

    // 🔮 INTERSEPTOR VISUAL: Paksa 0 menjadi 22 (The Fool) agar seirama dengan grafik visual & detail modal
    const displayId = node.arcana?.id === 0 ? 22 : node.arcana?.id;

    return (
      <View style={styles.anchorRow}>
        {/* 1. POSITION: Koordinat Geometris Hasil Translasi Bersih (A, B, E) */}
        <View style={[styles.positionBadge, { backgroundColor: badgeColor || colors.backgroundLight }]}>
          <Text style={[styles.positionKey, { color: colors.text }]}>{node.spatialKey}</Text>
        </View>

        {/* 2. IMPORTANT POINT: Peran & Fungsi dalam Hidup */}
        <View style={styles.pointInfo}>
          <Text style={[styles.pointLabel, { color: colors.text }]} numberOfLines={1}>
            {node.label}
          </Text>
          <Text style={[styles.arcanaName, { color: colors.textSecondary }]} numberOfLines={1}>
            Arkana {displayId} - {node.arcana?.matrixName || node.arcana?.tarotName || 'Getaran Kosmik'}
          </Text>
        </View>

        {/* 3. SEQUENCE VALUE: Skor Energi Kanan */}
        <View style={[styles.valueBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.valueText, { color: colors.primary }]}>{displayId ?? '—'}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {/* Header Utama Modul */}
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={styles.icon}>🧭</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
          <Text style={[styles.tagText, { color: colors.primary }]}>ALUR MATRIKS TAKDIR</Text>
        </View>
      </View>

      {/* Judul & Penjelasan Alur */}
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.text }]}>Peta Jalan Hidup & Transformasi</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sinergi 5 Titik Simpul Utama Peta Matriks Takdir
        </Text>
      </View>

      {hasData ? (
        <View style={styles.listContainer}>
          {renderAnchorRow(nodeA, 'rgba(6, 182, 212, 0.15)')}
          <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
          
          {renderAnchorRow(nodeB, 'rgba(249, 115, 22, 0.15)')}
          <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
          
          {renderAnchorRow(nodeE, 'rgba(236, 72, 153, 0.18)')}
          <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
          
          {renderAnchorRow(nodeC, 'rgba(16, 185, 129, 0.15)')}
          <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
          
          {renderAnchorRow(nodeD, 'rgba(132, 204, 22, 0.15)')}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Menunggu penyelarasan data geometri...
          </Text>
        </View>
      )}

      {/* Aksi Eksplorasi Lebih Dalam */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.actionPrompt, { color: colors.primary }]}>
          Buka Peta Jalan Hidup & Transformasi Selengkapnya →
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: SPACING.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 18 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.md },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  titleBlock: { marginTop: SPACING.sm, marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.lg, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  listContainer: { paddingVertical: SPACING.xs },
  anchorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  positionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionKey: { fontSize: FONT_SIZE.xs, fontWeight: '800' },
  pointInfo: { flex: 1, marginHorizontal: SPACING.sm, justifyContent: 'center' },
  pointLabel: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  arcanaName: { fontSize: 11, marginTop: 1 },
  valueBadge: {
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  connectorLine: {
    width: 2,
    height: 12,
    marginLeft: 13,
    opacity: 0.5,
  },
  emptyState: { paddingVertical: SPACING.xl, alignItems: 'center' },
  emptyText: { fontSize: FONT_SIZE.xs, fontStyle: 'italic' },
  footer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 0.5,
  },
  actionPrompt: { fontSize: 12, fontWeight: '700', textAlign: 'right' },
});
 