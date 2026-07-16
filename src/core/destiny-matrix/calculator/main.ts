import { reduceToArcana, sumDigits } from '../utils';

import type { BirthDateInput } from '../../arcana/types';
import type { MainPoints } from './types';

export function calculateMainPoints(
  date: BirthDateInput,
): MainPoints {

  const A = reduceToArcana(date.day);
  const B = reduceToArcana(date.month);
  const C = reduceToArcana(sumDigits(date.year));

  const D = reduceToArcana(A + B + C);
  const E = reduceToArcana(A + B + C + D);

  return {
    A,
    B,
    C,
    D,
    E,
  };
} 