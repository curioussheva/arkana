// src/core/destiny-matrix/calculator/types.ts

/**
 * Raw numeric values hasil kalkulasi.
 * Tidak mengandung label maupun Arcana.
 */

export interface MainPoints {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
}

export interface BridgePoints {
  F: number;
  G: number;
  H: number;
  I: number;

  J: number;
  K: number;
  L: number;
  M: number;
}

export interface MacroPoints {
  N: number;
  O: number;
  P: number;

  Q: number;
  R: number;
  S: number;
  T: number;
}

export interface EnergyPoints {
  A1: number;
  A2: number;
  A3: number;

  B1: number;
  B2: number;
  B3: number;

  C1: number;
  C2: number;
  C3: number;

  D1: number;
  D2: number;
  D3: number;

  E1: number;
  E2: number;
}

export interface DestinyLevels {
  personal: number;
  social: number;
  spiritual: number;
}

export type RawCalculatedPoints =
  MainPoints &
  BridgePoints &
  MacroPoints &
  EnergyPoints;