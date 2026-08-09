// __tests__/core/yin-yang.test.ts
import { analyzeYinYang } from '@core/destiny-matrix/analysis/yin-yang';
import type { DestinyMatrix, DestinyPoint, DestinyPointKey } from '@core/destiny-matrix/types';

function makePoint(key: string, value: number): DestinyPoint {
  return { key: key as DestinyPointKey, label: key, value, arcana: {} as DestinyPoint['arcana'] };
}

function makeMatrix(values: number[]): DestinyMatrix {
  const points: Record<string, DestinyPoint> = {};
  values.forEach((v, i) => {
    points[`P${i}`] = makePoint(`P${i}`, v);
  });
  return {
    version: '1.0',
    calculatedAt: new Date().toISOString(),
    birthDate: '2000-01-01',
    input: { birthDate: '2000-01-01' },
    points: points as unknown as DestinyMatrix['points'],
    destinies: { personal: 0, social: 0, spiritual: 0 },
    namedLines: {} as DestinyMatrix['namedLines'],
  };
}

describe('analyzeYinYang', () => {
  it('[REGRESSION] crash jika matrix null (tidak ada guard seperti fungsi lain)', () => {
    // ⚠️ Berbeda dari countElements() yang punya guard `if (!matrix || !matrix.points)`,
    // fungsi ini TIDAK punya guard serupa. Memanggilnya dengan matrix null akan crash.
    expect(() => analyzeYinYang(null as unknown as DestinyMatrix)).toThrow();
  });

  it('[REGRESSION] crash jika matrix.points undefined', () => {
    const matrix = { points: undefined } as unknown as DestinyMatrix;
    expect(() => analyzeYinYang(matrix)).toThrow();
  });

  it('semua titik bernilai 0 (atau matrix points kosong) mengembalikan Balanced 50/50', () => {
    const matrix = makeMatrix([0, 0, 0]);
    const result = analyzeYinYang(matrix);
    expect(result.dominant).toBe('Balanced');
    expect(result.yinPercentage).toBe(50);
    expect(result.yangPercentage).toBe(50);
  });

  it('object points kosong sama sekali mengembalikan Balanced 50/50', () => {
    const matrix = makeMatrix([]);
    const result = analyzeYinYang(matrix);
    expect(result.dominant).toBe('Balanced');
  });

  it('mayoritas angka ganjil (Yang) menghasilkan dominant Yang', () => {
    // 8 ganjil, 2 genap → yangPercentage 80% > 55%
    const matrix = makeMatrix([1, 3, 5, 7, 9, 11, 13, 15, 2, 4]);
    const result = analyzeYinYang(matrix);
    expect(result.dominant).toBe('Yang');
    expect(result.archetype).toContain('Dynamic Doer');
  });

  it('mayoritas angka genap (Yin) menghasilkan dominant Yin', () => {
    // 8 genap, 2 ganjil → yangPercentage 20% → yinPercentage 80% > 55%
    const matrix = makeMatrix([2, 4, 6, 8, 10, 12, 14, 16, 1, 3]);
    const result = analyzeYinYang(matrix);
    expect(result.dominant).toBe('Yin');
    expect(result.archetype).toContain('Intuitive Reflector');
  });

  it('distribusi 50/50 tepat menghasilkan Balanced', () => {
    const matrix = makeMatrix([1, 3, 5, 7, 2, 4, 6, 8]); // 4 ganjil, 4 genap
    const result = analyzeYinYang(matrix);
    expect(result.yangPercentage).toBe(50);
    expect(result.dominant).toBe('Balanced');
  });

  it('[BOUNDARY] persis 55% Yang TIDAK dianggap dominan (memakai operator > bukan >=)', () => {
    // 11 dari 20 nilai ganjil = persis 55%
    const values = [
      1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, // 11 ganjil
      2, 4, 6, 8, 10, 12, 14, 16, 18, // 9 genap
    ];
    const matrix = makeMatrix(values);
    const result = analyzeYinYang(matrix);
    expect(result.yangPercentage).toBe(55);
    // ⚠️ Karena kondisinya `> 55` bukan `>= 55`, hasil tepat 55% jatuh ke Balanced,
    // bukan Yang — meski secara intuitif user mungkin mengharapkan ini "condong Yang".
    expect(result.dominant).toBe('Balanced');
  });

  it('56% Yang (satu langkah di atas boundary) baru dianggap dominan Yang', () => {
    const values = [
      1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, // 12 ganjil
      2, 4, 6, 8, 10, 12, 14, 16, 18, // 9 genap
    ]; // total 21, 12/21 = 57.1% → dibulatkan
    const matrix = makeMatrix(values);
    const result = analyzeYinYang(matrix);
    expect(result.yangPercentage).toBeGreaterThan(55);
    expect(result.dominant).toBe('Yang');
  });

  it('titik dengan value 0 tidak ikut dihitung dalam total (difilter keluar)', () => {
    const matrix = makeMatrix([1, 3, 0, 0, 0]); // hanya 2 nilai valid, keduanya ganjil
    const result = analyzeYinYang(matrix);
    expect(result.yangPercentage).toBe(100);
    expect(result.dominant).toBe('Yang');
  });

  it('yinPercentage dan yangPercentage selalu berjumlah 100', () => {
    const matrix = makeMatrix([1, 2, 3, 4, 5, 6, 7]);
    const result = analyzeYinYang(matrix);
    expect(result.yinPercentage + result.yangPercentage).toBe(100);
  });
});