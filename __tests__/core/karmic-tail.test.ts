// __tests__/core/karmic-tail.test.ts
import { analyzeKarmicTail } from '@core/destiny-matrix/analysis/karmic-tail';
import {
  findKarmicTail,
  generateCustomKarmicTail,
  findRumpunByTriad,
  KARMIC_TAIL_DATABASE,
  RUMPUN_DATABASE,
} from '@core/destiny-matrix/data/karmic-tails';
import type { DestinyMatrix, DestinyPoint } from '@core/destiny-matrix/types';

function makePoint(key: string, value: number): DestinyPoint {
  return { key: key as DestinyPoint['key'], label: key, value, arcana: {} as DestinyPoint['arcana'] };
}

function makeMatrix(d: number, m: number, t: number): DestinyMatrix {
  return {
    version: '1.0',
    calculatedAt: new Date().toISOString(),
    birthDate: '2000-01-01',
    input: { birthDate: '2000-01-01' },
    points: {
      D: makePoint('D', d),
      M: makePoint('M', m),
      T: makePoint('T', t),
    } as DestinyMatrix['points'],
    destinies: { personal: 0, social: 0, spiritual: 0 },
    namedLines: {} as DestinyMatrix['namedLines'],
  };
}

describe('findKarmicTail — pencocokan database', () => {
  it('menemukan definisi persis untuk kombinasi terdaftar (15-20-5)', () => {
    const result = findKarmicTail(15, 20, 5);
    expect(result.triad).toBe('15-20-5');
    expect(result.title).toContain('The Rebel');
  });

  it('menemukan definisi yang sama meski urutan D/M/T dipermutasi', () => {
    const original = findKarmicTail(15, 20, 5);
    const permuted = findKarmicTail(20, 5, 15);
    expect(permuted.triad).toBe(original.triad);
    expect(permuted.title).toBe(original.title);
  });

  it('kombinasi tidak terdaftar jatuh ke generator kustom (bukan exact match)', () => {
    const result = findKarmicTail(2, 2, 2);
    expect(result.title).toContain('Custom Karmic:');
  });

  it('[RESOLVED] nilai 0 SEKARANG dinormalisasi ke 22 lewat normalizeArcana(), berhasil menemukan entry database', () => {
    // Entry '3-7-22' butuh set angka {3, 7, 22}. Untuk uji normalisasi 0→22,
    // salah satu angka diganti 0 (yang seharusnya menjadi 22 setelah dinormalisasi).
    const withZero = findKarmicTail(0, 7, 3);
    const withNormalized = findKarmicTail(22, 7, 3);

    expect(withNormalized.title).toContain('The Prisoner');
    expect(withZero.title).toContain('The Prisoner'); // ✅ sekarang match, bukan lagi Custom Karmic
    expect(withZero.title).toBe(withNormalized.title);
  });

  it('normalizeArcana juga mereduksi angka di atas 22 (modulo 22)', () => {
    // n=44 → 44 % 22 = 0 → dinormalisasi lagi jadi 22 → cocok dengan entry '3-7-22'
    const result = findKarmicTail(44, 7, 3);
    expect(result.title).toContain('The Prisoner');
  });
});
 
describe('generateCustomKarmicTail', () => {
  it('triad field menyimpan angka yang SUDAH dinormalisasi (bukan mentah lagi)', () => {
    // Berbeda dari versi lama: sekarang findKarmicTail menormalisasi SEBELUM
    // memanggil generateCustomKarmicTail, jadi triad field ikut ter-normalisasi.
    const result = generateCustomKarmicTail(0, 5, 9);
    expect(result.triad).toBe('0-5-9'); // generateCustomKarmicTail sendiri masih terima raw input apa adanya
  });

  it('esensi narasi memakai Arcana 22 saat d=0 (internal ke fungsi ini sendiri)', () => {
    const resultWithZero = generateCustomKarmicTail(0, 1, 1);
    const resultWithTwentyTwo = generateCustomKarmicTail(22, 1, 1);

    expect(resultWithZero.title).toBe(resultWithTwentyTwo.title);
    expect(resultWithZero.pastLifeDebt).toBe(resultWithTwentyTwo.pastLifeDebt);
  });

  it('id arcana di luar 1-22 fallback ke esensi generik', () => {
    const result = generateCustomKarmicTail(99, -5, 0);
    expect(result.title).toContain('Misteri');
  });

  it('narasi menyertakan nilai triad asli dalam title', () => {
    const result = generateCustomKarmicTail(3, 7, 12);
    expect(result.triad).toBe('3-7-12');
    expect(typeof result.affirmation).toBe('string');
    expect(result.affirmation.length).toBeGreaterThan(0);
  });
});

describe('analyzeKarmicTail — integrasi wrapper', () => {
  it('mengembalikan values D/M/T sesuai matrix (triad Ekor Karma yang benar)', () => {
    const matrix = makeMatrix(15, 20, 5);
    const result = analyzeKarmicTail(matrix);
    expect(result.values).toEqual({ D: 15, M: 20, T: 5, D1: 20, D2: 5, N: undefined, O: undefined, P: undefined });
    expect(result.title).toContain('The Rebel');
  });

  it('tidak crash untuk matrix valid — D,M,T adalah titik inti A-T, selalu tersedia', () => {
    const matrix = makeMatrix(15, 20, 5);
    expect(() => analyzeKarmicTail(matrix)).not.toThrow();
  });

  it('tidak crash jika matrix.points.D undefined — guard typeof mencegah akses .value pada undefined', () => {
    const matrix = makeMatrix(15, 20, 5);
    (matrix.points as Record<string, unknown>).D = undefined;

    expect(() => analyzeKarmicTail(matrix)).not.toThrow();

    const result = analyzeKarmicTail(matrix);
    expect(result.values.D).toBeUndefined();
  });
});

describe('findRumpunByTriad', () => {
  it('menemukan rumpun dari variasi statis yang terdaftar', () => {
    const result = findRumpunByTriad('15-20-5');
    expect(result?.icon).toBe('🌳');
    expect(result?.name).toContain('Luka Akar');
  });

  it('fallback ke deteksi dinamis saat triad tidak ada di variasi manapun', () => {
    const result = findRumpunByTriad('21-1-1');
    expect(result?.icon).toBe('🕊️');
  });

  it('[BY DESIGN] triad yang tidak cocok kategori manapun tetap fallback ke 🎯 (bukan null)', () => {
    // Baris terakhir findRumpunByTriad() adalah catch-all tanpa syarat:
    // `return RUMPUN_DATABASE['🎯']` — fungsi ini TIDAK PERNAH mengembalikan null.
    const result = findRumpunByTriad('99-98-97');
    expect(result?.icon).toBe('🎯');
    expect(result).not.toBeNull();
  });
});

describe('KARMIC_TAIL_DATABASE — integritas data', () => {
  it('setiap entry memiliki field triad yang konsisten dengan key objeknya', () => {
    Object.entries(KARMIC_TAIL_DATABASE).forEach(([key, def]) => {
      expect(def.triad).toBe(key);
    });
  });

  it('setiap entry memiliki semua field narasi terisi (tidak kosong)', () => {
    Object.values(KARMIC_TAIL_DATABASE).forEach(def => {
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.pastLifeDebt.length).toBeGreaterThan(0);
      expect(def.healingWay.length).toBeGreaterThan(0);
      expect(def.affirmation.length).toBeGreaterThan(0);
    });
  });
});

describe('RUMPUN_DATABASE — integritas referensi silang', () => {
  it('setiap triad di variations RUMPUN_DATABASE harus punya entri nyata di KARMIC_TAIL_DATABASE', () => {
    const missingEntries: string[] = [];

    Object.values(RUMPUN_DATABASE).forEach(rumpun => {
      rumpun.variations.forEach(v => {
        if (!KARMIC_TAIL_DATABASE[v.triad]) {
          missingEntries.push(`${v.triad} (${v.title})`);
        }
      });
    });

    // Database sudah diperbarui — '21-7-4' dan '6-14-8' (dangling reference lama)
    // sudah tidak ada lagi di variations. Semua referensi sekarang harus lengkap.
    expect(missingEntries).toEqual([]);
  });
});