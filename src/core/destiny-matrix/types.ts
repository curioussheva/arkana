import type { ArkanaInfo } from '../numerology/types';

export type DestinyPointKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';

export interface DestinyPoint {
  key: DestinyPointKey;
  label: string;
  /** Value in the 1-22 Major Arcana range (per the Destiny Matrix method,
   * NOT reduced further to a single digit like classical numerology). */
  value: number;
  arcana: ArkanaInfo;
}

export interface DestinyMatrixInput {
  birthDate: string; // ISO 8601: YYYY-MM-DD
}

export type DestinyMatrixPoints = Record<DestinyPointKey, DestinyPoint>;

export interface DestinyMatrix {
  version: string;
  calculatedAt: string; // ISO 8601
  input: DestinyMatrixInput;
  points: DestinyMatrixPoints;
}
