import { reduceToArcana } from '../utils';

import type {
  MainPoints,
  BridgePoints,
  MacroPoints,
  EnergyPoints,
} from './types';

export function calculateEnergyPoints(
  main: MainPoints,
  bridge: BridgePoints,
  macro: MacroPoints,
): EnergyPoints {

  const { A, B, C, D, E } = main;
  const { J, K, L, M, F, G, H, I } = bridge;
  const { Q, R, S, T } = macro;

  return {

    A1: reduceToArcana(A + Q),
    A2: reduceToArcana(J + E),
    A3: reduceToArcana(Q + J),

    B1: reduceToArcana(B + R),
    B2: reduceToArcana(K + E),
    B3: reduceToArcana(R + K),

    C1: reduceToArcana(C + S),
    C2: reduceToArcana(L + E),
    C3: reduceToArcana(S + L),

    D1: reduceToArcana(D + T),
    D2: reduceToArcana(M + E),
    D3: reduceToArcana(T + M),

    E1: reduceToArcana(F + G),
    E2: reduceToArcana(H + I),
  };
} 