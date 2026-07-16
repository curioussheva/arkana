// src/core/destiny-matrix/analysis/advanced.ts

import type { DestinyMatrix } from '../types';
import { analyzeYinYang } from './yin-yang';
import { analyzeChakras } from './chakra';
import { analyzeKarmicTail } from './karmic-tail';

export interface AdvancedAnalysis {
  yinYang: ReturnType<typeof analyzeYinYang>;
  karmicTail: ReturnType<typeof analyzeKarmicTail>;
  chakras: ReturnType<typeof analyzeChakras>;
}

/**
 * Analisis lanjutan Destiny Matrix.
 *
 * Menggabungkan:
 * - Yin / Yang
 * - Karmic Tail
 * - Chakra
 */
export function analyzeAdvanced(
  matrix: DestinyMatrix
): AdvancedAnalysis {
  return {
    yinYang: analyzeYinYang(matrix),
    karmicTail: analyzeKarmicTail(matrix),
    chakras: analyzeChakras(matrix),
  };
}