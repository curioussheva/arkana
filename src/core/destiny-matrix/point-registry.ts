// src/core/destiny-matrix/point-registry.ts
//
// LAYER 2 — REGISTRY SEMANTIK
// -----------------------------------------------------------------------
// Aturan:
// 1. File ini TIDAK BOLEH berisi rumus/kalkulasi. Hanya metadata: nama,
//    domain asal, label tampilan, simbol UI.
// 2. `canonical` selalu merujuk ke key hasil hitungan di Layer 1
//    (calculateMacroPoints, calculateBridgePoints, dst).
// 3. Kalau ada nama baru yang sebenarnya representasi lain dari titik
//    yang sudah ada -> tambah entri baru di sini, JANGAN buat variabel
//    baru yang menghitung ulang.
// -----------------------------------------------------------------------

import type { DestinyPointKey } from './types';

export type PointDomain =
  | 'main' // A-E, sudut & pusat persegi diagonal
  | 'ancestral' // F-I, persegi leluhur
  | 'inner-bridge' // J-M / A1-D1
  | 'companion' // Q-T / SubA-SubD
  | 'channel' // N-P / LM_Center, Money, Love
  | 'timeline' // T10-T75
  | 'destiny-level' // 8 Level Takdir & 3 Pusat Kekuatan
  | 'chakra' // Sistem 7 Chakra (garis Surga & Bumi)
  | 'karmic-tail' // Alias khusus untuk analisis Ekor Karma (D-M-T)
  | 'ui'; // Nama murni kosmetik, tidak punya makna domain sendiri

export interface PointMeta {
  /** Key kanonik di DestinyMatrixPoints — SATU-SATUNYA sumber nilai. */
  canonical: DestinyPointKey;
  /** Nama alternatif yang dipakai di domain/dokumen tertentu. */
  alias: string;
  domain: PointDomain;
  label: string;
  description?: string;
  symbol?: string; // contoh: '$', '❤️'
}

// -----------------------------------------------------------------------
// 1. MAIN POINTS (Persegi Diagonal)
// -----------------------------------------------------------------------
export const MAIN_POINTS: PointMeta[] = [
  {
    canonical: 'A',
    alias: 'A',
    domain: 'main',
    label: 'Kepribadian',
    description: 'Tanggal lahir',
  },
  {
    canonical: 'B',
    alias: 'B',
    domain: 'main',
    label: 'Malaikat Pelindung',
    description: 'Bulan lahir',
  },
  {
    canonical: 'C',
    alias: 'C',
    domain: 'main',
    label: 'Potensi Fisik',
    description: 'Tahun lahir (reduced)',
  },
  {
    canonical: 'D',
    alias: 'D',
    domain: 'main',
    label: 'Ekor Karma / Titik Anchor',
    description: 'reduce(A+B+C)',
  },
  // CATATAN: label E SEBELUMNYA "Heart's Desire" — itu SALAH, sudah
  // diperbaiki. Istilah "Heart's Desire"/Green Zone milik pasangan node
  // baru (GreenZonePhysical/GreenZoneSpiritual di bawah), bukan E.
  {
    canonical: 'E',
    alias: 'E',
    domain: 'main',
    label: 'Zona Nyaman / Pusat Pribadi',
    description: 'reduce(A+B+C+D)',
  },
];

// -----------------------------------------------------------------------
// 2. ANCESTRAL / BRIDGE POINTS (Persegi Lurus)
// -----------------------------------------------------------------------
export const ANCESTRAL_POINTS: PointMeta[] = [
  { canonical: 'F', alias: 'F', domain: 'ancestral', label: 'Ayah Spiritual' },
  { canonical: 'G', alias: 'G', domain: 'ancestral', label: 'Ibu Spiritual' },
  { canonical: 'H', alias: 'H', domain: 'ancestral', label: 'Ayah Material' },
  { canonical: 'I', alias: 'I', domain: 'ancestral', label: 'Ibu Material' },
];

// -----------------------------------------------------------------------
// 3. INNER BRIDGE (J-M dikenal juga sebagai A1-D1)
// -----------------------------------------------------------------------
export const INNER_BRIDGE_POINTS: PointMeta[] = [
  {
    canonical: 'J',
    alias: 'J',
    domain: 'inner-bridge',
    label: 'Jembatan Kepribadian',
    description: 'reduce(A+E)',
  },
  {
    canonical: 'K',
    alias: 'K',
    domain: 'inner-bridge',
    label: 'Jembatan Spiritual',
    description: 'reduce(B+E)',
  },
  {
    canonical: 'L',
    alias: 'L',
    domain: 'inner-bridge',
    label: 'Jembatan Material',
    description: 'reduce(C+E)',
  },
  {
    canonical: 'M',
    alias: 'M',
    domain: 'inner-bridge',
    label: 'Jembatan Karma',
    description: 'reduce(D+E)',
  },

  {
    canonical: 'J',
    alias: 'A1',
    domain: 'inner-bridge',
    label: 'Jembatan Kepribadian',
    description: 'reduce(A+E)',
  },
  {
    canonical: 'K',
    alias: 'B1',
    domain: 'inner-bridge',
    label: 'Jembatan Spiritual',
    description: 'reduce(B+E)',
  },
  {
    canonical: 'L',
    alias: 'C1',
    domain: 'inner-bridge',
    label: 'Jembatan Material',
    description: 'reduce(C+E)',
  },
  {
    canonical: 'M',
    alias: 'D1',
    domain: 'inner-bridge',
    label: 'Jembatan Karma',
    description: 'reduce(D+E)',
  },
  // Alias khusus konteks Ekor Karma (dipakai di analyzeKarmicTail)
  { canonical: 'M', alias: 'D1', domain: 'karmic-tail', label: 'Titik Tengah Ekor Karma' },

  // F1-I1: sebelumnya tidak terdaftar sama sekali (celah, ditemukan via export debug)
  {
    canonical: 'F1',
    alias: 'F1',
    domain: 'inner-bridge',
    label: 'Jembatan Ayah Spiritual',
    description: 'reduce(F+E)',
  },
  {
    canonical: 'G1',
    alias: 'G1',
    domain: 'inner-bridge',
    label: 'Jembatan Ibu Spiritual',
    description: 'reduce(G+E)',
  },
  {
    canonical: 'H1',
    alias: 'H1',
    domain: 'inner-bridge',
    label: 'Jembatan Ayah Material',
    description: 'reduce(H+E)',
  },
  {
    canonical: 'I1',
    alias: 'I1',
    domain: 'inner-bridge',
    label: 'Jembatan Ibu Material',
    description: 'reduce(I+E)',
  },

  // Heart's Desire / Green Zone — istilah resmi Ladini adalah "Green
  // Zone", dua node di perpotongan salib utama. JANGAN disamakan dengan
  // E (Comfort Zone/Zona Nyaman) — beda konsep. Nama key kanonik pakai
  // "HeartDesire*" (sudah jadi konvensi di boilerplate types.ts/layout.ts).
  {
    canonical: 'HeartDesirePhysical',
    alias: 'HeartDesirePhysical',
    domain: 'inner-bridge',
    label: 'Titik Hasrat Hati — Fisik/Duniawi',
    description: 'reduce(J+E), garis horizontal (A1<->E)',
  },
  {
    canonical: 'HeartDesireSpiritual',
    alias: 'HeartDesireSpiritual',
    domain: 'inner-bridge',
    label: 'Titik Hasrat Hati — Spiritual',
    description: 'reduce(K+E), garis vertikal (B1<->E)',
  },
];

// -----------------------------------------------------------------------
// 4. COMPANION / SUB-NODES (Q-T dikenal juga sebagai SubA-SubD)
// -----------------------------------------------------------------------
export const COMPANION_POINTS: PointMeta[] = [
  {
    canonical: 'Q',
    alias: 'Q',
    domain: 'companion',
    label: 'Sub-Node Kiri',
    description: 'reduce(A+J)',
  },
  {
    canonical: 'R',
    alias: 'R',
    domain: 'companion',
    label: 'Sub-Node Atas',
    description: 'reduce(B+K)',
  },
  {
    canonical: 'S',
    alias: 'S',
    domain: 'companion',
    label: 'Sub-Node Kanan',
    description: 'reduce(C+L)',
  },
  {
    canonical: 'T',
    alias: 'T',
    domain: 'companion',
    label: 'Sub-Node Bawah',
    description: 'reduce(D+M)',
  },

  {
    canonical: 'Q',
    alias: 'SubA',
    domain: 'companion',
    label: 'Sub-Node Kiri',
    description: 'reduce(A+J)',
  },
  {
    canonical: 'R',
    alias: 'SubB',
    domain: 'companion',
    label: 'Sub-Node Atas',
    description: 'reduce(B+K)',
  },
  {
    canonical: 'S',
    alias: 'SubC',
    domain: 'companion',
    label: 'Sub-Node Kanan',
    description: 'reduce(C+L)',
  },
  {
    canonical: 'T',
    alias: 'SubD',
    domain: 'companion',
    label: 'Sub-Node Bawah',
    description: 'reduce(D+M)',
  },
  // Alias khusus konteks Ekor Karma
  { canonical: 'T', alias: 'D2', domain: 'karmic-tail', label: 'Titik Ujung Ekor Karma' },

  {
    canonical: 'SubF',
    alias: 'SubF',
    domain: 'companion',
    label: 'Sub-Node Ayah Spiritual',
    description: 'reduce(F+F1)',
  },
  {
    canonical: 'SubG',
    alias: 'SubG',
    domain: 'companion',
    label: 'Sub-Node Ibu Spiritual',
    description: 'reduce(G+G1)',
  },
  {
    canonical: 'SubH',
    alias: 'SubH',
    domain: 'companion',
    label: 'Sub-Node Ayah Material',
    description: 'reduce(H+H1)',
  },
  {
    canonical: 'SubI',
    alias: 'SubI',
    domain: 'companion',
    label: 'Sub-Node Ibu Material',
    description: 'reduce(I+I1)',
  },
];

// -----------------------------------------------------------------------
// 5. CHANNEL POINTS (N-P) — sekaligus alias UI (LM_Center/Money/Love)
//    dan alias chakra (svadhisthana)
// -----------------------------------------------------------------------
export const CHANNEL_POINTS: PointMeta[] = [
  { canonical: 'N', alias: 'LM_Center', domain: 'ui', label: 'Pusat Cinta & Uang' },
  {
    canonical: 'N',
    alias: 'N',
    domain: 'channel',
    label: 'Pusat Kanal',
    description: 'reduce(D1 + svadhisthanaEarth)',
  },

  { canonical: 'P', alias: 'Money', domain: 'ui', label: 'Entri Uang', symbol: '$' },
  { canonical: 'P', alias: 'P', domain: 'channel', label: 'Jalur Keuangan (Garis Bumi)' },

  { canonical: 'O', alias: 'Love', domain: 'ui', label: 'Entri Pasangan', symbol: '❤' },
  { canonical: 'O', alias: 'O', domain: 'channel', label: 'Jalur Pasangan (Garis Surga)' },
];

// -----------------------------------------------------------------------
// 6. CHAKRA MAP — svadhisthana & lainnya
//    Nilai svadhisthanaEarth SAMA dengan komponen pembentuk N/P.
//    Jangan hitung ulang di macro.ts — ambil dari calculateSvadhisthana().
// -----------------------------------------------------------------------
export const CHAKRA_POINTS_META = {
  heavenLine: {
    domain: 'chakra' as PointDomain,
    axis: 'B-E-D (garis vertikal / Surga)',
    nodes: [
      'sahasrara',
      'ajna',
      'vishudha',
      'anahata',
      'manipura',
      'svadhisthana',
      'muladhara',
    ] as const,
  },
  earthLine: {
    domain: 'chakra' as PointDomain,
    axis: 'A-E-C (garis horizontal / Bumi)',
    nodes: [
      'sahasrara',
      'ajna',
      'vishudha',
      'anahata',
      'manipura',
      'svadhisthana',
      'muladhara',
    ] as const,
  },
  // svadhisthanaEarth (chakra) == komponen N/P (channel) — SAMA NILAI, BEDA NAMA
  crossReference: {
    'svadhisthanaEarth (chakra)':
      'sama dengan svadhisthanaEarth di calculateSvadhisthana(), dipakai N & P',
    'svadhisthanaHeaven (chakra)':
      'belum dipakai di channel manapun saat ini — cek apakah seharusnya juga masuk N/O/P',
  },
};

// -----------------------------------------------------------------------
// 7. TIMELINE (T10-T75)
// -----------------------------------------------------------------------
export const TIMELINE_POINTS: PointMeta[] = [
  'T10',
  'T15',
  'T20',
  'T25',
  'T30',
  'T35',
  'T40',
  'T45',
  'T50',
  'T55',
  'T60',
  'T65',
  'T70',
  'T75',
].map(key => ({
  canonical: key as DestinyPointKey,
  alias: key,
  domain: 'timeline' as PointDomain,
  label: `Usia ${key.slice(1)} tahun`,
}));

// -----------------------------------------------------------------------
// 8. DESTINY LEVELS (8 Level Takdir & 3 Pusat Kekuatan)
// -----------------------------------------------------------------------
export const DESTINY_LEVEL_POINTS: PointMeta[] = [
  {
    canonical: 'Heaven',
    alias: 'Heaven',
    domain: 'destiny-level',
    label: 'Takdir Surgawi (Level 1)',
    description: 'reduce(B+D)',
  },
  {
    canonical: 'Earth',
    alias: 'Earth',
    domain: 'destiny-level',
    label: 'Takdir Duniawi (Level 2)',
    description: 'reduce(A+C)',
  },
  {
    canonical: 'PersonalDestiny',
    alias: 'PersonalDestiny',
    domain: 'destiny-level',
    label: 'Takdir Personal Integral (Level 3)',
  },
  {
    canonical: 'FatherLine',
    alias: 'FatherLine',
    domain: 'destiny-level',
    label: 'Garis Ayah (Level 4)',
    description: 'reduce(F+H)',
  },
  {
    canonical: 'MotherLine',
    alias: 'MotherLine',
    domain: 'destiny-level',
    label: 'Garis Ibu (Level 5)',
    description: 'reduce(G+I)',
  },
  {
    canonical: 'SocialDestiny',
    alias: 'SocialDestiny',
    domain: 'destiny-level',
    label: 'Takdir Sosial / Rekonsiliasi Keluarga (Level 6)',
  },
  {
    canonical: 'SpiritualDestiny',
    alias: 'SpiritualDestiny',
    domain: 'destiny-level',
    label: 'Takdir Ilahi Pribadi (Level 7)',
  },
  {
    canonical: 'GlobalMission',
    alias: 'GlobalMission',
    domain: 'destiny-level',
    label: 'Misi Ilahi Global (Level 8)',
  },
  {
    canonical: 'PersonalCenter',
    alias: 'PersonalCenter',
    domain: 'destiny-level',
    label: 'Pusat Kekuatan Pribadi',
    description: '= E',
  },
  {
    canonical: 'FamilyCenter',
    alias: 'FamilyCenter',
    domain: 'destiny-level',
    label: 'Pusat Kekuatan Keluarga',
    description: 'reduce(F+G+H+I)',
  },
  {
    canonical: 'UnifiedCenter',
    alias: 'UnifiedCenter',
    domain: 'destiny-level',
    label: 'Pusat Kekuatan Gabungan',
  },
];

// -----------------------------------------------------------------------
// GABUNGAN + HELPER RESOLUSI
// -----------------------------------------------------------------------
export const POINT_REGISTRY: PointMeta[] = [
  ...MAIN_POINTS,
  ...ANCESTRAL_POINTS,
  ...INNER_BRIDGE_POINTS,
  ...COMPANION_POINTS,
  ...CHANNEL_POINTS,
  ...TIMELINE_POINTS,
  ...DESTINY_LEVEL_POINTS,
];

/** Map cepat alias -> key kanonik, dibangun sekali dari POINT_REGISTRY. */
export const ALIAS_TO_CANONICAL: Record<string, DestinyPointKey> = POINT_REGISTRY.reduce(
  (acc, meta) => {
    acc[meta.alias] = meta.canonical;
    return acc;
  },
  {} as Record<string, DestinyPointKey>
);

/**
 * Resolusi nama apa pun (kanonik ATAU alias) ke DestinyPoint di matrix.
 * Pakai fungsi ini di UI/analysis layer — JANGAN akses matrix.points[alias]
 * langsung atau hitung ulang manual.
 */
export function resolvePoint(matrix: { points: Record<string, unknown> }, name: string): unknown {
  const key = ALIAS_TO_CANONICAL[name] ?? name;
  return matrix.points[key];
}

/** Ambil semua metadata untuk satu key kanonik (bisa lebih dari satu alias/domain). */
export function getMetaFor(canonical: DestinyPointKey): PointMeta[] {
  return POINT_REGISTRY.filter(m => m.canonical === canonical);
}
