// src/core/destiny-matrix/analysis/yin-yang.ts

import type { DestinyMatrix } from '../types';

export interface YinYangAnalysis {
  yinPercentage: number;
  yangPercentage: number;
  dominant: 'Yin' | 'Yang' | 'Balanced';
  archetype: string;
}

/**
 * Menghitung keseimbangan Yin–Yang berdasarkan seluruh titik Matrix.
 *
 * Angka genap  = Yin
 * Angka ganjil = Yang
 */
export function analyzeYinYang(
  matrix: DestinyMatrix,
): YinYangAnalysis {
  const values = Object.values(matrix.points)
    .map(point => point.value)
    .filter(value => value > 0);

  if (values.length === 0) {
    return {
      yinPercentage: 50,
      yangPercentage: 50,
      dominant: 'Balanced',
      archetype: 'The Balanced Harmonizer (Penyeimbang Adaptif)',
    };
  }

  const yangCount = values.filter(value => value % 2 !== 0).length;
  const _yinCount = values.length - yangCount;

  const yangPercentage = Math.round(
    (yangCount / values.length) * 100,
  );

  const yinPercentage = 100 - yangPercentage;

  let dominant: YinYangAnalysis['dominant'] = 'Balanced';
  let archetype = 'The Balanced Harmonizer (Penyeimbang Adaptif)';

  if (yangPercentage > 55) {
    dominant = 'Yang';
    archetype =
      'The Dynamic Doer (Inisiator & Pemimpin Aktif)';
  } else if (yinPercentage > 55) {
    dominant = 'Yin';
    archetype =
      'The Intuitive Reflector (Pengamat Bijak & Empatis)';
  }

  return {
    yinPercentage,
    yangPercentage,
    dominant,
    archetype,
  };
}