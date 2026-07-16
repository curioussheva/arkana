// src/components/charts/ArcanaWheel.tsx

import React, { Fragment, useMemo, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Canvas,
  Circle,
  Path,
  BlurMask,
} from '@shopify/react-native-skia';

import { useThemeStore } from '@store/theme-store';
import type { DestinyPointKey } from '@core/destiny-matrix/types';
import type { DetailablePoint } from '@components/ui/PointDetailModal';
import type { ArcanaDefinition, ArcanaElement } from '@core/arcana/types';
import type { AssessmentState } from '@core/assessment/assessmentEngine';

interface ArcanaWheelProps {
  // 💡 Mengizinkan fleksibilitas: Bisa menerima DestinyMatrix utuh ATAU EvolutionPointsInput murni
  matrix?: any;
  arcanaSequence?: ArcanaDefinition[];
  onPointPress?: (point: DetailablePoint) => void;
  // 🔄 REFACTOR: Satu sumber kebenaran menggantikan isStuck + highlightIndex terpisah.
  // null/undefined berarti mode Insight biasa (semua node terbuka, tanpa lock/highlight).
  assessmentState?: AssessmentState | null;
}

const ELEMENT_COLORS: Record<ArcanaElement, string> = {
  Fire: '#FF6B35',
  Water: '#4ECDC4',
  Air: '#FFE66D',
  Earth: '#6B8E23',
};

const EVOLUTION_ORDER: DestinyPointKey[] = ['D', 'B', 'A', 'E', 'C'];

/**
 * 🔄 Tabel derivasi terpusat untuk setiap state assessment.
 * Index EVOLUTION_ORDER: D=0, B=1, A=2, E=3, C=4
 *
 * lockedFromIndex: node dengan index >= nilai ini akan dikunci (redup + tidak bisa diklik)
 * highlightIndex: node yang mendapat efek glow/highlight sebagai "posisi kamu saat ini"
 * color: warna jalur & indikator teks (kosong string = pakai warna primer tema)
 */
const STATE_CONFIG: Record<
  AssessmentState,
  { lockedFromIndex: number; highlightIndex: number; color: string; label: string }
> = {
  NEGATIF: {
    lockedFromIndex: 3,
    highlightIndex: 2,
    color: '#FF3B30',
    label: '⚠️ Siklus Terhambat di Titik A!',
  },
  NETRAL: {
    lockedFromIndex: 4,
    highlightIndex: 3,
    color: '#FFB020',
    label: '🌗 Transisi: Titik E Terbuka, C Menunggu',
  },
  POSITIF: {
    lockedFromIndex: 5, // >= panjang nodes, jadi tidak ada yang terkunci
    highlightIndex: 4,
    color: '',
    label: '✨ Alur Evolusi Jiwa: D ➔ B ➔ A ➔ E ➔ C',
  },
};

export const ArcanaWheel = forwardRef<any, ArcanaWheelProps>(
  function ArcanaWheel(
    { matrix, arcanaSequence, onPointPress, assessmentState = null }: ArcanaWheelProps,
    ref
  ) {
    const { width } = useWindowDimensions();
    const colors = useThemeStore((s) => s.getColors());

    const size = Math.min(width - 64, 320);
    const center = size / 2;
    const radius = size / 2.6;

    useImperativeHandle(ref, () => ({
      exportAsImage: async () => null,
    }));

    // Cek apakah data bertipe Matrix Struktur Data
    const isMatrixMode = useMemo(() => !!(matrix && (matrix.points || matrix.D)), [matrix]);

    // Konfigurasi state assessment (null jika belum ada / mode Insight biasa)
    const config = useMemo(
      () => (assessmentState ? STATE_CONFIG[assessmentState] : null),
      [assessmentState]
    );

    // 1. Ekstraksi koordinat & data node secara seragam
    const nodes = useMemo(() => {
      if (isMatrixMode && matrix) {
        const pointsSource = matrix.points ? matrix.points : matrix;

        return EVOLUTION_ORDER.map((key, index) => {
          const rawPoint = pointsSource[key];
          if (!rawPoint) return null;

          const arcana: ArcanaDefinition | undefined = rawPoint.arcana ? rawPoint.arcana : rawPoint;
          const label = rawPoint.value !== undefined ? rawPoint.value.toString() : (arcana?.id?.toString() ?? '0');

          let x = center;
          let y = center;

          if (key === 'E') {
            x = center;
            y = center;
          } else {
            const angle = (index / (EVOLUTION_ORDER.length - 1)) * Math.PI * 2 - Math.PI / 2;
            x = center + radius * Math.cos(angle);
            y = center + radius * Math.sin(angle);
          }

          return {
            point: rawPoint.arcana ? rawPoint : { value: arcana?.id, arcana },
            key: `matrix-${key}`,
            label,
            element: arcana?.element || 'Earth',
            x,
            y,
            showKeyLetter: key,
          };
        }).filter((n): n is NonNullable<typeof n> => n !== null);
      }

      if (arcanaSequence) {
        return arcanaSequence.map((arcana, index) => {
          if (!arcana) return null;
          const angle = (index / arcanaSequence.length) * Math.PI * 2 - Math.PI / 2;
          const safeId = typeof arcana.id === 'number' ? arcana.id : index;

          return {
            point: { value: safeId, arcana } as any,
            key: `seq-${safeId}-${index}`,
            label: safeId.toString(),
            element: arcana.element || 'Earth',
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
            showKeyLetter: '',
          };
        }).filter((n): n is NonNullable<typeof n> => n !== null);
      }

      return [];
    }, [matrix, arcanaSequence, center, radius, isMatrixMode]);

    // 2. Logika Pemotongan Garis Jalan Tol Energi (berdasarkan config.lockedFromIndex)
    const dynamicPath = useMemo(() => {
      if (nodes.length < 2) return '';

      const allowedNodesCount = isMatrixMode && config ? config.lockedFromIndex : nodes.length;

      let path = `M${nodes[0].x},${nodes[0].y}`;
      for (let i = 1; i < Math.min(allowedNodesCount, nodes.length); i++) {
        path += ` L${nodes[i].x},${nodes[i].y}`;
      }

      if (!isMatrixMode) {
        path += ' Z'; // Tutup cincin melingkar untuk Tab Insight urutan 8 kartu
      }
      return path;
    }, [nodes, isMatrixMode, config]);

    // 3. Warna Jalur Dinamis berdasarkan Kondisi Energi
    const dynamicLineColor = useMemo(() => {
      if (isMatrixMode && config?.color) {
        return config.color;
      }
      return colors.primary + '80';
    }, [isMatrixMode, config, colors.primary]);

    const highlightIndex = config?.highlightIndex ?? -1;

    return (
      <View style={[styles.container, { backgroundColor: colors.backgroundLight + '40', borderColor: colors.border }]}>
        {isMatrixMode && config && (
          <Text style={[styles.flowIndicator, { color: config.color || colors.textSecondary }]}>
            {config.label}
          </Text>
        )}

        <Canvas style={{ width: size, height: size }}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            style="stroke"
            strokeWidth={1}
            color={colors.border + '30'}
          />

          {!!dynamicPath && (
            <Path
              path={dynamicPath}
              style="stroke"
              strokeWidth={2}
              color={dynamicLineColor}
            />
          )}

          <Circle
            cx={center}
            cy={center}
            r={20}
            style="fill"
            color={(config?.color || colors.primary) + '15'}
          >
            <BlurMask blur={6} style="normal" />
          </Circle>

          {nodes.map((node, idx) => {
            // Node terkunci jika index >= lockedFromIndex pada state saat ini
            const isNodeLocked = isMatrixMode && !!config && idx >= config.lockedFromIndex;
            const highlighted = idx === highlightIndex;
            const nodeColor = ELEMENT_COLORS[node.element] || colors.primary;

            return (
              <Fragment key={`skia-${node.key}`}>
                {highlighted && (
                  <Circle cx={node.x} cy={node.y} r={22} style="fill" color={nodeColor + '25'} />
                )}
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={highlighted ? 16 : 13}
                  style="fill"
                  color={isNodeLocked ? colors.backgroundLight : (highlighted ? nodeColor : colors.surface)}
                />
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={highlighted ? 16 : 13}
                  style="stroke"
                  strokeWidth={1.5}
                  color={isNodeLocked ? colors.border : nodeColor}
                  opacity={isNodeLocked ? 0.4 : 1}
                />
              </Fragment>
            );
          })}
        </Canvas>

        {/* Lapisan Interaksi Sentuh */}
        <View pointerEvents="box-none" style={[StyleSheet.absoluteFillObject, { width: size, height: size }]}>
          {nodes.map((node, idx) => {
            const isNodeLocked = isMatrixMode && !!config && idx >= config.lockedFromIndex;
            const highlighted = idx === highlightIndex;

            return (
              <TouchableOpacity
                key={`btn-${node.key}`}
                disabled={isNodeLocked}
                style={{
                  position: 'absolute',
                  left: node.x - 24,
                  top: node.y - 24,
                  width: 48,
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: isNodeLocked ? 0.3 : 1,
                }}
                activeOpacity={0.7}
                onPress={() => onPointPress?.(node.point as DetailablePoint)}
              >
                {!!node.showKeyLetter && (
                  <Text style={[styles.letterIndicator, { color: colors.textMuted }]}>
                    {isNodeLocked ? '🔒' : node.showKeyLetter}
                  </Text>
                )}
                <Text
                  style={{
                    color: isNodeLocked ? colors.textMuted : (highlighted ? '#FFF' : colors.text),
                    fontWeight: '800',
                    fontSize: highlighted ? 13 : 12,
                    marginTop: node.showKeyLetter ? -2 : 0,
                  }}
                >
                  {node.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  flowIndicator: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  letterIndicator: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default ArcanaWheel; 