import { reduceToArcana } from '../utils';

import type {
  MainPoints,
  EnergyPoints,
  DestinyLevels,
} from './types';

export function calculateDestinyLevels(
  main: MainPoints,
  energy: EnergyPoints,
): DestinyLevels {

  const personal = reduceToArcana(
    energy.E1 + energy.E2,
  );

  const social = reduceToArcana(
    main.A +
    main.B +
    main.C +
    main.D,
  );

  const spiritual = reduceToArcana(
    personal + social,
  );

  return {
    personal,
    social,
    spiritual,
  };
} 