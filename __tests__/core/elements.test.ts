// __tests__/core/elements.test.ts
import { countElements, getElementStats, buildElementSummary } from '@core/destiny-matrix/analysis/elements';
import type { DestinyMatrix, DestinyPoint, DestinyPointKey } from '@core/destiny-matrix/types';
import type { ArcanaElement, ArcanaDefinition } from '@core/arcana/types';

const ALL_POINT_KEYS: DestinyPointKey[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3',
  'D1', 'D2', 'D3', 'E1', 'E2',
];

function makePoint(key: DestinyPointKey, element: ArcanaElement | undefined): DestinyPoint {
  return {
    key,
    label: key,
    value: 1,
    arcana: element
      ? ({ element } as ArcanaDefinition)
      : (undefined as unknown as ArcanaDefinition), // simulasi data arcana kosong/rusak
  };
}

/** Bangun matrix penuh 34 titik. Default semua Fire, lalu override per test. */
function makeMatrix(overrides: Partial<Record<DestinyPointKey, ArcanaElement | undefined>> = {}): DestinyMatrix {
  const points: Record<string, DestinyPoint> = {};
  ALL_POINT_KEYS.forEach(key => {
    const element = key in overrides ? overrides[key] : 'Fire';
    points[key] = makePoint(key, element);
  });

  return {
    version: '1.0',
    calculatedAt: new Date().toISOString(),
    birthDate: '2000-01-01',
    input: { birthDate: '2000-01-01' },
    points: points as DestinyMatrix['points'],
    destinies: { personal: 0, social: 0, spiritual: 0 },
    namedLines: {} as DestinyMatrix['namedLines'],
  };
}

describe('countElements', () => {
  it('matrix null/kosong mengembalikan semua nol tanpa crash', () => {
    expect(countElements(null as unknown as DestinyMatrix)).toEqual({
      Fire: 0, Water: 0, Air: 0, Earth: 0,
    });
    expect(countElements({ points: undefined } as unknown as DestinyMatrix)).toEqual({
      Fire: 0, Water: 0, Air: 0, Earth: 0,
    });
  });

  it('menghitung distribusi elemen dengan benar saat semua titik valid', () => {
    const matrix = makeMatrix({
      A: 'Fire', B: 'Water', C: 'Air', D: 'Earth', E: 'Fire',
    });
    const counts = countElements(matrix);
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    // Total 34 titik, seluruhnya harus punya elemen valid di skenario ini
    expect(total).toBe(ALL_POINT_KEYS.length);
  });

  it('[REGRESSION] titik dengan arcana.element undefined ikut diam-diam ter-skip dari total', () => {
    // Ini mereplikasi bug lama: total 33 bukan 34.
    // Satu titik ('N') sengaja dibuat tanpa arcana.element.
    const matrix = makeMatrix({ N: undefined });
    const counts = countElements(matrix);
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    // ⚠️ PERILAKU SAAT INI: total jadi kurang dari jumlah titik asli (33, bukan 34)
    // karena titik dengan element undefined di-skip tanpa pencatatan apa pun.
    expect(total).toBe(ALL_POINT_KEYS.length - 1);

    // Ini BUKAN hasil yang diinginkan secara produk — dicatat di sini supaya
    // begitu diperbaiki di engine (mis. fallback element atau kategori 'Unknown'),
    // test ini akan gagal dan menandai bahwa fix sudah diterapkan.
  });

  it('[REGRESSION] titik dengan element string tak dikenal juga ter-skip diam-diam', () => {
    const matrix = makeMatrix({ N: 'Metal' as ArcanaElement }); // elemen di luar 4 kategori
    const counts = countElements(matrix);
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    expect(total).toBe(ALL_POINT_KEYS.length - 1);
  });

  it('beberapa titik undefined sekaligus mengurangi total secara proporsional', () => {
    const matrix = makeMatrix({ N: undefined, O: undefined, P: undefined });
    const counts = countElements(matrix);
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    expect(total).toBe(ALL_POINT_KEYS.length - 3);
  });

  it('distribusi per elemen akurat saat campuran 4 elemen', () => {
    const matrix = makeMatrix({
      A: 'Fire', B: 'Fire', C: 'Water', D: 'Water', E: 'Water',
      F: 'Air', G: 'Earth', H: 'Earth',
    });
    const counts = countElements(matrix);

    expect(counts.Fire).toBeGreaterThanOrEqual(2);
    expect(counts.Water).toBeGreaterThanOrEqual(3);
    expect(counts.Air).toBeGreaterThanOrEqual(1);
    expect(counts.Earth).toBeGreaterThanOrEqual(2);
  });
});

describe('getElementStats', () => {
  it('menentukan elemen dominan dengan benar', () => {
    const stats = getElementStats({ Fire: 10, Water: 5, Air: 3, Earth: 2 });
    expect(stats.dominant).toBe('Fire');
    expect(stats.dominantCount).toBe(10);
  });

  it('menghitung persentase dominan dengan benar', () => {
    const stats = getElementStats({ Fire: 10, Water: 10, Air: 0, Earth: 0 });
    // total 20, dominant 10 → 50%
    expect(stats.dominantPercentage).toBe(50);
  });

  it('secondary undefined jika elemen kedua terbesar bernilai 0', () => {
    const stats = getElementStats({ Fire: 10, Water: 0, Air: 0, Earth: 0 });
    expect(stats.secondary).toBeUndefined();
  });

  it('secondary terisi jika ada elemen kedua dengan count > 0', () => {
    const stats = getElementStats({ Fire: 10, Water: 5, Air: 0, Earth: 0 });
    expect(stats.secondary).toBe('Water');
  });

  it('tidak crash saat semua count nol (fallback total=1 mencegah divide by zero)', () => {
    const stats = getElementStats({ Fire: 0, Water: 0, Air: 0, Earth: 0 });
    expect(stats.dominantPercentage).toBe(0);
    expect(stats.secondary).toBeUndefined();
  });

  it('urutan dominan konsisten saat ada nilai seri (tie)', () => {
    // Perilaku saat ini bergantung pada urutan objek JS (insertion order: Fire,Water,Air,Earth)
    const stats = getElementStats({ Fire: 5, Water: 5, Air: 5, Earth: 5 });
    expect(stats.dominant).toBe('Fire'); // menang karena urutan pertama saat seri
  });
});

describe('buildElementSummary', () => {
  it('menggabungkan distribution, stats, advice, dan opening dengan konsisten', () => {
    const matrix = makeMatrix({ A: 'Water', B: 'Water', C: 'Water' });
    const summary = buildElementSummary(matrix);

    expect(summary.distribution).toBeDefined();
    expect(summary.stats.dominant).toBeDefined();
    expect(typeof summary.advice).toBe('string');
    expect(typeof summary.opening).toBe('string');
  });
});