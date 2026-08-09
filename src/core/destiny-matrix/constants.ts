// src/core/destiny-matrix/constants.ts

import type { DestinyPointKey } from './types';

export const MATRIX_VERSION = '1.6.0' as const; // Skema 37 Titik Lengkap (Main, Ancestral, Inner, Sub-Nodes, Channels, Timeline)

export const POINT_LABELS: Record<DestinyPointKey, string> = {
  // ─── MAIN POINTS (Kotak Personal / Diagonal Utama) ───
  A: 'Hari Lahir (Identitas Dasar / Karakter Mental)',
  B: 'Bulan Lahir (Perlindungan Spiritual / Malaikat Pelindung)',
  C: 'Tahun Lahir (Garis Keturunan Material / Tantangan Keuangan Leluhur)',
  D: 'Sintesis Pertama (Jangkar Karmic Tail / Pintu Masuk Beban Jiwa)',
  E: "Titik Pusat (Comfort Zone / Esensi Jiwa / Heart's Desire)",

  // ─── ANCESTRAL POINTS (Kotak Tegak / Ancestral Square) ───
  F: 'Garis Leluhur Ayah Spiritual (Top-Left)',
  G: 'Garis Leluhur Ibu Spiritual (Top-Right)',
  H: 'Garis Leluhur Ayah Material (Bottom-Right)',
  I: 'Garis Leluhur Ibu Material (Bottom-Left)',

  // ─── INNER CROSS DASAR ───
  J: 'Bakat Tersembunyi Karakter (Jembatan A-E)',
  K: 'Kekuatan Batin Spiritual (Jembatan B-E)',
  L: 'Potensi Spiritual Finansial (Jembatan C-E)',
  M: 'Arah Perkembangan Karier & Keuangan (Jembatan D-E)',

  // ─── INNER BRIDGES & CHAKRA CONNECTION POINTS ───
  A1: 'Inner Personal A (Pusat Visi)',
  B1: 'Inner Personal B (Pusat Intuisi)',
  C1: 'Inner Personal C (Gerbang Pembuka Rezeki / Pintu Keuangan)',
  D1: 'Inner Personal D (Gerbang Harmonisasi / Pintu Hubungan)',
  F1: 'Jembatan Energi Garis Ayah Spiritual',
  G1: 'Jembatan Energi Garis Ibu Spiritual',
  H1: 'Jembatan Energi Garis Ayah Material',
  I1: 'Jembatan Energi Garis Ibu Material',

  // ─── COMPANIONS / SUB-NODES ───
  SubA: 'Pendamping Karakter Ego (A-A1)',
  SubB: 'Pendamping Kesadaran Spiritual (B-B1)',
  SubC: 'Pendamping Hambatan Finansial (C-C1)',
  SubD: 'Pendamping Transformasi Karma (D-D1)',
  SubF: 'Pendamping Silsilah Ayah Atas (F-F1)',
  SubG: 'Pendamping Silsilah Ibu Atas (G-G1)',
  SubH: 'Pendamping Silsilah Ayah Bawah (H-H1)',
  SubI: 'Pendamping Silsilah Ibu Bawah (I-I1)',

  // ─── MONEY & LOVE CHANNELS ───
  LM_Center: 'Titik Temu Pusat Saluran Keuangan & Cinta',
  Money: 'Saluran Utama Manajemen Finansial Makro',
  Love: 'Saluran Utama Dinamika Hubungan & Asmara Makro',

  // ─── MACRO EXTENSION NODES ───
  N: 'Pusat Saluran Jembatan Materi (N / LM_Center)',
  O: 'Ekstensi Keharmonisan Komunitas (O / Love)',
  P: 'Ekstensi Finansial Strategis (P / Money)',
  Q: 'Ekstensi Topeng Kepribadian Publik (Q / SubA)',
  R: 'Ekstensi Visi Tujuan Hidup Makro (R / SubB)',
  S: 'Ekstensi Fondasi Kelimpahan Bumi (S / SubC)',
  T: 'Ekstensi Katalis Pengurai Utang Karma (T / SubD)',

  // ─── TIMELINE POINTS (Diselaraskan Linear 4.5° Per Tahun) ───
  T10: 'Lini Masa Perkembangan Usia 10 Tahun',
  T15: 'Lini Masa Masa Muda Usia 15 Tahun',
  T20: 'Lini Masa Perintis Usia 20 Tahun',
  T25: 'Lini Masa Produktif Usia 25 Tahun',
  T30: 'Lini Masa Penataan Usia 30 Tahun',
  T35: 'Lini Masa Transformasi Usia 35 Tahun',
  T40: 'Lini Masa Puncak Karier Usia 40 Tahun',
  T45: 'Lini Masa Kematangan Usia 45 Tahun',
  T50: 'Lini Masa Penuaian Hasil Usia 50 Tahun',
  T55: 'Lini Masa Stabilitas Usia 55 Tahun',
  T60: 'Lini Masa Kematangan Jiwa Usia 60 Tahun',
  T65: 'Lini Masa Kebijaksanaan Usia 65 Tahun',
  T70: 'Lini Masa Refleksi Diri Usia 70 Tahun',
  T75: 'Lini Masa Masa Tua Usia 75 Tahun',

  HeartDesirePhysical: 'Titik Hasrat Hati — Fisik/Duniawi',
  HeartDesireSpiritual: 'Titik Hasrat Hati — Spiritual',
  Heaven: 'Takdir Surgawi',
  Earth: 'Takdir Duniawi',
  PersonalDestiny: 'Takdir Personal Integral',
  FatherLine: 'Garis Ayah',
  MotherLine: 'Garis Ibu',
  SocialDestiny: 'Takdir Sosial',
  SpiritualDestiny: 'Takdir Ilahi Pribadi',
  GlobalMission: 'Misi Ilahi Global',
  PersonalCenter: 'Pusat Kekuatan Pribadi',
  FamilyCenter: 'Pusat Kekuatan Keluarga',
  UnifiedCenter: 'Pusat Kekuatan Gabungan',
};

export const MAIN_POINT_KEYS = ['A', 'B', 'C', 'D', 'E'] as const;

export const BRIDGE_POINT_KEYS = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'] as const;

export const INNER_POINT_KEYS = ['A1', 'B1', 'C1', 'D1', 'F1', 'G1', 'H1', 'I1'] as const;

export const CHANNEL_POINT_KEYS = ['LM_Center', 'Money', 'Love', 'N', 'O', 'P'] as const;

export const SUB_NODE_KEYS = [
  'SubA',
  'SubB',
  'SubC',
  'SubD',
  'SubF',
  'SubG',
  'SubH',
  'SubI',
  'Q',
  'R',
  'S',
  'T',
] as const;

export const TIMELINE_POINT_KEYS = [
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
] as const;

export const ALL_POINT_KEYS: readonly DestinyPointKey[] = [
  ...MAIN_POINT_KEYS,
  ...BRIDGE_POINT_KEYS,
  ...INNER_POINT_KEYS,
  ...CHANNEL_POINT_KEYS,
  ...SUB_NODE_KEYS,
  ...TIMELINE_POINT_KEYS,
] as const;

// ─── 🎯 MAP ALIAS KOMPAS SEJATI (SAFE UNIQUE 2-WAY MAP) ───────────────────
export const GEOMETRIC_KEY_MAP: Record<DestinyPointKey, string> = {
  A: 'Main_A',
  B: 'Main_B',
  C: 'Main_C',
  D: 'Main_D',
  E: 'Main_E',
  F: 'Ancestral_F',
  G: 'Ancestral_G',
  H: 'Ancestral_H',
  I: 'Ancestral_I',
  J: 'Inner_J',
  K: 'Inner_K',
  L: 'Inner_L',
  M: 'Inner_M',
  A1: 'Inner_A1',
  B1: 'Inner_B1',
  C1: 'Inner_C1',
  D1: 'Inner_D1',
  F1: 'Inner_F1',
  G1: 'Inner_G1',
  H1: 'Inner_H1',
  I1: 'Inner_I1',
  SubA: 'Sub_A',
  SubB: 'Sub_B',
  SubC: 'Sub_C',
  SubD: 'Sub_D',
  SubF: 'Sub_F',
  SubG: 'Sub_G',
  SubH: 'Sub_H',
  SubI: 'Sub_I',
  N: 'Channel_N',
  O: 'Channel_O',
  P: 'Channel_P',
  Q: 'Companion_Q',
  R: 'Companion_R',
  S: 'Companion_S',
  T: 'Companion_T',
  LM_Center: 'UI_LM_Center',
  Money: 'UI_Money',
  Love: 'UI_Love',
  T10: 'Timeline_T10',
  T15: 'Timeline_T15',
  T20: 'Timeline_T20',
  T25: 'Timeline_T25',
  T30: 'Timeline_T30',
  T35: 'Timeline_T35',
  T40: 'Timeline_T40',
  T45: 'Timeline_T45',
  T50: 'Timeline_T50',
  T55: 'Timeline_T55',
  T60: 'Timeline_T60',
  T65: 'Timeline_T65',
  T70: 'Timeline_T70',
  T75: 'Timeline_T75',

  // Baru — Heart's Desire (namespace terpisah, bukan bagian Inner Cross lama)
  HeartDesirePhysical: 'HeartDesire_Physical',
  HeartDesireSpiritual: 'HeartDesire_Spiritual',

  // Baru — 8 Level Takdir & 3 Pusat Kekuatan (namespace 'Level_')
  Heaven: 'Level_Heaven',
  Earth: 'Level_Earth',
  PersonalDestiny: 'Level_PersonalDestiny',
  FatherLine: 'Level_FatherLine',
  MotherLine: 'Level_MotherLine',
  SocialDestiny: 'Level_SocialDestiny',
  SpiritualDestiny: 'Level_SpiritualDestiny',
  GlobalMission: 'Level_GlobalMission',
  PersonalCenter: 'Level_PersonalCenter',
  FamilyCenter: 'Level_FamilyCenter',
  UnifiedCenter: 'Level_UnifiedCenter',
};

// Map pembalik otomatis yang kini 100% aman karena keunikan namespace di atas
export const REVERSE_GEOMETRIC_KEY_MAP: Record<string, DestinyPointKey> = Object.fromEntries(
  Object.entries(GEOMETRIC_KEY_MAP).map(([rawKey, uiKey]) => [uiKey, rawKey as DestinyPointKey])
);
