// Berkas: src/core/destiny-matrix/layout.ts
import type { DestinyPointKey } from './types';

/**
 * Normalized (x, y) position of each point on the diamond diagram.
 * (0, 0) is the center (point E).
 */
export const POINT_LAYOUT: Partial<Record<DestinyPointKey, { x: number; y: number }>> = { 
  // ─── 1. TITIK JANGKAR UTAMA (Diamond Inti) ─────────────────────────
  A: { x: 0, y: -1 },   // Top (Karakter / Mental Spiritual)
  B: { x: 1, y: 0 },    // Right (Sosial / Masa Depan / Finansial)
  C: { x: 0, y: 1 },    // Bottom (Utang Karma / Masa Lalu)
  D: { x: -1, y: 0 },   // Left (Fisik / Kesehatan / Potensi Lahir)
  
  // Center (Inti Jiwa)
  E: { x: 0, y: 0 },    // Kenyamanan / Pusat Jiwa

  // ─── 2. MATRIKS LELUHUR (Ancestral Square / Diagonal Midpoints) ───
  F: { x: 0.5, y: -0.5 },  // Top-Right (Sayap Garis Leluhur Ayah)
  G: { x: 0.5, y: 0.5 },   // Bottom-Right (Sayap Garis Keuangan/Asmara)
  H: { x: -0.5, y: 0.5 },  // Bottom-Left (Sayap Garis Karmic Tail)
  I: { x: -0.5, y: -0.5 }, // Top-Left (Sayap Garis Leluhur Ibu)

  // ─── 3. JEMBATAN INTERNAL (Garis Linier Menuju Pusat E) ───────────
  J: { x: 0, y: -0.5 },  // Jembatan Tengah Atas (A ke E)
  K: { x: 0.5, y: 0 },   // Jembatan Tengah Kanan (B ke E)
  L: { x: 0, y: 0.5 },   // Jembatan Tengah Bawah (C ke E)
  M: { x: -0.5, y: 0 },  // Jembatan Tengah Kiri (D ke E)

  // ─── 4. SATELIT MAKRO TERLUAR (Extended Outer Points) ─────────────
  Q: { x: 0, y: -1.3 },   // Ekstensi Di Atas Titik A
  R: { x: 1.3, y: 0 },    // Ekstensi Di Kanan Titik B
  S: { x: 0, y: 1.3 },    // Ekstensi Di Bawah Titik C
  T: { x: -1.3, y: 0 },   // Ekstensi Di Kiri Titik D

  // ─── 5. KLASTER KARMIC TAIL EXTENSIONS (Penyelamat 3 Titik) ────────
  // Ditempatkan presisi di kuadran bawah-kiri dekat jangkar H dan C
  N: { x: -0.35, y: 0.75 }, // Sub-potensi jembatan karma batin
  O: { x: -0.15, y: 0.95 }, // Satelit bawah penyeimbang karma
  P: { x: -0.5, y: 0.95 },  // Struktur proteksi spiritual luar
};

export const OUTER_OUTLINE: DestinyPointKey[] = [
  'A', 'F', 'B', 'G', 'C', 'H', 'D', 'I', 'A'
];

export const VERTICAL_DIAGONAL: DestinyPointKey[] = [
  'Q', 'A', 'J', 'E', 'L', 'C', 'S'
];

export const HORIZONTAL_DIAGONAL: DestinyPointKey[] = [
  'T', 'D', 'M', 'E', 'K', 'B', 'R'
];
 