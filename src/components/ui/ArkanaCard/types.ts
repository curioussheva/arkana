// src/components/ui/ArkanaCard/types.ts
//import type { ArkanaInfo } from '@core/numerology/types';

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';

export const ELEMENT_STYLES: Record<ElementType, {
  color: string;
  gradient: [string, string];
  icon: string;
  aura: string;
}> = {
  Fire: {
    color: '#FF6B35',
    gradient: ['#FF6B35', '#FF8C42'],
    icon: '🔥',
    aura: 'rgba(255, 107, 53, 0.15)',
  },
  Water: {
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#44B5AD'],
    icon: '💧',
    aura: 'rgba(78, 205, 196, 0.15)',
  },
  Air: {
    color: '#FFE66D',
    gradient: ['#FFE66D', '#FFD93D'],
    icon: '💨',
    aura: 'rgba(255, 230, 109, 0.15)',
  },
  Earth: {
    color: '#6B8E23',
    gradient: ['#6B8E23', '#556B2F'],
    icon: '🌍',
    aura: 'rgba(107, 142, 35, 0.15)',
  },
};