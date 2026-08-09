// src/core/destiny-matrix/analysis/elements.ts

import type { DestinyMatrix } from '../types';
import type { ArcanaDefinition, ArcanaElement } from '../../arcana/types';

import { ELEMENT_ADVICE, ELEMENT_OPENINGS } from './constants';

import type { ElementStats } from './types';

/* -------------------------------------------------------------------------- */
/*                              Element Count                                 */
/* -------------------------------------------------------------------------- */

export function countElements(matrix: DestinyMatrix): Record<ArcanaElement, number> {
  const counts: Record<ArcanaElement, number> = {
    Fire: 0,
    Water: 0,
    Air: 0,
    Earth: 0,
  };

  if (!matrix || !matrix.points) return counts;

  for (const point of Object.values(matrix.points)) {
    // 1. Validasi aman agar tidak crash jika data arcana kosong
    const element = point?.arcana?.element;

    // 2. Type-guard untuk memastikan string element terdaftar di dalam key objek counts
    if (element && element in counts) {
      counts[element as ArcanaElement]++;
    }
  }

  return counts;
}

/* -------------------------------------------------------------------------- */
/*                             Element Statistics                             */
/* -------------------------------------------------------------------------- */

export function getElementStats(counts: Record<ArcanaDefinition['element'], number>): ElementStats {
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0) || 1;

  const sorted = (Object.entries(counts) as [ArcanaDefinition['element'], number][]).sort(
    (a, b) => b[1] - a[1]
  );

  return {
    dominant: sorted[0][0],
    dominantCount: sorted[0][1],
    dominantPercentage: Math.round((sorted[0][1] / total) * 100),
    secondary: sorted[1]?.[1] > 0 ? sorted[1][0] : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*                          Element Narrative Data                            */
/* -------------------------------------------------------------------------- */

export function getElementAdvice(element: ArcanaDefinition['element']): string {
  return ELEMENT_ADVICE[element];
}

export function getElementOpening(element: ArcanaDefinition['element']): string {
  const openings = ELEMENT_OPENINGS[element];

  return openings[Math.floor(Math.random() * openings.length)];
}

/* -------------------------------------------------------------------------- */
/*                              Element Summary                               */
/* -------------------------------------------------------------------------- */

export interface ElementSummary {
  distribution: Record<ArcanaDefinition['element'], number>;

  stats: ElementStats;

  advice: string;

  opening: string;
}

export function buildElementSummary(matrix: DestinyMatrix): ElementSummary {
  const distribution = countElements(matrix);

  const stats = getElementStats(distribution);

  return {
    distribution,

    stats,

    advice: getElementAdvice(stats.dominant),

    opening: getElementOpening(stats.dominant),
  };
}
