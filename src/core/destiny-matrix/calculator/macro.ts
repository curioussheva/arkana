import { reduceToArcana } from '../utils';
import type { MainPoints, BridgePoints, MacroPoints } from './types';
import { calculateSvadhisthana } from './shared-formulas';

export function calculateMacroPoints(main: MainPoints, bridge: BridgePoints): MacroPoints {
  const { A, B, C, D, E } = main;
  const { J, K, L, M } = bridge;

  // Svadhisthana Garis Bumi (Horizontal Center-Right: E + C)
  // const svadhisthanaEarth = reduceToArcana(E + C);
  const { earth: svadhisthanaEarth } = calculateSvadhisthana(main);
  // N: Pusat Pertemuan Keuangan dan Pasangan
  const N = reduceToArcana(M + svadhisthanaEarth);

  // O & P: Channel Points
  const O = reduceToArcana(M + N); // Entri/Jalur Pasangan (Garis Surga)
  const P = reduceToArcana(svadhisthanaEarth + N); // Entri/Jalur Keuangan (Garis Bumi)

  // Q, R, S, T: Companion Sub-Nodes pada Persegi Utama
  const Q = reduceToArcana(A + J); // Garis Kiri -> Center
  const R = reduceToArcana(B + K); // Garis Atas -> Center
  const S = reduceToArcana(C + L); // Garis Kanan -> Center
  const T = reduceToArcana(D + M); // Garis Bawah -> Center

  return { N, O, P, Q, R, S, T };
}
