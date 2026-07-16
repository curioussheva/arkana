import { reduceToArcana } from '../utils';

import type {
  MainPoints,
  BridgePoints,
} from './types';

export function calculateBridgePoints(
  main: MainPoints,
): BridgePoints {

  const { A, B, C, D, E } = main;

  return {
    F: reduceToArcana(A + B),
    G: reduceToArcana(B + C),
    H: reduceToArcana(C + D),
    I: reduceToArcana(D + A),

    J: reduceToArcana(A + E),
    K: reduceToArcana(B + E),
    L: reduceToArcana(C + E),
    M: reduceToArcana(D + E),
  };
} 