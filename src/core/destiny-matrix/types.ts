// src/core/destiny-matrix/types.ts
import type { ArkanaInfo } from '../numerology/types';

export type DestinyPointKey =
  | 'A' | 'B' | 'C' | 'D' | 'E'
  | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  // Tambahan untuk MatrixScreen
  | 'A1' | 'A2' | 'A3'
  | 'B1' | 'B2' | 'B3'
  | 'C1' | 'C2' | 'C3'
  | 'D1' | 'D2' | 'D3'
  | 'E1' | 'E2';

export interface DestinyPoint {
  key: DestinyPointKey;
  label: string;
  value: number;
  arcana: ArkanaInfo;
}

export interface DestinyMatrixPoints {
  A: DestinyPoint; B: DestinyPoint; C: DestinyPoint; D: DestinyPoint; E: DestinyPoint;
  F: DestinyPoint; G: DestinyPoint; H: DestinyPoint; I: DestinyPoint;
  J: DestinyPoint; K: DestinyPoint; L: DestinyPoint; M: DestinyPoint;
  N: DestinyPoint; O: DestinyPoint; P: DestinyPoint;
  Q: DestinyPoint; R: DestinyPoint; S: DestinyPoint; T: DestinyPoint;
  A1: DestinyPoint; A2: DestinyPoint; A3: DestinyPoint;
  B1: DestinyPoint; B2: DestinyPoint; B3: DestinyPoint;
  C1: DestinyPoint; C2: DestinyPoint; C3: DestinyPoint;
  D1: DestinyPoint; D2: DestinyPoint; D3: DestinyPoint;
  E1: DestinyPoint; E2: DestinyPoint;
}

// ==================== NAMED LINES ====================
export interface NamedLines {
  karmicTail: {
    points: DestinyPoint[];
    pattern: string;
    title: string;
    meaning: string;
    resolution: string;
  };
  loveLine: {
    past: DestinyPoint;
    present: DestinyPoint;
    future: DestinyPoint;
    meaning: string;
    keyLesson: string;
  };
  moneyLine: {
    entry: DestinyPoint;
    core: DestinyPoint;
    exit: DestinyPoint;
    meaning: string;
    advice: string;
  };
}

export interface DestinyMatrixInput {
  birthDate: string;
}

export interface DestinyMatrix {
  version: string;
  calculatedAt: string;
  input: DestinyMatrixInput;
  points: DestinyMatrixPoints;
  namedLines: NamedLines;        // ← BARU
}