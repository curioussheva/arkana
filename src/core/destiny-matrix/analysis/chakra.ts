// src/core/destiny-matrix/analysis/chakra.ts

import type { DestinyMatrix, DestinyPoint } from '../types';
import { reduceToArcana } from '../utils';

export interface ChakraData {
  name: 'Crown' | 'Third Eye' | 'Throat' | 'Heart' | 'Solar Plexus' | 'Sacral' | 'Root';
  sanskritName: string;
  physicalValue: number; // Garis Bumi (Material/Fisik)
  energyValue: number; // Garis Surga (Spiritual/Energi)
  totalValue: number; // Emosi / Sintesis Emosional (Physical + Energy)
  status: 'Balanced' | 'Overactive' | 'Blocked';
  description: string;
}

interface ChakraSpec {
  name: ChakraData['name'];
  sanskritName: string;
  physicalKey: string; // Kunci Garis Bumi
  energyKey: string; // Kunci Garis Surga
}

/**
 * Pemetaan 7 Chakra sesuai Arsitektur Aksis Natalia Ladini:
 * - Garis Bumi (Horizontal) = Fisik / Kesehatan Tubuh
 * - Garis Surga (Vertikal) = Energi / Potensi Batin
 */
const CHAKRA_MAP: readonly ChakraSpec[] = [
  {
    name: 'Crown',
    sanskritName: 'Sahasrara',
    physicalKey: 'A',
    energyKey: 'B',
  },
  {
    name: 'Third Eye',
    sanskritName: 'Ajna',
    physicalKey: 'Q', // Sub-Node A-E (Atas Kiri)
    energyKey: 'K', // B1 (Titik antara B & J)
  },
  {
    name: 'Throat',
    sanskritName: 'Vishuddha',
    physicalKey: 'A1', // Titik Vishuddha Horisontal
    energyKey: 'J', // Titik Vishuddha Vertikal (B + E)
  },
  {
    name: 'Heart',
    sanskritName: 'Anahata',
    physicalKey: 'E', // Center / Comfort Zone
    energyKey: 'E', // Center / Comfort Zone
  },
  {
    name: 'Solar Plexus',
    sanskritName: 'Manipura',
    physicalKey: 'C1', // Titik Anahata/Manipura Horisontal
    energyKey: 'L', // Titik Anahata Vertikal (J + E)
  },
  {
    name: 'Sacral',
    sanskritName: 'Svadhisthana',
    physicalKey: 'S', // Sub-Node C-E (Bawah Kanan)
    energyKey: 'M', // D1 / Svadhisthana Vertikal (E + D)
  },
  {
    name: 'Root',
    sanskritName: 'Muladhara',
    physicalKey: 'C',
    energyKey: 'D',
  },
] as const;

/**
 * Helper internal untuk ekstraksi nilai numerik secara aman dari DestinyPoint / number
 */
function extractPointValue(point: DestinyPoint | number | undefined | null): number {
  if (point === undefined || point === null) return 0;
  if (typeof point === 'number') return point;
  if (typeof point === 'object') {
    if (typeof point.value === 'number') return point.value;
    if (point.arcana && typeof point.arcana.id === 'number') return point.arcana.id;
  }
  return 0;
}

function evaluateStatus(
  total: number,
  chakra: ChakraData['name']
): Pick<ChakraData, 'status' | 'description'> {
  // Arcana bernilai ekspansif/agresif (misal: 4-Kaisar, 7-Kereta, 11-Kekuatan, 15-Iblis, 16-Menara)
  if ([4, 7, 11, 15, 16].includes(total)) {
    return {
      status: 'Overactive',
      description:
        `Energi chakra ${chakra} cenderung berlebihan. ` +
        `Grounding dan pengendalian diri diperlukan agar energi tidak meluap secara impulsif.`,
    };
  }

  // Arcana bernilai reflektif/tertutup (misal: 9-Pertapa, 12-Pria Tergantung, 13-Kematian, 18-Bulan, 22-Si Dungu)
  if ([9, 12, 13, 18, 22].includes(total)) {
    return {
      status: 'Blocked',
      description:
        `Aliran energi chakra ${chakra} tampak terhambat atau mengalami pelepasan emosi mendalam. ` +
        `Perlu pemulihan emosional, refleksi batin, dan pelepasan beban masa lalu.`,
    };
  }

  return {
    status: 'Balanced',
    description: `Energi chakra ${chakra} berada dalam kondisi harmonis, stabil, dan mendukung potensi diri.`,
  };
}

/**
 * Analisis seluruh sistem 7 chakra Destiny Matrix.
 */
export function analyzeChakras(matrix: DestinyMatrix): ChakraData[] {
  if (!matrix || !matrix.points) {
    throw new Error('DestinyMatrix dan matrix.points harus disediakan.');
  }

  return CHAKRA_MAP.map(spec => {
    // 1. Ekstraksi Nilai Fisik & Energi
    const rawPhysical = matrix.points[spec.physicalKey as keyof typeof matrix.points];
    const rawEnergy = matrix.points[spec.energyKey as keyof typeof matrix.points];

    const physical = extractPointValue(rawPhysical as any);
    const energy = extractPointValue(rawEnergy as any);

    // 2. Sintesis Total Energi Chakra (Aturan Reduksi 22 Arcana Ladini)
    const total = reduceToArcana(physical + energy);

    // 3. Evaluasi Status Keseimbangan
    const result = evaluateStatus(total, spec.name);

    return {
      name: spec.name,
      sanskritName: spec.sanskritName,
      physicalValue: physical,
      energyValue: energy,
      totalValue: total,
      status: result.status,
      description: result.description,
    };
  });
}
