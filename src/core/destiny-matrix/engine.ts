// src/core/destiny-matrix/engine.ts

import { parseBirthDate } from './utils';
import { MATRIX_VERSION } from './constants';

import { analyzeNamedLines } from './analysis/named-lines';
import { calculate37PointsMatrix } from './calculator/main';
import { calculateBridgePoints } from './calculator/bridge';
import { calculateDestinyLevels } from './calculator/destiny';

import type { DestinyMatrix, DestinyMatrixInput, DestinyMatrixPoints } from './types';
import type { MainPoints } from './calculator/types';

export class DestinyMatrixEngine {
  calculate(input: DestinyMatrixInput): DestinyMatrix {
    // 1. Validasi format string awal sebelum diurai demi keamanan runtime
    if (!input.birthDate || typeof input.birthDate !== 'string') {
      throw new Error('Tanggal lahir wajib diisi dengan format string YYYY-MM-DD.');
    }

    // 2. Parse string tanggal lahir menjadi { day, month, year }
    const birthDate = parseBirthDate(input.birthDate);

    if (!birthDate || isNaN(birthDate.day) || isNaN(birthDate.month) || isNaN(birthDate.year)) {
      throw new Error(
        `Format tanggal lahir tidak valid: "${input.birthDate}". Pastikan menggunakan standar ISO YYYY-MM-DD.`
      );
    }

    // 3. Kalkulasi 37 titik utama (Main, Ancestral, Inner, Channels, Companions, Timeline)
    const points: DestinyMatrixPoints = calculate37PointsMatrix(
      birthDate.day,
      birthDate.month,
      birthDate.year
    );

    // Ekstrak nilai numerik murni dari object DestinyPoint ke MainPoints primitif
    // engine.ts:37-41
    const numericMain: MainPoints = {
      A: points.A!.value,
      B: points.B!.value,
      C: points.C!.value,
      D: points.D!.value,
      E: points.E!.value,
    };

    // 4. Kalkulasi sekunder struktural untuk melayani fungsi takdir tingkat lanjut
    const bridge = calculateBridgePoints(numericMain);

    // 5. Hitung tingkat takdir (Personal, Social, Spiritual, Level 1-8) patuh pada pakem Natalia Ladini
    const destinies = calculateDestinyLevels(numericMain, bridge);

    // 6. Ambil analisis pemetaan garis fungsional (Karmic Tail, Love, Money)
    const namedLines = analyzeNamedLines(points);

    // 7. Bentuk kode ringkas Karmic Tail untuk kebutuhan pencarian index database/konten (e.g., "18-6-15")
    const karmicTailCode = namedLines.karmicTail.pattern;

    return {
      version: MATRIX_VERSION,
      calculatedAt: new Date().toISOString(),
      birthDate: input.birthDate,
      input,
      points,
      destinies,
      namedLines,
      karmicTailCode,
    };
  }
}

// Singleton instance pattern
let defaultEngine: DestinyMatrixEngine | null = null;

export function getDestinyMatrixEngine(): DestinyMatrixEngine {
  if (!defaultEngine) {
    defaultEngine = new DestinyMatrixEngine();
  }
  return defaultEngine;
}

export function resetDestinyMatrixEngine(): void {
  defaultEngine = null;
}
