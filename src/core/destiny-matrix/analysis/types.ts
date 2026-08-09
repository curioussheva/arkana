// src/core/destiny-matrix/analysis/types.ts

import type { ArcanaDefinition } from '../../arcana/types';
import type { DestinyPoint } from '../types';
import type { KarmicTailDefinition } from '../data/karmic-tails';
import type { KarmicTailAnalysis } from './karmic-tail';
import type { ChakraData } from './chakra';

/* -------------------------------------------------------------------------- */
/*                                Element Stats                               */
/* -------------------------------------------------------------------------- */

export interface ElementStats {
  dominant: ArcanaDefinition['element'];
  dominantCount: number;
  dominantPercentage: number;
  secondary?: ArcanaDefinition['element'];
}

/* -------------------------------------------------------------------------- */
/*                               Destiny Insight                              */
/* -------------------------------------------------------------------------- */

export interface InsightPointDetail {
  card: string;
  number: number;
  meaning: string;
  advice?: string;
}

export interface DestinyInsight {
  narrative: string;

  dominantElement: ArcanaDefinition['element'];
  elementDistribution: Record<ArcanaDefinition['element'], number>;
  dominantPercentage: number;
  secondaryElement?: ArcanaDefinition['element'];

  coreEssence: InsightPointDetail;
  personality: InsightPointDetail;
  lifeDirection: InsightPointDetail;

  yearlyForecast: {
    year: number;
    card: string;
    personalYearValue: number;
    meaning: string;
  };

  elementAdvice: string;
  challenge: string;
  strength: string;

  generatedAt: string;
  version: string;
}

/* -------------------------------------------------------------------------- */
/*                                Yin Yang                                    */
/* -------------------------------------------------------------------------- */

export interface YinYangResult {
  yinPercentage: number;
  yangPercentage: number;

  dominant: 'Yin' | 'Yang' | 'Balanced';

  archetype: string;
}

/* -------------------------------------------------------------------------- */
/*                                Named Lines                                 */
/* -------------------------------------------------------------------------- */

export interface NamedLineDetail {
  entry?: DestinyPoint | null;
  partner?: DestinyPoint | null;
  core?: DestinyPoint | null;
  exit?: DestinyPoint | null;
  outcome?: DestinyPoint | null;
  past?: DestinyPoint | null;
  meaning: string;
  keyLesson?: string;
  advice?: string;
}

export interface NamedLinesResult {
  karmicTail: {
    points: [DestinyPoint, DestinyPoint, DestinyPoint];
    pattern: string;
    title: string;
    meaning: string;
    resolution: string;
  };
  loveLine: NamedLineDetail;
  moneyLine: NamedLineDetail;
}

/* -------------------------------------------------------------------------- */
/*                           Advanced Analysis                                */
/* -------------------------------------------------------------------------- */

export interface AdvancedAnalysisResult {
  yinYang: YinYangResult;
  karmicTail: KarmicTailAnalysis | KarmicTailDefinition;
  namedLines?: NamedLinesResult;
  chakras: ChakraData[];
  elementStats?: ElementStats;
}

/* -------------------------------------------------------------------------- */
/*                             Narrative Context                              */
/* -------------------------------------------------------------------------- */

export interface NarrativeContext {
  coreEssence: string;
  personality: string;
  lifeDirection: string;
  elementOpening: string;
  yearlyCard: string;
}
