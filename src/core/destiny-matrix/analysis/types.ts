// src/core/destiny-matrix/analysis/types.ts

import type { ArcanaDefinition } from '../../arcana/types';
import type { KarmicTailDefinition } from '../data/karmic-tails';

// Impor ChakraData dari berkas tempat ia dideklarasikan (chakra.ts)
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

export interface DestinyInsight {
  narrative: string;

  dominantElement: ArcanaDefinition['element'];
  elementDistribution: Record<ArcanaDefinition['element'], number>;
  dominantPercentage: number;
  secondaryElement?: ArcanaDefinition['element'];

  coreEssence: {
    card: string;
    number: number;
    meaning: string;
  };

  personality: {
    card: string;
    number: number;
    meaning: string;
  };

  lifeDirection: {
    card: string;
    number: number;
    meaning: string;
  };

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

  dominant:
    | 'Yin'
    | 'Yang'
    | 'Balanced';

  archetype: string;
}

/* -------------------------------------------------------------------------- */
/*                           Advanced Analysis                                */
/* -------------------------------------------------------------------------- */

export interface AdvancedAnalysisResult {
  yinYang: YinYangResult;
  karmicTail: KarmicTailDefinition;
  
  // Sekarang bertipe aman karena sudah di-import dari ./chakra
  chakras: ChakraData[]; 
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
