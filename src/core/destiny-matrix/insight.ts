// src/core/destiny-matrix/insight.ts

import type { DestinyMatrix } from './types';

// 🚀 Fix: Use the correct function name from the elements file!
import { buildElementSummary } from './analysis/elements'; 
import { generateNarrative } from './analysis/narrative';
import { analyzeAdvanced } from './analysis/advanced';
import { analyzeNamedLines } from './analysis/named-lines';
import type { ElementSummary } from './analysis';

export interface DestinyInsight {
  narrative: ReturnType<typeof generateNarrative>;

  elements: ElementSummary;

  advanced: ReturnType<typeof analyzeAdvanced>;

  namedLines: ReturnType<typeof analyzeNamedLines>;

  generatedAt: string;
  version: string;
} 

// src/core/destiny-matrix/insight.ts

export function generateInsight(matrix: DestinyMatrix): DestinyInsight {
  return {
    narrative: generateNarrative(matrix),
    elements: buildElementSummary(matrix),
    advanced: analyzeAdvanced(matrix),
    namedLines: analyzeNamedLines(matrix.points),

    generatedAt: new Date().toISOString(),
    version: '3.0.0',
  };
}

export * from './analysis';