// src/core/destiny-matrix/constants.ts

import type { DestinyPointKey } from './types';

export const MATRIX_VERSION = '1.4.0' as const;

export const POINT_LABELS: Record<DestinyPointKey, string> = {
  A: 'Hari Lahir (Karakter/Mental)',
  B: 'Bulan Lahir (Spiritual/Malaikat Pelindung)',
  C: 'Garis Keturunan (Masa Lalu/Tantangan Keuangan)',
  D: 'Sintesis Pertama (Karmic Tail/Pintu Masuk Karma)',
  E: 'Titik Pusat (Esensi Jiwa / Zona Nyaman)',

  F: 'Zona Nyaman Keturunan Atas-Kiri',
  G: 'Zona Sosial Keturunan Atas-Kanan',
  H: 'Zona Tantangan Keturunan Bawah-Kanan',
  I: 'Zona Keseimbangan Keturunan Bawah-Kiri',

  J: 'Bakat Tersembunyi (Titik Tengah A-E)',
  K: 'Kekuatan Batin (Titik Tengah B-E)',
  L: 'Potensi Spiritual (Titik Tengah C-E)',
  M: 'Arah Perkembangan (Titik Tengah D-E)',

  N: 'Ekstensi Keturunan I',
  O: 'Ekstensi Keturunan II',
  P: 'Ekstensi Keturunan III',

  Q: 'Ekstensi Kepribadian',
  R: 'Ekstensi Tujuan Hidup',
  S: 'Ekstensi Garis Keturunan',
  T: 'Ekstensi Sintesis',

  A1: 'Ekstensi Jalur Karakter I (A - J)',
  A2: 'Ekstensi Jalur Karakter II (J - E)',
  A3: 'Titik Sinkronisasi Karakter-Jiwa',

  B1: 'Ekstensi Jalur Spiritual I (B - K)',
  B2: 'Ekstensi Jalur Spiritual II (K - E)',
  B3: 'Titik Sinkronisasi Spiritual-Jiwa',

  C1: 'Ekstensi Jalur Finansial I (C - L)',
  C2: 'Ekstensi Jalur Finansial II (L - E)',
  C3: 'Titik Sinkronisasi Finansial-Jiwa',

  D1: 'Ekstensi Jalur Karma I (D - M)',
  D2: 'Ekstensi Jalur Karma II (M - E)',
  D3: 'Titik Sinkronisasi Karma-Jiwa',

  E1: 'Aspek Makro Komunita (A + B)',
  E2: 'Aspek Makro Materi (C + D)',
};

export const MAIN_POINT_KEYS = [
  'A',
  'B',
  'C',
  'D',
  'E',
] as const;

export const BRIDGE_POINT_KEYS = [
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
] as const;

export const MACRO_POINT_KEYS = [
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
] as const;

export const ENERGY_POINT_KEYS = [
  'A1',
  'A2',
  'A3',

  'B1',
  'B2',
  'B3',

  'C1',
  'C2',
  'C3',

  'D1',
  'D2',
  'D3',

  'E1',
  'E2',
] as const;

export const ALL_POINT_KEYS: readonly DestinyPointKey[] = [
  ...MAIN_POINT_KEYS,
  ...BRIDGE_POINT_KEYS,
  ...MACRO_POINT_KEYS,
  ...ENERGY_POINT_KEYS,
];