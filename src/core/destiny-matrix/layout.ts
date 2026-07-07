// src/core/destiny-matrix/layout.ts
import type { DestinyPointKey } from './types';

/**
 * Normalized (x, y) position of each point on the diamond diagram.
 * (0, 0) is the center (point E).
 * 
 * COORD CALIBRATION: Updated to perfectly align with the new formulas in engine.ts.
 * Sub-points now fall precisely on their respective linear paths instead of overlapping.
 */
export const POINT_LAYOUT: Record<DestinyPointKey, { x: number; y: number }> = {
  // Outer corners (Diamond utama)
  A: { x: 0, y: -1 },   // Top (Karakter)
  B: { x: 1, y: 0 },    // Right (Spiritual)
  C: { x: 0, y: 1 },    // Bottom (Finansial)
  D: { x: -1, y: 0 },   // Left (Karma)
  
  // Center
  E: { x: 0, y: 0 },    // Komfort / Pusat Jiwa

  // Edge midpoints (Matriks Leluhur / Ancestral Square)
  F: { x: 0.5, y: -0.5 },  // Top-Right (Antara A dan B)
  G: { x: 0.5, y: 0.5 },   // Bottom-Right (Antara B dan C)
  H: { x: -0.5, y: 0.5 },  // Bottom-Left (Antara C dan D)
  I: { x: -0.5, y: -0.5 }, // Top-Left (Antara D dan A)

  // Inner diagonal midpoints (Jembatan dari sudut luar ke pusat E)
  J: { x: 0, y: -0.5 },  // Antara A dan E
  K: { x: 0.5, y: 0 },   // Antara B dan E
  L: { x: 0, y: 0.5 },   // Antara C dan E
  M: { x: -0.5, y: 0 },  // Antara D dan E

  // Extended points (Titik makro terluar)
  Q: { x: 0, y: -1.3 },   // Di luar A (Atas)
  R: { x: 1.3, y: 0 },    // Di luar B (Kanan)
  S: { x: 0, y: 1.3 },    // Di luar C (Bawah)
  T: { x: -1.3, y: 0 },   // Di luar D (Kiri)
  
  // Karmic Tail Extensions
  N: { x: -0.35, y: 0.75 },
  O: { x: -0.15, y: 0.95 },
  P: { x: -0.5, y: 0.95 },

  // ==================== CALIBRATED SUB-POINTS (A1 - E2) ====================
  
  // Jalur Vertikal Atas (Garis Karakter: Q -> A -> J -> E)
  A1: { x: 0.0, y: -1.15 }, // Tengah antara A dan Q
  A2: { x: 0.0, y: -0.25 }, // Tengah antara J dan E
  A3: { x: 0.0, y: -0.90 }, // Tengah antara Q dan J

  // Jalur Horisontal Kanan (Garis Spiritual: E -> K -> B -> R)
  B1: { x: 1.15, y: 0.0 },  // Tengah antara B dan R
  B2: { x: 0.25, y: 0.0 },  // Tengah antara K dan E
  B3: { x: 0.90, y: 0.0 },  // Tengah antara R dan K

  // Jalur Vertikal Bawah (Garis Finansial: E -> L -> C -> S)
  C1: { x: 0.0, y: 1.15 },  // Tengah antara C dan S
  C2: { x: 0.0, y: 0.25 },  // Tengah antara L dan E
  C3: { x: 0.0, y: 0.90 },  // Tengah antara S dan L

  // Jalur Horisontal Kiri (Garis Karma: T -> D -> M -> E)
  D1: { x: -1.15, y: 0.0 }, // Tengah antara D dan T
  D2: { x: -0.25, y: 0.0 }, // Tengah antara M dan E
  D3: { x: -0.90, y: 0.0 }, // Tengah antara T dan M

  // Garis Penghubung Ancestral Square (Sesuai rumus f + g & h + i di engine)
  E1: { x: 0.5, y: 0.0 },   // Sisi kanan tengah (Menghubungkan F dan G)
  E2: { x: -0.5, y: 0.0 },  // Sisi kiri tengah (Menghubungkan H dan I)
};

/**
 * Line segments to draw for the diamond's outer outline
 * (A -> F -> B -> G -> C -> H -> D -> I -> A).
 */
export const OUTER_OUTLINE: DestinyPointKey[] = ['A', 'F', 'B', 'G', 'C', 'H', 'D', 'I', 'A'];

/**
 * Rantai jalur render vertikal dari titik paling luar atas ke paling luar bawah.
 * Diurutkan secara linear tanpa ada titik melompat agar drawing path SVG/Canvas tidak patah.
 */
export const VERTICAL_DIAGONAL: DestinyPointKey[] = [
  'Q', 'A1', 'A3', 'A', 'J', 'A2', 'E', 'C2', 'L', 'C3', 'C', 'C1', 'S'
];

/**
 * Rantai jalur render horisontal dari titik paling luar kiri ke paling luar kanan.
 * Diurutkan secara linear dari koordinat minus (-) ke plus (+) secara rapi.
 */
export const HORIZONTAL_DIAGONAL: DestinyPointKey[] = [
  'T', 'D1', 'D3', 'D', 'M', 'D2', 'E', 'B2', 'K', 'B3', 'B', 'B1', 'R'
];
 