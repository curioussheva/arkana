// src/core/destiny-matrix/analysis/karmic-tail.ts
import type { DestinyMatrix, DestinyPoint } from '../types';
import { findKarmicTail, type KarmicTailDefinition } from '../data/karmic-tails';

export interface KarmicTailAnalysis extends KarmicTailDefinition {
  values: {
    D?: number;
    M?: number;
    T?: number;
    D1?: number; // Alias UI untuk M (reduce(D+E))
    D2?: number; // Alias UI untuk T (reduce(D+M))
    N?: number; // Pusat Kanal Keuangan & Hubungan
    O?: number; // Entri Hubungan Utama
    P?: number; // Entri Keuangan Utama
  };
}

/**
 * Helper internal untuk ekstraksi nilai numerik dari DestinyPoint atau number
 */
function extractValue(point?: DestinyPoint | number | null): number | undefined {
  if (point === undefined || point === null) return undefined;
  if (typeof point === 'number') return point;
  if (typeof point === 'object') {
    if (typeof point.value === 'number') return point.value;
    if (point.arcana && typeof point.arcana.id === 'number') return point.arcana.id;
  }
  return undefined;
}

/**
 * Analisis Karmic Tail (Ekor Karma) berdasarkan triad klaster karma bawah:
 *
 *   D → M → T
 *
 * D : Titik Anchor Utama (Main Point, sudut bawah)
 * M : Titik Tengah — reduce(D+E), ditampilkan sebagai "D1" di UI
 * T : Titik Ujung — reduce(D+M), ditampilkan sebagai "D2" di UI
 */
export function analyzeKarmicTail(matrix: DestinyMatrix): KarmicTailAnalysis {
  if (!matrix || !matrix.points) {
    throw new Error('DestinyMatrix dan matrix.points harus disediakan.');
  }

  // 1. Ekstraksi Nilai Utama Triad Ekor Karma (D, M, T)
  const d = extractValue(matrix.points.D);
  const m = extractValue(matrix.points.M);
  const t = extractValue(matrix.points.T);

  // 2. Ekstraksi Nilai Kanal Sekitar (N, O, P) & Alias UI (D1, D2)
  const n = extractValue(matrix.points.N ?? matrix.points.LM_Center);
  const o = extractValue(matrix.points.O ?? matrix.points.Love);
  const p = extractValue(matrix.points.P ?? matrix.points.Money);

  // 3. Cari Definisi Ekor Karma dari Database
  const definition =
    d !== undefined && m !== undefined && t !== undefined
      ? findKarmicTail(d, m, t)
      : ({
          title: 'Data Tidak Lengkap',
          triad: '',
          pastLifeDebt: '',
          manifestation: '',
          currentTriggers: '',
          healingWay: '',
          affirmation: '',
        } as KarmicTailDefinition);

  return {
    ...definition,
    values: {
      D: d,
      M: m,
      T: t,
      D1: m, // Alias UI untuk M
      D2: t, // Alias UI untuk T
      N: n,
      O: o,
      P: p,
    },
  };
}
