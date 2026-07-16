import type { BirthDateInput } from '../arcana/types';

/**
 * Reduces a number into the 1-22 Major Arcana range by summing its digits,
 * per the Destiny Matrix method (Natalia Ladini, 2006). Unlike classical
 * numerology, this does NOT reduce further to a single digit — values up
 * to 22 (including exactly 22) are valid, meaningful endpoints.
 */
export function reduceToArcana(n: number): number {
  let num = n;
  while (num > 22) {
    num = (num % 10) + Math.floor(num / 10);
  }
  return num;
}

export function parseBirthDate(dateStr: string): BirthDateInput {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { day, month, year };
}

export function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}
