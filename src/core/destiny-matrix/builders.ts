// src/core/destiny-matrix/builders.ts

import { getArcanaByNumber } from '../arcana';
import { POINT_LABELS } from './constants';

import type { DestinyPoint, DestinyPointKey, DestinyMatrixPoints } from './types';

/**
 * Menentukan kategori titik berdasarkan kunci (DestinyPointKey).
 */
export function getCategoryForKey(key: DestinyPointKey): DestinyPoint['category'] {
  if (['A', 'B', 'C', 'D', 'E'].includes(key)) return 'main';
  if (['F', 'G', 'H', 'I'].includes(key)) return 'ancestral';
  if (['J', 'K', 'L', 'M', 'A1', 'B1', 'C1', 'D1', 'F1', 'G1', 'H1', 'I1'].includes(key))
    return 'inner';
  if (['N', 'O', 'P', 'LM_Center', 'Money', 'Love'].includes(key)) return 'channel';
  if (['Q', 'R', 'S', 'T'].includes(key) || key.startsWith('Sub')) return 'companion';
  return 'timeline';
}

/**
 * Membuat satu titik Destiny Point dengan proteksi penuh dari nilai rusak (NaN/undefined).
 */
export function buildPoint(key: DestinyPointKey, rawValue: number): DestinyPoint {
  const safeValue = isNaN(rawValue) || rawValue === undefined || rawValue === null ? 0 : rawValue;
  const category = getCategoryForKey(key);

  return {
    key,
    label: POINT_LABELS[key] ?? key,
    value: safeValue,
    arcana: getArcanaByNumber(safeValue),
    category,
  };
}

/**
 * Merakit seluruh kumpulan titik Destiny Matrix dari nilai kalkulasi mentah.
 */
export function buildPoints(rawMap: Partial<Record<DestinyPointKey, number>>): DestinyMatrixPoints {
  const points = {} as DestinyMatrixPoints;

  (Object.keys(rawMap) as DestinyPointKey[]).forEach(key => {
    const val = rawMap[key];
    if (val !== undefined) {
      points[key] = buildPoint(key, val);
    }
  });

  return points;
}
