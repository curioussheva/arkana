// src/features/insight/types.ts

import type { DestinyInsight, DestinyMatrix } from '@core/destiny-matrix';

import type { ChakraData } from '@core/destiny-matrix/analysis/chakra';
import type { YinYangAnalysis } from '@core/destiny-matrix/analysis/yin-yang';
import type { KarmicTailAnalysis } from '@core/destiny-matrix/analysis/karmic-tail';

export type InsightTab = 'blueprint' | 'energy' | 'evolution';

export interface InsightViewModel {
  matrix: DestinyMatrix;
  insight: DestinyInsight;
}

export interface BlueprintSectionProps {
  insight: DestinyInsight;
}

export interface EnergySectionProps {
  yinYang: YinYangAnalysis;
  chakras: ChakraData[];
  karmicTail: KarmicTailAnalysis;
}

export interface InsightHeaderProps {
  profileName: string;
}

export interface InsightCardProps {
  title: string;
  children: React.ReactNode;
}

export interface InsightSharePayload {
  title: string;
  message: string;
}
