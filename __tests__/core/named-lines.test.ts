// __tests__/core/named-lines.test.ts
import { analyzeNamedLines } from '../../src/core/destiny-matrix/analysis/named-lines';
import type { DestinyMatrixPoints, DestinyPoint } from '../../src/core/destiny-matrix/types';

// Mock helper to construct data nodes easily for Jest
function makePoint(key: any, value: number): DestinyPoint {
  return {
    key,
    label: key,
    value,
    arcana: { id: value, name: `Arcana ${value}`, positiveDescription: '', negativeDescription: '' },
    category: 'main'
  };
}

// Generates a clean mock 37-point matrix object for testing isolation
function makeFullPoints(overrides: Partial<DestinyMatrixPoints> = {}): DestinyMatrixPoints {
  const base: Partial<DestinyMatrixPoints> = {};
  const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'M', 'T', 'Money', 'Love', 'LM_Center', 'N', 'O', 'P'];
  
  keys.forEach(k => {
    base[k as any] = makePoint(k, 0);
  });

  // Assign standard seed parameters to match target criteria cleanly
  base.D = makePoint('D', 18);
  base.M = makePoint('M', 9);
  base.T = makePoint('T', 9);

  return { ...base, ...overrides } as DestinyMatrixPoints;
}

describe('analyzeNamedLines — Genuine Ladini Framework Validation', () => {
  
  it('karmicTail.pattern terbentuk dari nilai asli D-M-T', () => {
    // Inject seed variables safely into the lower vertical axis
    const points = makeFullPoints({
      D: makePoint('D', 18),
      M: makePoint('M', 9),
      T: makePoint('T', 9)
    });
    const result = analyzeNamedLines(points);
    expect(result.karmicTail.pattern).toBe('18-9-9');
    expect(result.karmicTail.title).toBe('The Hermit Witchcraft / Fear of Magic (Penyihir Kesendirian & Ketakutan Magis)');
  });

  it('fallback narasi generik saat triplet D-M-T tidak terdaftar di kamus', () => {
    const points = makeFullPoints({
      D: makePoint('D', 2),
      M: makePoint('M', 2),
      T: makePoint('T', 2)
    });
    const result = analyzeNamedLines(points);
    expect(result.karmicTail.title).toBe('Pola Karma (2-2-2)');
  });

  it('loveLine memakai kamus khusus saat nilai Love (P) terdaftar (contoh: 6)', () => {
    // Love line now looks up the dedicated macro Channel point (Love / P)
    const points = makeFullPoints({ Love: makePoint('Love', 6) });
    const result = analyzeNamedLines(points);
    expect(result.loveLine.meaning).toContain('idealisme tinggi');
  });

  it('moneyLine memakai kamus khusus saat nilai Money (O) terdaftar (contoh: 8)', () => {
    // Money line now looks up the dedicated macro Channel point (Money / O)
    const points = makeFullPoints({ Money: makePoint('Money', 8) });
    const result = analyzeNamedLines(points);
    expect(result.moneyLine.meaning).toContain('Karma Keuangan');
  });

  it('karmicTail.points hanya berisi titik yang benar-benar ada (D, M, T non-null)', () => {
    const points = makeFullPoints();
    const result = analyzeNamedLines(points);
    expect(result.karmicTail.points).toHaveLength(3);
    expect(result.karmicTail.points[0].key).toBe('D');
    expect(result.karmicTail.points[1].key).toBe('M');
    expect(result.karmicTail.points[2].key).toBe('T');
  });

  it('field yang hilang (mis. titik D tidak ada) konsisten menangani undefined', () => {
    const points = makeFullPoints();
    // Delete target coordinate safely to ensure defensive check coverage
    delete (points as any).D;
    const result = analyzeNamedLines(points);
    expect(result.loveLine.past).toBeUndefined();
  });
});
 