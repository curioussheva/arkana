// src/core/destiny-matrix/analysis/chakra.ts

import type { DestinyMatrix } from '../types';

export interface ChakraData {
  name:
    | 'Crown'
    | 'Third Eye'
    | 'Throat'
    | 'Heart'
    | 'Solar Plexus'
    | 'Sacral'
    | 'Root';

  physicalValue: number;
  energyValue: number;
  totalValue: number;

  status: 'Balanced' | 'Overactive' | 'Blocked';

  description: string;
}

interface ChakraSpec {
  name: ChakraData['name'];
  physicalKey: string;
  energyKey: string;
}

const CHAKRA_MAP: readonly ChakraSpec[] = [
  {
    name: 'Crown',
    physicalKey: 'A',
    energyKey: 'B',
  },
  {
    name: 'Third Eye',
    physicalKey: 'A1',
    energyKey: 'B1',
  },
  {
    name: 'Throat',
    physicalKey: 'A2',
    energyKey: 'B2',
  },
  {
    name: 'Heart',
    physicalKey: 'E',
    energyKey: 'E1',
  },
  {
    name: 'Solar Plexus',
    physicalKey: 'D1',
    energyKey: 'C1',
  },
  {
    name: 'Sacral',
    physicalKey: 'D2',
    energyKey: 'C2',
  },
  {
    name: 'Root',
    physicalKey: 'D',
    energyKey: 'C',
  },
] as const;

function evaluateStatus(
  total: number,
  chakra: ChakraData['name'],
): Pick<ChakraData, 'status' | 'description'> {
  if ([4, 7, 11, 15, 16].includes(total)) {
    return {
      status: 'Overactive',
      description:
        `Energi chakra ${chakra} cenderung berlebihan. ` +
        `Grounding dan pengendalian diri diperlukan agar energi tidak meluap.`,
    };
  }

  if ([9, 12, 13, 18, 22].includes(total)) {
    return {
      status: 'Blocked',
      description:
        `Aliran energi chakra ${chakra} tampak terhambat. ` +
        `Perlu penyembuhan emosional, refleksi, dan pelepasan beban lama.`,
    };
  }

  return {
    status: 'Balanced',
    description:
      `Energi chakra ${chakra} berada dalam kondisi harmonis dan stabil.`,
  };
}

/**
 * Analisis seluruh sistem chakra Destiny Matrix.
 */
export function analyzeChakras(
  matrix: DestinyMatrix,
): ChakraData[] {
  return CHAKRA_MAP.map(spec => {
    const physical =
      matrix.points[
        spec.physicalKey as keyof typeof matrix.points
      ]?.value ?? 0;

    const energy =
      matrix.points[
        spec.energyKey as keyof typeof matrix.points
      ]?.value ?? 0;

    let total = (physical + energy) % 22;

    if (total === 0) {
      total = 22;
    }

    const result = evaluateStatus(total, spec.name);

    return {
      name: spec.name,
      physicalValue: physical,
      energyValue: energy,
      totalValue: total,
      status: result.status,
      description: result.description,
    };
  });
}