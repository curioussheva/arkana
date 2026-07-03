// ─── Input Types ────────────────────────────────────────────────

export interface BirthDateInput {
  day: number;
  month: number;
  year: number;
}

export interface NumerologyInput {
  birthDate: string; // ISO 8601: YYYY-MM-DD
  name: string;
}

// ─── Core Matrix Types ──────────────────────────────────────────

export interface CoreMatrix {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  expression: number;
  birthday: number;
  maturity: number;
  challenge: number[]; // 4 angka tantangan
  pinnacle: number[]; // 4 angka puncak
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

// ─── Energy Grid Types ──────────────────────────────────────────

export interface EnergyCell {
  value: number;
  intensity: number; // 0.0 - 1.0
  position: { row: number; col: number };
  color: string;
}

export interface EnergyGrid {
  dimensions: [number, number]; // [rows, cols]
  cells: EnergyCell[][];
  summary: {
    dominantNumber: number;
    weakestNumber: number;
    balance: number; // 0.0 - 1.0
    intensity: number; // 0.0 - 1.0
  };
}

// ─── Arkana Types ───────────────────────────────────────────────

export interface ArkanaInfo {
  card: string;
  number: number;
  element: 'Fire' | 'Water' | 'Air' | 'Earth';
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
}

// ─── Complete Energy Matrix ─────────────────────────────────────

export interface EnergyMatrix {
  version: string;
  calculatedAt: string; // ISO 8601
  input: NumerologyInput;
  matrix: CoreMatrix;
  energyGrid: EnergyGrid;
  arkana: ArkanaInfo;
}

// ─── AI Types ───────────────────────────────────────────────────

export interface MicroTask {
  id: string;
  type: 'career' | 'love' | 'health' | 'spiritual' | 'finance' | 'social';
  action: string;
  description: string;
  duration: string; // e.g., "15 min", "30 min", "1 hour"
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

export interface AIInsight {
  narrative: string;
  recommendations: MicroTask[];
  confidence: number;
  modelVersion: string;
  generatedAt: string;
}

// ─── Timeline Types ─────────────────────────────────────────────

export interface TimelineData {
  date: string; // ISO 8601
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  intensity: number;
  events?: string[];
}

// ─── Export Types ───────────────────────────────────────────────

export interface ExportOptions {
  format: 'pdf' | 'png';
  includeMatrix: boolean;
  includeInsights: boolean;
  includeTimeline: boolean;
  includeArkana: boolean;
  dateRange?: { start: string; end: string };
}

// ─── App State Types ────────────────────────────────────────────

export interface AppState {
  currentMatrix: EnergyMatrix | null;
  currentInsight: AIInsight | null;
  isCalculating: boolean;
  isGeneratingInsight: boolean;
  error: string | null;
}

// ─── Numerology System Types ────────────────────────────────────

export type NumerologySystem = 'pythagorean' | 'chaldean' | 'kabbalah';

export interface CalculationOptions {
  system: NumerologySystem;
  includeMasterNumbers: boolean;
  includeKarmicDebt: boolean;
  language: 'id' | 'en';
}
