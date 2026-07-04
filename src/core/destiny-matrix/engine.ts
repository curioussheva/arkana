import { getArkanaByNumber } from '../numerology/arkana';
import { reduceToArcana, parseBirthDate, sumDigits } from './utils';
import type {
  DestinyMatrix,
  DestinyMatrixInput,
  DestinyMatrixPoints,
  DestinyPoint,
  DestinyPointKey,
} from './types';

const POINT_LABELS: Record<DestinyPointKey, string> = {
  A: 'Hari Lahir',
  B: 'Bulan Lahir',
  C: 'Garis Keturunan',
  D: 'Sintesis Pertama',
  E: 'Titik Pusat (Esensi Jiwa)',
  F: 'Zona Nyaman',
  G: 'Zona Sosial',
  H: 'Zona Tantangan',
  I: 'Zona Keseimbangan',
  J: 'Bakat Tersembunyi',
  K: 'Kekuatan Batin',
  L: 'Potensi Spiritual',
  M: 'Arah Perkembangan',
};

/**
 * Destiny Matrix arcana numbering runs 1 (The Magician) .. 21 (The World),
 * 22 (The Fool) — Fool is shifted to the end, unlike the standard Tarot
 * deck order used in ARKANA_CARDS (0=Fool..21=World). `value % 22` maps
 * correctly either way: 22 % 22 = 0 (Fool), 1..21 map to themselves.
 */
function buildPoint(key: DestinyPointKey, value: number): DestinyPoint {
  return {
    key,
    label: POINT_LABELS[key],
    value,
    arcana: getArkanaByNumber(value % 22),
  };
}

export class DestinyMatrixEngine {
  calculate(input: DestinyMatrixInput): DestinyMatrix {
    const date = parseBirthDate(input.birthDate);

    const A = reduceToArcana(date.day);
    const B = reduceToArcana(date.month);
    const C = reduceToArcana(sumDigits(date.year));
    const D = reduceToArcana(A + B + C);
    const E = reduceToArcana(A + B + C + D);
    const F = reduceToArcana(A + B);
    const G = reduceToArcana(B + C);
    const H = reduceToArcana(C + D);
    const I = reduceToArcana(D + A);
    const J = reduceToArcana(A + E);
    const K = reduceToArcana(B + E);
    const L = reduceToArcana(C + E);
    const M = reduceToArcana(D + E);

    const points: DestinyMatrixPoints = {
      A: buildPoint('A', A),
      B: buildPoint('B', B),
      C: buildPoint('C', C),
      D: buildPoint('D', D),
      E: buildPoint('E', E),
      F: buildPoint('F', F),
      G: buildPoint('G', G),
      H: buildPoint('H', H),
      I: buildPoint('I', I),
      J: buildPoint('J', J),
      K: buildPoint('K', K),
      L: buildPoint('L', L),
      M: buildPoint('M', M),
    };

    return {
      version: '1.0.0',
      calculatedAt: new Date().toISOString(),
      input,
      points,
    };
  }
}

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
