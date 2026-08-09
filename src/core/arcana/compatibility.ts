// src/core/arcana/compatibility.ts

import type { ArcanaDefinition, ArcanaElement } from './types';

import { getArcana } from './query';

export interface ArcanaCompatibility {
  score: number;

  level: 'Sangat Rendah' | 'Rendah' | 'Sedang' | 'Baik' | 'Sangat Baik';

  strengths: string[];
  challenges: string[];
  advice: string[];
}

const ELEMENT_COMPATIBILITY: Record<ArcanaElement, Record<ArcanaElement, number>> = {
  Fire: {
    Fire: 90,
    Air: 85,
    Earth: 60,
    Water: 45,
  },

  Water: {
    Water: 90,
    Earth: 85,
    Fire: 45,
    Air: 60,
  },

  Air: {
    Air: 90,
    Fire: 85,
    Water: 60,
    Earth: 50,
  },

  Earth: {
    Earth: 90,
    Water: 85,
    Fire: 60,
    Air: 50,
  },
};

function getLevel(score: number): ArcanaCompatibility['level'] {
  if (score >= 90) return 'Sangat Baik';
  if (score >= 75) return 'Baik';
  if (score >= 60) return 'Sedang';
  if (score >= 40) return 'Rendah';
  return 'Sangat Rendah';
}

function intersection<T extends string>(first: readonly T[], second: readonly T[]): T[] {
  const set = new Set(second.map(v => v.toLowerCase()));

  return first.filter(v => set.has(v.toLowerCase()));
}

export function calculateArcanaCompatibility(
  first: ArcanaDefinition,
  second: ArcanaDefinition
): ArcanaCompatibility {
  let score = ELEMENT_COMPATIBILITY[first.element][second.element];

  // bonus bila memang direkomendasikan
  if (first.compatibleElements.includes(second.element)) {
    score += 5;
  }

  if (second.compatibleElements.includes(first.element)) {
    score += 5;
  }

  // penalti elemen sulit
  if (first.difficultElements.includes(second.element)) {
    score -= 5;
  }

  if (second.difficultElements.includes(first.element)) {
    score -= 5;
  }

  // keyword
  score += intersection(first.keywords, second.keywords).length * 4;

  // talents
  score += intersection(first.talents, second.talents).length * 3;

  // gifts
  score += intersection(first.gifts, second.gifts).length * 2;

  // life mission
  score += intersection(first.lifeMission, second.lifeMission).length * 3;

  // spiritual lesson
  score += intersection(first.spiritualLessons, second.spiritualLessons).length * 2;

  // karmic lesson sama biasanya berarti tantangan
  score -= intersection(first.karmicLessons, second.karmicLessons).length * 2;

  // shadow trait sama
  score -= intersection(first.shadowTraits, second.shadowTraits).length * 3;

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,

    level: getLevel(score),

    strengths: [
      ...new Set([
        ...intersection(first.positiveTraits, second.positiveTraits),

        ...intersection(first.gifts, second.gifts),

        ...intersection(first.lifeMission, second.lifeMission),
      ]),
    ],

    challenges: [
      ...new Set([
        ...intersection(first.shadowTraits, second.shadowTraits),

        ...intersection(first.karmicLessons, second.karmicLessons),
      ]),
    ],

    advice: [...new Set([...first.advice, ...second.advice])].slice(0, 5),
  };
}

export function compatibilityById(firstId: number, secondId: number): ArcanaCompatibility | null {
  const first = getArcana(firstId);
  const second = getArcana(secondId);

  if (!first || !second) {
    return null;
  }

  return calculateArcanaCompatibility(first, second);
}
