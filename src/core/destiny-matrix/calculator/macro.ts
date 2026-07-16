import { reduceToArcana } from '../utils';

import type {
  MainPoints,
  BridgePoints,
  MacroPoints,
} from './types';

export function calculateMacroPoints(
  main: MainPoints,
  bridge: BridgePoints,
): MacroPoints {

  const { A, B, C, D } = main;
  const { J, K, L, M } = bridge;

  const N = reduceToArcana(M + L);

  return {

    N,

    O: reduceToArcana(M + N),

    P: reduceToArcana(L + N),

    Q: reduceToArcana(A + J),

    R: reduceToArcana(B + K),

    S: reduceToArcana(C + L),

    T: reduceToArcana(D + M),
  };
} 