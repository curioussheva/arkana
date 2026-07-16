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

    // 5. Build Point Collection
    const points = buildPoints({
      ...main,
      ...bridge,
      ...macro,
      ...energy,
    });

    // 6. Destiny Levels
    const destinies = calculateDestinyLevels(
      main,
      energy,
    );

    return {
      version: MATRIX_VERSION,

      calculatedAt: new Date().toISOString(),

      // Menyuntikkan string tanggal lahir langsung ke root tingkat atas objek
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
 