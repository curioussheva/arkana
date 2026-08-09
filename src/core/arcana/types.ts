// src/core/arcana/types.ts

export type ArcanaElement = 'Fire' | 'Water' | 'Air' | 'Earth';

export type ArcanaPolarity = 'Yin' | 'Yang';

export interface ArcanaNarrative {
  overview: string;
  personality: string;
  career: string;
  relationship: string;
  spirituality: string;
  challenge: string;
  advice: string;
  potential?: string;
  finance?: string;
  health?: string;
  affirmation?: string;
}

export interface ArcanaDefinition {
  // ==========================================================
  // Identity
  // ==========================================================

  id: number;

  tarotName: string;

  matrixName: string;

  shortName: string;

  archetype: string;

  // ==========================================================
  // Correspondence
  // ==========================================================

  element: ArcanaElement;

  polarity: ArcanaPolarity;

  planet?: string;

  zodiac?: string;

  chakra?: string;

  season?: string;

  energyLevel: number;

  // ==========================================================
  // Symbolism
  // ==========================================================

  colors: string[];

  symbols: string[];

  animals: string[];

  crystals: string[];

  // ==========================================================
  // Meanings
  // ==========================================================

  keywords: string[];

  summary: string;

  uprightMeaning: string;

  reversedMeaning: string;

  // ==========================================================
  // Personality
  // ==========================================================

  positiveTraits: string[];

  shadowTraits: string[];

  strengths: string[];

  weaknesses: string[];

  gifts: string[];

  fears: string[];

  // ==========================================================
  // Destiny Matrix
  // ==========================================================

  talents: string[];

  lifeMission: string[];

  karmicLessons: string[];

  spiritualLessons: string[];

  // ==========================================================
  // Practical Life
  // ==========================================================

  career: string[];

  finance: string[];

  relationship: string[];

  family: string[];

  friendship: string[];

  health: string[];

  // ==========================================================
  // Self Development
  // ==========================================================

  advice: string[];

  affirmations: string[];

  meditation: string[];

  dailyPractice: string[];

  // ==========================================================
  // Compatibility
  // ==========================================================

  compatibleElements: ArcanaElement[];

  difficultElements: ArcanaElement[];

  // ==========================================================
  // Ready-to-use Narrative
  // ==========================================================

  narrative: ArcanaNarrative;
}

export interface ArcanaSearchResult {
  arcana: ArcanaDefinition;

  score: number;

  matchedFields: string[];
}

export interface BirthDateInput {
  day: number;
  month: number;
  year: number;
}
