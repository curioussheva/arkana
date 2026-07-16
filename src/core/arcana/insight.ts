// src/core/arcana/insight.ts

import type { ArcanaDefinition } from './types';
import { createNarrative } from './narratives';

export interface ArcanaInsight {
  title: string;
  summary: string;

  dominant: ArcanaDefinition;
  supporting: ArcanaDefinition[];

  personality: string;
  //potential: string;
  challenge: string;

  career: string;
  finance: string;
  relationship: string;
  spirituality: string;

  affirmations: string[];
}

export function generateArcanaInsight(
  dominant: ArcanaDefinition,
  supporting: ArcanaDefinition[] = [],
): ArcanaInsight {
  const narrative = createNarrative(dominant);

  return {
    title: dominant.tarotName,

    summary: narrative.overview,

    dominant,

    supporting,

    personality: narrative.personality,

    //potential: narrative.potential,

    challenge: narrative.challenge,

    career: narrative.career,

    finance: dominant.finance.join(', '),

    relationship: narrative.relationship,

    spirituality: narrative.spirituality,

    affirmations: dominant.affirmations,
  };
}