// src/core/destiny-matrix/analysis/karmic-tail.ts

import type { DestinyMatrix } from '../types';
import {
  findKarmicTail,
  type KarmicTailDefinition,
} from '../data/karmic-tails';

export interface KarmicTailAnalysis extends KarmicTailDefinition {
  values: {
    C: number;
    C1: number;
    C2: number;
  };
}

/**
 * Analisis Karmic Tail berdasarkan triad:
 *
 *   C → C1 → C2
 *
 * C  : Garis Keturunan
 * C1 : Ekstensi Jalur Finansial I
 * C2 : Ekstensi Jalur Finansial II
 */
export function analyzeKarmicTail(
  matrix: DestinyMatrix,
): KarmicTailAnalysis {
  const c = matrix.points.C.value;
  const c1 = matrix.points.C1.value;
  const c2 = matrix.points.C2.value;

  const definition = findKarmicTail(
    c,
    c1,
    c2,
  );

  return {
    ...definition,
    values: {
      C: c,
      C1: c1,
      C2: c2,
    },
  };
}