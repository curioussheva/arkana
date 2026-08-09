// Bagian konstanta MatrixScreen.tsx yang diselaraskan ke point-registry.ts
// (satu sumber kebenaran), menggantikan VALID_37_KEYS/POINT_GROUPS/
// MAIN_POINT_LABELS/GEOMETRIC_KEY_MAP lokal yang sebelumnya hardcode
// terpisah dan tidak konsisten (dobel-hitung J/K/L/M vs A1-D1, dst).

import { POINT_REGISTRY, getMetaFor, type PointDomain } from '@core/destiny-matrix/point-registry';
import { GEOMETRIC_KEY_MAP } from '@core/destiny-matrix/constants';
import type { DestinyPointKey } from '@core/destiny-matrix/types';

const DOMAIN_ORDER: PointDomain[] = [
  'main',
  'ancestral',
  'inner-bridge',
  'channel',
  'companion',
  'timeline',
  'destiny-level',
];

const DOMAIN_LABELS: Partial<Record<PointDomain, string>> = {
  main: 'Pusat',
  ancestral: 'Leluhur',
  'inner-bridge': 'Chakra',
  channel: 'Rezeki',
  companion: 'Pendamping',
  timeline: 'Usia',
  'destiny-level': 'Level Takdir',
};

export const GROUP_DESCRIPTIONS: Record<string, string> = {
  Pusat: 'Pilar getaran utama yang membentuk fondasi cetak biru takdirmu.',
  Leluhur: 'Garis karma dan warisan energi potensial dari silsilah keluarga.',
  Chakra: 'Simpul internal kesehatan fisik, emosional, dan ekspresi spiritual.',
  Rezeki: 'Kanal utama pembuka potensi keuangan, karir, dan takdir asmara.',
  Pendamping: 'Penyangga energi halus penyeimbang setiap node utama.',
  Usia: 'Siklus waktu dan proyeksi periode ujian energi tahunan lingkaran luar.',
  'Level Takdir': '8 Level Takdir & 3 Pusat Kekuatan, hasil sintesis garis Surga-Bumi dan Leluhur.',
};

// Dibangun OTOMATIS dari POINT_REGISTRY (hanya entri canonical, alias
// tidak dihitung dobel) — kalau ada titik baru didaftarkan di registry,
// otomatis muncul di sini tanpa perlu edit manual lagi.
export const POINT_GROUPS: Record<string, DestinyPointKey[]> = DOMAIN_ORDER.reduce(
  (acc, domain) => {
    const groupLabel = DOMAIN_LABELS[domain];
    if (!groupLabel) return acc;
    const keys = POINT_REGISTRY.filter(
      meta => meta.domain === domain && meta.alias === meta.canonical
    ).map(meta => meta.canonical);
    if (keys.length > 0) acc[groupLabel] = keys;
    return acc;
  },
  {} as Record<string, DestinyPointKey[]>
);

// Total titik unik yang valid secara data (BUKAN otomatis berarti semua
// muncul di grafis DestinyDiamond — lihat catatan terpisah).
export const VALID_KEYS: DestinyPointKey[] = Object.values(POINT_GROUPS).flat();

// Label per titik, satu sumber dari point-registry.ts (bukan hardcode
// MAIN_POINT_LABELS terpisah lagi).
export function getPointLabel(key: DestinyPointKey): string {
  const meta = getMetaFor(key)[0];
  return meta?.label ?? String(key);
}

// Tag geometris singkat (untuk badge kecil) — reuse dari constants.ts
// (yang sudah lengkap, termasuk N/O/P dan Level Takdir), bukan peta
// lokal terpisah lagi.
export { GEOMETRIC_KEY_MAP };
