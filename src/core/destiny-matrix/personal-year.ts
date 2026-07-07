// src/core/destiny-matrix/personal-year.ts
import { getArkanaByNumber } from '../numerology/arkana';
import { reduceToArcana, parseBirthDate, sumDigits } from './utils';
import type { ArkanaInfo } from '../numerology/types';

export interface PersonalYearArcana {
  year: number;
  /** The year's own digit-sum, reduced to the 1-22 range (e.g. 2026 -> 10). */
  universalYearValue: number;
  /** Combination of birth day + birth month + universalYearValue, reduced to 1-22. */
  personalYearValue: number;
  arcana: ArkanaInfo;
}

/**
 * Personal Year Arcana — NOT part of the original 13-point core matrix
 * (A-M). This is deliberately our own consistent extension rather than a
 * verified reproduction of Natalia Ladini's original method.
 */
export function calculatePersonalYearArcana(
  birthDate: string,
  year: number = new Date().getFullYear() // Dinamis mengambil tahun saat ini (2026)
): PersonalYearArcana {
  const date = parseBirthDate(birthDate);
  
  const day = reduceToArcana(date.day);
  const month = reduceToArcana(date.month);
  const universalYearValue = reduceToArcana(sumDigits(year));
  const personalYearValue = reduceToArcana(day + month + universalYearValue);

  return {
    year,
    universalYearValue,
    personalYearValue,
    // 💡 PERBAIKAN: Langsung gunakan personalYearValue tanpa modulo (%) 
    // karena fungsi reduceToArcana di atas sudah menjamin output berada di rentang aman (1-22).
    arcana: getArkanaByNumber(personalYearValue),
  };
}
 