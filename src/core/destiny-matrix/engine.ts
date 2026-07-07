// src/core/destiny-matrix/engine.ts
import { getArkanaByNumber } from '../numerology/arkana';
import { reduceToArcana, parseBirthDate, sumDigits } from './utils';
import { analyzeNamedLines } from './lines';
import type {
  DestinyMatrix,
  DestinyMatrixInput,
  DestinyMatrixPoints,
  DestinyPoint,
  DestinyPointKey,
} from './types';

const POINT_LABELS: Record<DestinyPointKey, string> = {
  A: 'Hari Lahir (Karakter/Mental)',
  B: 'Bulan Lahir (Spiritual/Malaikat Pelindung)',
  C: 'Garis Keturunan (Masa Lalu/Tantangan Keuangan)',
  D: 'Sintesis Pertama (Karmic Tail/Pintu Masuk Karma)',
  E: 'Titik Pusat (Esensi Jiwa / Zona Nyaman)',
  F: 'Zona Nyaman Keturunan Atas-Kiri',
  G: 'Zona Sosial Keturunan Atas-Kanan',
  H: 'Zona Tantangan Keturunan Bawah-Kanan',
  I: 'Zona Keseimbangan Keturunan Bawah-Kiri',
  J: 'Bakat Tersembunyi (Titik Tengah A-E)',
  K: 'Kekuatan Batin (Titik Tengah B-E)',
  L: 'Potensi Spiritual (Titik Tengah C-E)',
  M: 'Arah Perkembangan (Titik Tengah D-E)',
  
  // Extended diagonal makro points
  N: 'Ekstensi Keturunan I',
  O: 'Ekstensi Keturunan II',
  P: 'Ekstensi Keturunan III',
  Q: 'Ekstensi Kepribadian',
  R: 'Ekstensi Tujuan Hidup',
  S: 'Ekstensi Garis Keturunan',
  T: 'Ekstensi Sintesis',

  // Sub-titik untuk visualisasi garis energi yang lebih presisi
  A1: 'Ekstensi Jalur Karakter I (A - J)',
  A2: 'Ekstensi Jalur Karakter II (J - E)',
  A3: 'Titik Sinkronisasi Karakter-Jiwa',
  B1: 'Ekstensi Jalur Spiritual I (B - K)',
  B2: 'Ekstensi Jalur Spiritual II (K - E)',
  B3: 'Titik Sinkronisasi Spiritual-Jiwa',
  C1: 'Ekstensi Jalur Finansial I (C - L)',
  C2: 'Ekstensi Jalur Finansial II (L - E)',
  C3: 'Titik Sinkronisasi Finansial-Jiwa',
  D1: 'Ekstensi Jalur Karma I (D - M)',
  D2: 'Ekstensi Jalur Karma II (M - E)',
  D3: 'Titik Sinkronisasi Karma-Jiwa',
  E1: 'Aspek Makro Komunita (A + B)',
  E2: 'Aspek Makro Materi (C + D)',
};

function buildPoint(key: DestinyPointKey, value: number): DestinyPoint {
  return {
    key,
    label: POINT_LABELS[key],
    value,
    // OPTIMASI: value dikirim langsung karena sudah dibungkus reduceToArcana pada saat kalkulasi
    arcana: getArkanaByNumber(value), 
  };
}

export class DestinyMatrixEngine {
  calculate(input: DestinyMatrixInput): DestinyMatrix {
    const date = parseBirthDate(input.birthDate);

    // 1. Poin Utama (Sudut Luar Oktahedron dan Pusat)
    const A = reduceToArcana(date.day);
    const B = reduceToArcana(date.month);
    const C = reduceToArcana(sumDigits(date.year));
    const D = reduceToArcana(A + B + C);
    const E = reduceToArcana(A + B + C + D);

    // 2. Poin Sudut Diagonal Matriks Leluhur
    const F = reduceToArcana(A + B);
    const G = reduceToArcana(B + C);
    const H = reduceToArcana(C + D);
    const I = reduceToArcana(D + A);

    // 3. Poin Tengah (Jembatan Menuju Pusat E)
    const J = reduceToArcana(A + E);
    const K = reduceToArcana(B + E);
    const L = reduceToArcana(C + E);
    const M = reduceToArcana(D + E);

    // 4. Garis Diagonal Makro & Ekstensi Luar
    const N = reduceToArcana(M + L);
    const O = reduceToArcana(M + N);
    const P = reduceToArcana(L + N);
    const Q = reduceToArcana(A + J);
    const R = reduceToArcana(B + K);
    const S = reduceToArcana(C + L);
    const T = reduceToArcana(D + M);

    // 5. REFACTOR RUMUS: Sub-titik Aliran Garis Energi Energi (Menghindari Duplikasi Q, R, S, T)
    const A1 = reduceToArcana(A + Q); // Sub-jalur antara Sudut Luar dan Ekstensi
    const A2 = reduceToArcana(J + E); // Jalur antara Tengah dan Pusat
    const A3 = reduceToArcana(Q + J); // Penengah transisi

    const B1 = reduceToArcana(B + R);
    const B2 = reduceToArcana(K + E);
    const B3 = reduceToArcana(R + K);

    const C1 = reduceToArcana(C + S);
    const C2 = reduceToArcana(L + E);
    const C3 = reduceToArcana(S + L);

    const D1 = reduceToArcana(D + T);
    const D2 = reduceToArcana(M + E);
    const D3 = reduceToArcana(T + M);

    const E1 = reduceToArcana(F + G); // Garis Langit Leluhur
    const E2 = reduceToArcana(H + I); // Garis Bumi Leluhur

    // 6. TUJUAN HIDUP TIGA TAHAP (Esoteris Destiny Matrix)
    const personalDestiny = reduceToArcana(E1 + E2); // Umur 20 - 40 tahun
    const socialDestiny = reduceToArcana(A + B + C + D); // Umur 40 - 60 tahun (Sama dengan D total makro)
    const spiritualDestiny = reduceToArcana(personalDestiny + socialDestiny); // Di atas 60 tahun

    const points: DestinyMatrixPoints = {
      A: buildPoint('A', A), B: buildPoint('B', B), C: buildPoint('C', C),
      D: buildPoint('D', D), E: buildPoint('E', E),
      F: buildPoint('F', F), G: buildPoint('G', G),
      H: buildPoint('H', H), I: buildPoint('I', I),
      J: buildPoint('J', J), K: buildPoint('K', K),
      L: buildPoint('L', L), M: buildPoint('M', M),
      N: buildPoint('N', N), O: buildPoint('O', O), P: buildPoint('P', P),
      Q: buildPoint('Q', Q), R: buildPoint('R', R),
      S: buildPoint('S', S), T: buildPoint('T', T),
      A1: buildPoint('A1', A1), A2: buildPoint('A2', A2), A3: buildPoint('A3', A3),
      B1: buildPoint('B1', B1), B2: buildPoint('B2', B2), B3: buildPoint('B3', B3),
      C1: buildPoint('C1', C1), C2: buildPoint('C2', C2), C3: buildPoint('C3', C3),
      D1: buildPoint('D1', D1), D2: buildPoint('D2', D2), D3: buildPoint('D3', D3),
      E1: buildPoint('E1', E1), E2: buildPoint('E2', E2),
    };

    return {
      version: '1.4.0',
      calculatedAt: new Date().toISOString(),
      input,
      points,
      destinies: {
        personal: personalDestiny,
        social: socialDestiny,
        spiritual: spiritualDestiny,
      },
      namedLines: analyzeNamedLines(points),
    };
  }
}

// Singleton Pattern
let defaultEngine: DestinyMatrixEngine | null = null;

export function getDestinyMatrixEngine(): DestinyMatrixEngine {
  if (!defaultEngine) defaultEngine = new DestinyMatrixEngine();
  return defaultEngine;
}

export function resetDestinyMatrixEngine(): void {
  defaultEngine = null;
}
