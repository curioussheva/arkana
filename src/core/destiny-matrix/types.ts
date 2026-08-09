// src/core/destiny-matrix/types.ts

import type { ArcanaDefinition } from '../arcana/types';

import type { DestinyLevels } from './calculator/types';

export type { DestinyLevels };

/* -------------------------------------------------------------------------- */
/*                            DESTINY POINT KEYS                              */
/* -------------------------------------------------------------------------- */

export type DestinyPointKey =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'A1'
  | 'B1'
  | 'C1'
  | 'D1'
  | 'F1'
  | 'G1'
  | 'H1'
  | 'I1'
  | 'HeartDesirePhysical'
  | 'HeartDesireSpiritual'
  | 'LM_Center'
  | 'Money'
  | 'Love'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'SubA'
  | 'SubB'
  | 'SubC'
  | 'SubD'
  | 'SubF'
  | 'SubG'
  | 'SubH'
  | 'SubI'
  | 'T10'
  | 'T15'
  | 'T20'
  | 'T25'
  | 'T30'
  | 'T35'
  | 'T40'
  | 'T45'
  | 'T50'
  | 'T55'
  | 'T60'
  | 'T65'
  | 'T70'
  | 'T75'
  // Level Takdir & Pusat Kekuatan — sebelumnya tidak terdaftar, walau
  // sudah dihasilkan calculator/main.ts sejak awal
  | 'Heaven'
  | 'Earth'
  | 'PersonalDestiny'
  | 'FatherLine'
  | 'MotherLine'
  | 'SocialDestiny'
  | 'SpiritualDestiny'
  | 'GlobalMission'
  | 'PersonalCenter'
  | 'FamilyCenter'
  | 'UnifiedCenter';

export interface DestinyPoint {
  key: DestinyPointKey | string;
  label: string;
  value: number;
  arcana: ArcanaDefinition;
  category: 'main' | 'ancestral' | 'inner' | 'channel' | 'companion' | 'timeline';
  // ← dikembalikan ke 6 nilai semula, GreenZonePhysical/Spiritual dihapus dari sini
}

/**
 * Peta seluruh titik hasil kalkulasi Matriks Takdir.
 * Menggunakan indeks parsial untuk mendukung akses dinamis titik-titik kustom/timeline.
 */
export type DestinyMatrixPoints = Partial<Record<DestinyPointKey, DestinyPoint>> & {
  [key: string]: DestinyPoint | undefined;
};

/* -------------------------------------------------------------------------- */
/*                              DESTINY LEVELS                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                NAMED LINES                                 */
/* -------------------------------------------------------------------------- */

export interface NamedLines {
  karmicTail: {
    // Tuple ketat: [Garis Jangkar D, Garis Tengah M (D1), Garis Ujung T (D2)] Sesuai Pakem Ladini
    points: [DestinyPoint, DestinyPoint, DestinyPoint];
    pattern: string; // e.g. "18-6-15"
    title: string; // e.g. "The Rebel / Broken Family Line"
    meaning: string; // Deskripsi utang masa lalu & manifestasi
    resolution: string; // Solusi penguraian karma & teks afirmasi
  };

  familyLine?: {
    points: DestinyPoint[];
    pattern?: string;
    title?: string;
    meaning?: string;
    resolution?: string;
  };

  loveLine?: {
    entry?: DestinyPoint; // LM_Center / N
    partner?: DestinyPoint; // Love / P
    outcome?: DestinyPoint; // M (Gerbang Pintu Hubungan)
    past?: DestinyPoint; // D (Karmic Anchor)
    meaning: string;
    keyLesson: string;
  };

  moneyLine: {
    // Dipetakan linear dari: LM_Center -> Money -> C (Atau C1)
    entry: DestinyPoint; // LM_Center / N (Gerbang pembuka arus)
    core: DestinyPoint; // Money / O (Aktivitas bisnis/profesi makro)
    exit: DestinyPoint; // C (Tujuan penyimpanan/Aset silsilah bumi)
    meaning: string;
    advice: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                            KARMIC TAIL VALUES                              */
/* -------------------------------------------------------------------------- */

export interface KarmicTailValues {
  anchor: number;
  extension1: number;
  extension2: number;
  D?: number;
  M?: number;
  T?: number;
  D1?: number;
  D2?: number;
  N?: number;
  O?: number;
  P?: number;
  [key: string]: number | undefined; // Index signature aman untuk lookup fallback dinamis
}

export interface DestinyMatrixInput {
  birthDate: string; // Format ISO: YYYY-MM-DD
}

/* -------------------------------------------------------------------------- */
/*                        CONSOLIDATED MATRIX INTERFACE                       */
/* -------------------------------------------------------------------------- */

export interface DestinyMatrix {
  version: string;
  calculatedAt: string;
  birthDate: string;
  input: DestinyMatrixInput;
  points: DestinyMatrixPoints;
  destinies: DestinyLevels;
  namedLines: NamedLines;
  karmicTailCode: string;

  primaryPoints?: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };

  groupedPoints?: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                        DAILY ELEMENT RESONANCE                             */
/* -------------------------------------------------------------------------- */

export type TotemKey = 'Angel' | 'Eagle' | 'Lion' | 'Ox';

export interface DailyElementSummary {
  icon: string;
  name: string;
  color: string;
  totem: string;
  totemKey: TotemKey;
  gem: string;
  cardName?: string;
  cardId?: number;
}

export interface DailyResonance {
  element: string;
  icon: string;
  color: string;
  totem: string;
  totemKey: TotemKey;
  gemstone: string;
  luckyColor: string;
  direction: string;
  doAction: string;
  dontAction: string;
  cardName?: string;
  cardId?: number;
}
