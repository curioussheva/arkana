// src/core/destiny-matrix/engine.ts

import { parseBirthDate } from './utils';
import { MATRIX_VERSION } from './constants';
import { buildPoints } from './builders';

import { analyzeNamedLines } from './lines';

import { calculateMainPoints } from './calculator/main';
import { calculateBridgePoints } from './calculator/bridge';
import { calculateMacroPoints } from './calculator/macro';
import { calculateEnergyPoints } from './calculator/energy';
import { calculateDestinyLevels } from './calculator/destiny';

import type {
  DestinyMatrix,
  DestinyMatrixInput,
} from './types';

export class DestinyMatrixEngine {

  calculate(
    input: DestinyMatrixInput,
  ): DestinyMatrix {

    const birthDate = parseBirthDate(
      input.birthDate,
    );

    // 1. Main Matrix
    const main = calculateMainPoints(
      birthDate,
    );

    // 2. Bridge Layer
    const bridge = calculateBridgePoints(
      main,
    );

    // 3. Macro Layer
    const macro = calculateMacroPoints(
      main,
      bridge,
    );

    // 4. Energy Layer
    const energy = calculateEnergyPoints(
      main,
      bridge,
      macro,
    );

    // ─── 🎯 CORRECTION INTERCEPTOR LAYER ──────────────────────────────────
    // Menggabungkan seluruh hasil kalkulasi mentah
    const combinedRaw = {
      ...main,
      ...bridge,
      ...macro,
      ...energy,
    };

    // Peta Penyelaras: Memaksa properti Spasial (A1-E3) mengambil nilai 
    // dari Alfabet Hitungan yang BENAR sesuai panduan Geometri Kompas Sejati.
    const syncedRaw: Record<string, number> = { ...combinedRaw };

    // 1. Jalur Langit (Atas)
    if (combinedRaw.Q !== undefined) syncedRaw['A1'] = combinedRaw.Q; // Satelit Atas (7)
    if (combinedRaw.J !== undefined) syncedRaw['A2'] = combinedRaw.J; // Jembatan Tengah Atas (22) 👈 FIX UTAMA A2!
    if (combinedRaw.I !== undefined) syncedRaw['A3'] = combinedRaw.I; // Diagonal Atas-Kiri (5)     👈 FIX UTAMA A3!
 
    // 2. Jalur Spiritual / Sosial (Kanan)
    if (combinedRaw.R !== undefined) syncedRaw['B1'] = combinedRaw.R; // Satelit Kanan (8)
    if (combinedRaw.K !== undefined) syncedRaw['B2'] = combinedRaw.K; // Jembatan Kanan (18)
    if (combinedRaw.F !== undefined) syncedRaw['B3'] = combinedRaw.F; // Diagonal Atas-Kanan (20)

    // 3. Jalur Bumi / Finansial (Bawah)
    if (combinedRaw.S !== undefined) syncedRaw['C1'] = combinedRaw.S; // Satelit Bawah (7)
    if (combinedRaw.L !== undefined) syncedRaw['C2'] = combinedRaw.L; // Jembatan Bawah (4)
    if (combinedRaw.G !== undefined) syncedRaw['C3'] = combinedRaw.G; // Diagonal Bawah-Kanan (11)

    // 4. Jalur Fisik / Karma (Kiri)
    if (combinedRaw.T !== undefined) syncedRaw['D1'] = combinedRaw.T; // Satelit Kiri (20)
    if (combinedRaw.M !== undefined) syncedRaw['D2'] = combinedRaw.M; // Jembatan Kiri (15)
    if (combinedRaw.H !== undefined) syncedRaw['D3'] = combinedRaw.H; // Diagonal Bawah-Kiri (8)

    // 5. Klaster Ekstensi Karmic Tail (Bawah-Kiri)
    if (combinedRaw.N !== undefined) syncedRaw['E1'] = combinedRaw.N; // Satelit Internal (19)
    if (combinedRaw.O !== undefined) syncedRaw['E2'] = combinedRaw.O; // Satelit Cyan Bawah (7)
    if (combinedRaw.P !== undefined) syncedRaw['E3'] = combinedRaw.P; // Satelit Eksternal Kiri (5)

    // 5. Build Point Collection (Gunakan objek syncedRaw yang sudah lurus)
    const points = buildPoints(syncedRaw as any);

    // 6. Destiny Levels (Sudah dibersihkan dari duplikasi baris)
    const destinies = calculateDestinyLevels(
      main,
      energy,
    );

    return {
      version: MATRIX_VERSION,
      calculatedAt: new Date().toISOString(),
      birthDate: input.birthDate, 
      input,
      points,
      destinies,
      namedLines: analyzeNamedLines(
        points,
      ),
    };
  }
}

/**
 * Singleton Instance
 */
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
