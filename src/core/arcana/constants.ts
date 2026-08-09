// src/core/arcana/constants.ts

export const ARCANA_COUNT = 22;

export const MASTER_NUMBERS = [11, 22] as const;

export const ARCANA_ELEMENTS = ['Fire', 'Water', 'Air', 'Earth'] as const;

export const ARCANA_CHAKRAS = [
  'Root',
  'Sacral',
  'Solar Plexus',
  'Heart',
  'Throat',
  'Third Eye',
  'Crown',
] as const;

export const ARCANA_COMPATIBILITY = {
  sameElement: 90,
  complementary: 75,
  neutral: 60,
  conflicting: 40,
} as const;

export const ELEMENT_COMPATIBILITY = {
  Fire: {
    Fire: 90,
    Air: 85,
    Earth: 55,
    Water: 45,
  },

  Water: {
    Water: 90,
    Earth: 85,
    Fire: 45,
    Air: 55,
  },

  Air: {
    Air: 90,
    Fire: 85,
    Water: 55,
    Earth: 45,
  },

  Earth: {
    Earth: 90,
    Water: 85,
    Air: 45,
    Fire: 55,
  },
} as const;

export const NARRATIVE_LEVEL = {
  excellent: 90,
  good: 75,
  balanced: 60,
  challenge: 45,
} as const;

export const DEFAULT_COLOR = '#7C3AED';

export const DEFAULT_SYMBOL = '✦';

export const ARCANA_VERSION = '1.0.0';
