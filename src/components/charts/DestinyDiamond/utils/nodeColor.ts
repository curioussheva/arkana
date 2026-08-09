// src/components/charts/DestinyDiamond/utils/nodeColor.ts

export type LegendCategory = 'element' | 'chakra' | 'planet' | 'zodiac';

// Tipe untuk atribut arcana
export interface ArcanaAttributes {
  element?: string;
  chakra?: string;
  planet?: string;
  zodiac?: string;
}

// ─── CHAKRA BERBASIS POSISI (bukan atribut Arcana) ─────────────────────
// Hanya satu definisi, lengkap.
export const POSITION_CHAKRA_MAP: Record<string, string> = {
  // Garis Langit (vertikal B-E-D)
  B: 'Sahasrara',
  R: 'Ajna',
  K: 'Vishuddha',
  E: 'Manipura',
  HeartDesireSpiritual: 'Anahata',
  M: 'Svadhisthana',
  D: 'Muladhara',
  // Garis Bumi (horizontal A-E-C)
  A: 'Sahasrara',
  Q: 'Ajna',
  J: 'Vishuddha',
  HeartDesirePhysical: 'Anahata',
  L: 'Svadhisthana',
  C: 'Muladhara',
};

// Urutan tetap 7 chakra (untuk legend)
export const CHAKRA_ROLE_ORDER = [
  'Sahasrara', 'Ajna', 'Vishuddha', 'Anahata', 'Manipura', 'Svadhisthana', 'Muladhara',
];

// Konvensi warna chakra
const CHAKRA_COLORS: Record<string, string> = {
  root: '#DC2626',
  muladhara: '#DC2626',
  sacral: '#EA580C',
  svadhisthana: '#EA580C',
  'solar plexus': '#EAB308',
  solarplexus: '#EAB308',
  manipura: '#EAB308',
  heart: '#16A34A',
  anahata: '#16A34A',
  throat: '#2563EB',
  vishudha: '#2563EB',
  'third eye': '#4F46E5',
  thirdeye: '#4F46E5',
  ajna: '#4F46E5',
  crown: '#7C3AED',
  sahasrara: '#7C3AED',
};

// Hash string -> hue deterministik
function hashStringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function autoColor(value: string): string {
  const hue = hashStringToHue(value.toLowerCase());
  return `hsl(${hue}, 65%, 55%)`;
}

// ─── Konversi warna ──────────────────────────────────────────────────────
function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function parseHslString(str: string): [number, number, number] | null {
  const match = str.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
}

function toHsl(color: string): [number, number, number] {
  if (color.startsWith('hsl')) {
    return parseHslString(color) ?? [0, 0, 50];
  }
  if (color.startsWith('#')) {
    return hexToHsl(color);
  }
  return [0, 0, 50];
}

// ─── Resolusi warna kategori ─────────────────────────────────────────────
export function resolveCategoryColor(
  category: LegendCategory,
  value: string | undefined,
  elementsPalette: Record<string, string> | undefined,
  fallback: string
): string {
  if (!value) return fallback;
  const key = value.toLowerCase();
  if (category === 'element') {
    return elementsPalette?.[key] ?? autoColor(value);
  }
  if (category === 'chakra') {
    return CHAKRA_COLORS[key] ?? autoColor(value);
  }
  return autoColor(value);
}

export interface CategoryColorShades {
  base: string;
  light: string;
  dark: string;
  textColor: string;
}

export function resolveCategoryColorShades(
  category: LegendCategory,
  value: string | undefined,
  elementsPalette: Record<string, string> | undefined,
  fallback: string
): CategoryColorShades {
  const base = resolveCategoryColor(category, value, elementsPalette, fallback);
  const [h, s, l] = toHsl(base);
  const textColor = l + 18 > 58 ? '#1A1500' : '#FFFFFF';
  return {
    base,
    light: `hsl(${h}, ${s}%, ${Math.min(80, l + 18)}%)`,
    dark: `hsl(${h}, ${s}%, ${Math.max(18, l - 18)}%)`,
    textColor,
  };
}

// Fungsi ini hanya berguna jika dipakai; jika tidak, hapus.
// Saya perbaiki tipenya.
export function getCategoryValueForNode(
  category: LegendCategory,
  key: string,
  arcana: ArcanaAttributes | undefined,
  extract: ((arcana: ArcanaAttributes) => string | undefined) | undefined
): string | undefined {
  if (category === 'chakra') {
    return POSITION_CHAKRA_MAP[key];
  }
  return arcana && extract ? extract(arcana) : undefined;
}