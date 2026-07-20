import type { DestinyMatrix, DestinyPointKey } from '../types';
import type { ArcanaElement } from '../../arcana/types';

export interface ArcanaFrequencyEntry {
  id: number;
  count: number;
  points: DestinyPointKey[];
  cardName: string;
}

export interface ArcanaStatistics {
  totalPoints: number;
  avgValue: number;
  stdDev: number;
  uniqueCount: number;
  diversityRatio: number;
  representativeCard: ArcanaFrequencyEntry | null;
}

export function analyzeArcanaStatistics(matrix: DestinyMatrix): ArcanaStatistics {
  if (!matrix?.points) {
    return {
      totalPoints: 0,
      avgValue: 11,
      stdDev: 0,
      uniqueCount: 0,
      diversityRatio: 0,
      representativeCard: null,
    };
  }

  const entries = Object.entries(matrix.points) as [DestinyPointKey, DestinyMatrix['points'][DestinyPointKey]][];
  const totalPoints = entries.length;

  const values: number[] = [];
  const frequencyMap: Record<number, ArcanaFrequencyEntry> = {};

  entries.forEach(([key, point]) => {
    const rawId = point?.arcana?.id ?? 0;
    const cleanId = rawId === 0 ? 22 : rawId;
    values.push(cleanId);

    if (!frequencyMap[cleanId]) {
      frequencyMap[cleanId] = {
        id: cleanId,
        count: 0,
        points: [],
        cardName: point?.arcana?.matrixName || point?.arcana?.tarotName || `Arcana ${cleanId}`,
      };
    }
    frequencyMap[cleanId].count++;
    frequencyMap[cleanId].points.push(key);
  });

  const mean = totalPoints ? values.reduce((s, v) => s + v, 0) / totalPoints : 11;
  const variance = totalPoints
    ? values.reduce((s, v) => s + (v - mean) ** 2, 0) / totalPoints
    : 0;
  const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

  const sortedCards = Object.values(frequencyMap).sort((a, b) => b.count - a.count);
  const representativeCard = sortedCards[0]?.count > 1 ? sortedCards[0] : null;
  const uniqueCount = sortedCards.length;
  const diversityRatio = totalPoints ? Math.round((uniqueCount / totalPoints) * 100) : 0;

  return {
    totalPoints,
    avgValue: Math.round(mean),
    stdDev,
    uniqueCount,
    diversityRatio,
    representativeCard,
  };
}

/**
 * Sumber kebenaran tunggal untuk "total titik" matrix.
 * Dipakai oleh MatrixScreen, InsightScreen, dan modul lain yang perlu menampilkan jumlah titik.
 */
export function getTotalPointsCount(matrix: DestinyMatrix | null | undefined): number {
  if (!matrix?.points) return 0;
  return Object.keys(matrix.points).length;
}