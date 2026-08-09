// src/core/destiny-matrix/layout.ts

export interface PointCoordinate {
  x: number;
  y: number;
}

/**
 * Standard Destiny Matrix SVG Angular Mapping (Pakem Natalia Ladini):
 * - 180° = Left   (Node A - Umur 0 / 80)
 * - 270° = Top    (Node B - Umur 20)
 * - 0°   = Right  (Node C - Umur 40)
 * - 90°  = Bottom (Node D - Umur 60)
 *
 * Karena SVG Y-axis mengarah ke bawah, Y di-negasikan (-sin) agar:
 * 270° berada di ATAS, 90° berada di BAWAH.
 */
function polarToCartesian(deg: number, r: number): PointCoordinate {
  const rad = (deg * Math.PI) / 180;
  // Standard SVG Cartesian adjustment:
  // Math.cos untuk X, Math.sin untuk Y (dikali -1 karena Y-axis SVG tumbuh ke bawah)
  const rawX = r * Math.cos(rad);
  const rawY = -r * Math.sin(rad);

  const cleanX = Math.abs(rawX) < 1e-6 ? 0 : Number(rawX.toFixed(4));
  const cleanY = Math.abs(rawY) < 1e-6 ? 0 : Number(rawY.toFixed(4));

  return { x: cleanX, y: cleanY };
}

// Titik tengah linear di antara dua koordinat MENTAH (bukan polar) — dipakai
// untuk tick timeline yang harus duduk persis di SISI LURUS oktagon, bukan
// di lingkaran (yang akan menggembung keluar di titik tengah tiap sisi,
// karena tali busur lurus selalu sedikit di dalam lingkaran kecuali di
// kedua ujungnya/vertex).
function edgeMidpoint(a: PointCoordinate, b: PointCoordinate): PointCoordinate {
  return {
    x: Number(((a.x + b.x) / 2).toFixed(4)),
    y: Number(((a.y + b.y) / 2).toFixed(4)),
  };
}

export const LAYOUT_RADII = {
  CENTER: 0,
  INNER: 0.68,       // Jembatan Chakra Dalam (J-M / A1..I1)
  LM_CHANNEL: 0.38,  // Saluran Uang & Cinta (Kanan-Bawah) — N/O/P
  SUB_INNER: 0.81,   // Sub-nodes (Q-T / SubA..SubI)
  MAIN: 0.98,        // Sudut Utama Matriks (posisi NODE, bukan garis oktagon)
  OCTAGON_BORDER: 1.10, // Garis rangka oktagon luar — SENGAJA lebih besar dari
                        // MAIN, supaya ada celah antara tepi node dan garis
                        // untuk ruang ruler timeline (lihat referensi Ladini)
  TIMELINE: 1.10,    // Lingkaran Umur Luar — SAMA dengan OCTAGON_BORDER karena
                     // ruler timeline memang ditempatkan menempel di garis
                     // oktagon (bukan cincin terpisah).
} as const;

// ─── OKTAGON BORDER (garis rangka luar) ──────────────────
// Radius sengaja BEDA dari posisi node A/B/C/D/F/G/H/I (LAYOUT_RADII.MAIN)
// supaya ada celah untuk ruler timeline di antara tepi node dan garis ini.
// Sudut sama persis dengan node A,F,B,G,C,H,D,I — cuma radiusnya lebih jauh.
// Didefinisikan SEBELUM POINT_LAYOUT karena dipakai untuk menghitung posisi
// tick timeline yang duduk di tengah sisi (lihat edgeMidpoint di bawah).
export const OCTAGON_BORDER_LAYOUT: Record<string, PointCoordinate> = {
  A: polarToCartesian(180, LAYOUT_RADII.OCTAGON_BORDER),
  F: polarToCartesian(135, LAYOUT_RADII.OCTAGON_BORDER),
  B: polarToCartesian(90,  LAYOUT_RADII.OCTAGON_BORDER),
  G: polarToCartesian(45,  LAYOUT_RADII.OCTAGON_BORDER),
  C: polarToCartesian(0,   LAYOUT_RADII.OCTAGON_BORDER),
  H: polarToCartesian(315, LAYOUT_RADII.OCTAGON_BORDER),
  D: polarToCartesian(270, LAYOUT_RADII.OCTAGON_BORDER),
  I: polarToCartesian(225, LAYOUT_RADII.OCTAGON_BORDER),
};

export const POINT_LAYOUT: Record<string, PointCoordinate> = {
  // ─── 1. CENTER NODE ───────────────────────────────────
  E: { x: 0, y: 0 },

  // ─── 2. PERSONAL SQUARE (Searah Jarum Jam) ─────────────
  A: polarToCartesian(180, LAYOUT_RADII.MAIN), // 0y  = Kiri (12)
  B: polarToCartesian(90,  LAYOUT_RADII.MAIN), // 20y = Atas (8)
  C: polarToCartesian(0,   LAYOUT_RADII.MAIN), // 40y = Kanan (21)
  D: polarToCartesian(270, LAYOUT_RADII.MAIN), // 60y = Bawah (5)

  // ─── 3. ANCESTRAL SQUARE (Diagonal Silsilah) ───────────
  F: polarToCartesian(135, LAYOUT_RADII.MAIN), // 10y Male Top-Left (20)
  G: polarToCartesian(45,  LAYOUT_RADII.MAIN), // 30y Female Top-Right (11)
  H: polarToCartesian(315, LAYOUT_RADII.MAIN), // 50y Male Bottom-Right (8)
  I: polarToCartesian(225, LAYOUT_RADII.MAIN), // 70y Female Bottom-Left (17)

  // ─── 4. CHAKRA BRIDGES (kanonik J-M, alias A1-D1) ──────
  // J/K/L/M dan A1/B1/C1/D1 adalah TITIK YANG SAMA (dua nama untuk
  // satu nilai — lihat point-registry.ts). Koordinatnya sengaja sama.
  J: polarToCartesian(180, LAYOUT_RADII.INNER),
  K: polarToCartesian(90,  LAYOUT_RADII.INNER),
  L: polarToCartesian(0,   LAYOUT_RADII.INNER),
  M: polarToCartesian(270, LAYOUT_RADII.INNER),
  A1: polarToCartesian(180, LAYOUT_RADII.INNER),
  B1: polarToCartesian(90,  LAYOUT_RADII.INNER),
  C1: polarToCartesian(0,   LAYOUT_RADII.INNER),
  D1: polarToCartesian(270, LAYOUT_RADII.INNER),

  F1: polarToCartesian(135, LAYOUT_RADII.INNER),
  G1: polarToCartesian(45,  LAYOUT_RADII.INNER),
  H1: polarToCartesian(315, LAYOUT_RADII.INNER),
  I1: polarToCartesian(225, LAYOUT_RADII.INNER),

  // ─── 5. COMPANION SUB-NODES (kanonik Q-T, alias SubA-SubD) ─
  // Q/R/S/T dan SubA/SubB/SubC/SubD juga titik yang sama (lihat
  // calculateMacroPoints: companion.SubA = macro.Q, dst).
  Q: polarToCartesian(180, LAYOUT_RADII.SUB_INNER),
  R: polarToCartesian(90,  LAYOUT_RADII.SUB_INNER),
  S: polarToCartesian(0,   LAYOUT_RADII.SUB_INNER),
  T: polarToCartesian(270, LAYOUT_RADII.SUB_INNER),
  SubA: polarToCartesian(180, LAYOUT_RADII.SUB_INNER),
  SubB: polarToCartesian(90,  LAYOUT_RADII.SUB_INNER),
  SubC: polarToCartesian(0,   LAYOUT_RADII.SUB_INNER),
  SubD: polarToCartesian(270, LAYOUT_RADII.SUB_INNER),

  SubF: polarToCartesian(135, LAYOUT_RADII.SUB_INNER),
  SubG: polarToCartesian(45,  LAYOUT_RADII.SUB_INNER),
  SubH: polarToCartesian(315, LAYOUT_RADII.SUB_INNER),
  SubI: polarToCartesian(225, LAYOUT_RADII.SUB_INNER),

  // ─── 6. LOVE & MONEY CHANNEL (kanonik N/O/P, alias LM_Center/Love/Money) ───
  // Kuadran Kanan-Bawah: 270° s/d 360°.
  // N=LM_Center, O=Love, P=Money — sama nilai (lihat point-registry.ts).
  N: polarToCartesian(315, LAYOUT_RADII.LM_CHANNEL),
  LM_Center: polarToCartesian(315, LAYOUT_RADII.LM_CHANNEL * 1.10),

  P: polarToCartesian(335, LAYOUT_RADII.LM_CHANNEL * 1.15), // Bergeser ke arah C (Kanan)
  Money: polarToCartesian(335, LAYOUT_RADII.LM_CHANNEL * 1.15),

  O: polarToCartesian(295, LAYOUT_RADII.LM_CHANNEL * 1.15), // Bergeser ke arah D (Bawah)
  Love: polarToCartesian(295, LAYOUT_RADII.LM_CHANNEL * 1.15),

  // ─── 7. TIMELINE POINTS ────────────────────────────────
  // Tick yang SUDUTNYA SAMA dengan vertex oktagon (T10=F, T20=B, T30=G,
  // T40=C, T50=H, T60=D, T70=I) — polar biasa sudah benar, karena vertex
  // memang ada di lingkaran radius OCTAGON_BORDER/TIMELINE.
  T10: polarToCartesian(135, LAYOUT_RADII.TIMELINE),
  T20: polarToCartesian(90,  LAYOUT_RADII.TIMELINE),
  T30: polarToCartesian(45,  LAYOUT_RADII.TIMELINE),
  T40: polarToCartesian(0,   LAYOUT_RADII.TIMELINE),
  T50: polarToCartesian(315, LAYOUT_RADII.TIMELINE),
  T60: polarToCartesian(270, LAYOUT_RADII.TIMELINE),
  T70: polarToCartesian(225, LAYOUT_RADII.TIMELINE),

  // Tick di TENGAH SISI (T15, T25, T35, T45, T55, T65, T75) — HARUS pakai
  // interpolasi linear di sisi lurus oktagon (edgeMidpoint), BUKAN
  // polarToCartesian, supaya benar-benar nempel di garis, tidak menggembung
  // keluar. Ini fix utama sesi ini.
  T15: edgeMidpoint(OCTAGON_BORDER_LAYOUT.F, OCTAGON_BORDER_LAYOUT.B),
  T25: edgeMidpoint(OCTAGON_BORDER_LAYOUT.B, OCTAGON_BORDER_LAYOUT.G),
  T35: edgeMidpoint(OCTAGON_BORDER_LAYOUT.G, OCTAGON_BORDER_LAYOUT.C),
  T45: edgeMidpoint(OCTAGON_BORDER_LAYOUT.C, OCTAGON_BORDER_LAYOUT.H),
  T55: edgeMidpoint(OCTAGON_BORDER_LAYOUT.H, OCTAGON_BORDER_LAYOUT.D),
  T65: edgeMidpoint(OCTAGON_BORDER_LAYOUT.D, OCTAGON_BORDER_LAYOUT.I),
  T75: edgeMidpoint(OCTAGON_BORDER_LAYOUT.I, OCTAGON_BORDER_LAYOUT.A),
};

// ─── PETA GARIS STRUKTURAL ───────────────────────────────
export const OUTER_OUTLINE = ['A', 'B', 'C', 'D'] as const;
export const ANCESTRAL_OUTLINE = ['F', 'G', 'H', 'I'] as const;
export const HORIZONTAL_DIAGONAL = ['A', 'C'] as const;
export const VERTICAL_DIAGONAL = ['B', 'D'] as const;

// Male Generation Line: Dari Kiri-Atas (F: 225°) ke Kanan-Bawah (H: 45°)
export const MALE_GENERATION_LINE = ['F', 'H'] as const;
// Female Generation Line: Dari Kiri-Bawah (I: 135°) ke Kanan-Atas (G: 315°)
export const FEMALE_GENERATION_LINE = ['G', 'I'] as const;

export const TIMELINE_AGE_LABELS: Record<string, string> = {
  A: '0y / 80y',
  T10: '10y',
  T15: '15y',
  T20: '20y',
  T25: '25y',
  T30: '30y',
  T35: '35y',
  T40: '40y',
  T45: '45y',
  T50: '50y',
  T55: '55y',
  T60: '60y',
  T65: '65y',
  T70: '70y',
  T75: '75y',
};
 