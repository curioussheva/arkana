// src/core/destiny-matrix/calculations/shared-formulas.ts
//
// LAYER 1 — COMPUTE BERSAMA
// -----------------------------------------------------------------------
// Formula yang dipakai lebih dari satu modul (macro.ts, health-map.ts, dst)
// HARUS hidup di sini, bukan diduplikasi lokal di masing-masing file.
// -----------------------------------------------------------------------

import { reduceToArcana } from '../utils';
import type { MainPoints, BridgePoints } from './types';

export interface SvadhisthanaPair {
  /** reduce(E + C) — dipakai juga sebagai komponen N & P (channel). */
  earth: number;
  /** reduce(E + D) — belum dipakai di channel manapun, cek cross-reference. */
  heaven: number;
}

/**
 * Svadhisthana (chakra pusar) pada garis Bumi & Surga.
 * SATU-SATUNYA tempat formula ini boleh ditulis.
 *
 * Dipakai oleh:
 * - calculateMacroPoints (untuk N, P)
 * - calculateHealthMap (untuk chakra svadhisthana di heavenLine/earthLine)
 */
export function calculateSvadhisthana(main: MainPoints): SvadhisthanaPair {
  const { C, D, E } = main;
  return {
    earth: reduceToArcana(E + C),
    heaven: reduceToArcana(E + D),
  };
}

export interface GreenZonePair {
  /** reduce(J + E) — hasrat fisik/duniawi, garis horizontal (A1 <-> E). */
  physical: number;
  /** reduce(K + E) — hasrat spiritual, garis vertikal (B1 <-> E). */
  spiritual: number;
}

/**
 * "Green Zone" / Titik Hasrat Hati (Heart's Desire).
 * Istilah resmi Ladini: Green Zone — dua lingkaran di perpotongan salib
 * utama, BUKAN E itu sendiri (jangan disamakan dengan label "Heart's
 * Desire" yang sebelumnya salah dipasang di E / Comfort Zone).
 *
 * - physical (horizontal, J+E): apa yang hati ingin alami/bangun di dunia nyata
 * - spiritual (vertikal, K+E): apa yang jiwa cari di level terdalam
 *
 * SATU-SATUNYA tempat formula ini boleh ditulis — jangan hitung ulang
 * di tempat lain.
 */
export function calculateGreenZone(bridge: BridgePoints, main: MainPoints): GreenZonePair {
  const { J, K } = bridge;
  const { E } = main;
  return {
    physical: reduceToArcana(J + E),
    spiritual: reduceToArcana(K + E),
  };
}
