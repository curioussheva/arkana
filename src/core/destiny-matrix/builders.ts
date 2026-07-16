// src/core/destiny-matrix/builders.ts

import { getArcanaByNumber } from '../arcana';
import { ALL_POINT_KEYS, POINT_LABELS } from './constants';

import type {
  DestinyPoint,
  DestinyPointKey,
  DestinyMatrixPoints,
} from './types';

import type { RawCalculatedPoints } from './calculator/types';

/**
 * Membuat satu titik Destiny Point dengan proteksi penuh dari nilai rusak (NaN/undefined).
 */
export function buildPoint(
  key: DestinyPointKey,
  value: number | undefined,
): DestinyPoint {
  // 1. Tameng pertama: Pastikan nilai numeriknya valid
  const hasValidValue = typeof value === 'number' && !isNaN(value);
  const safeValue = hasValidValue ? value : 22; // 22 sebagai fallback aman (biasanya Arcana The Fool/World)

  if (!hasValidValue && __DEV__) {
    console.warn(
      `[DestinyMatrix Engine] ⚠️ Warning: Titik "${key}" bernilai "${value}". ` +
      `Pastikan fungsi kalkulator mengembalikan angka yang valid untuk titik ini.`
    );
  }

  // 2. Tameng kedua: Ambil data Arcana dari database
  let arcana = getArcanaByNumber(safeValue);

  // 3. Tameng ketiga: Jika nomornya ada tapi datanya tidak ditemukan di DB
  if (!arcana) {
    if (__DEV__) {
      console.warn(
        `[DestinyMatrix Engine] ⚠️ Warning: Arcana dengan nomor ${safeValue} tidak ditemukan di database ` +
        `untuk titik "${key}". Menggunakan fallback Arcana default.`
      );
    }
    // Lakukan fallback bertingkat ke Arcana nomor 22, atau nomor 1 jika terpaksa
    arcana = getArcanaByNumber(22) || getArcanaByNumber(1);
  }

  return {
    key,
    label: POINT_LABELS[key] || `Titik ${key}`,
    value: safeValue,
    arcana: arcana!, // Tanda ! aman digunakan karena fallback di atas menjamin objek ini tidak null
  };
}

/**
 * Merakit seluruh kumpulan titik Destiny Matrix dari nilai kalkulasi mentah.
 */
export function buildPoints(
  raw: RawCalculatedPoints,
): DestinyMatrixPoints {
  const result = {} as DestinyMatrixPoints;

  // Proteksi jika objek raw tidak sengaja bernilai null atau undefined
  const safeRaw = raw || {};

  for (const key of ALL_POINT_KEYS) {
    result[key] = buildPoint(key, safeRaw[key]);
  }

  return result;
}
 