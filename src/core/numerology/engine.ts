import {
  type NumerologyInput,
  type BirthDateInput,
  type CoreMatrix,
  type EnergyGrid,
  type ArkanaInfo,
  type EnergyMatrix,
  type CalculationOptions,
} from './types';
import { ARKANA_CARDS } from './arkana';

// ─── Constants ──────────────────────────────────────────────────

const MASTER_NUMBERS = [11, 22, 33];

// NOTE: karmic debt numbers (13, 14, 16, 19) + CalculationOptions.includeKarmicDebt
// are not implemented yet — the toggle exists but currently does nothing.
// Tracked as a follow-up; removed the unused constant to keep lint clean
// until the feature is actually built.

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// ─── Utility Functions ──────────────────────────────────────────

function parseBirthDate(dateStr: string): BirthDateInput {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { day, month, year };
}

function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

function reduceDigits(n: number, options: CalculationOptions): number {
  if (n === 0) return 0;

  let num = Math.abs(n);

  // Keep master numbers if enabled
  if (options.includeMasterNumbers && MASTER_NUMBERS.includes(num)) {
    return num;
  }

  // Reduce to single digit
  while (num >= 10) {
    num = sumDigits(num);
    if (options.includeMasterNumbers && MASTER_NUMBERS.includes(num)) {
      return num;
    }
  }

  return num;
}

function isVowel(char: string): boolean {
  return VOWELS.has(char.toUpperCase());
}

function nameToNumbers(name: string): number[] {
  return name
    .toUpperCase()
    .split('')
    .filter((c) => /[A-Z]/.test(c))
    .map((c) => PYTHAGOREAN_MAP[c] || 0)
    .filter((n) => n > 0);
}

// ─── Core Calculations ──────────────────────────────────────────

function calculateLifePath(date: BirthDateInput, options: CalculationOptions): number {
  const total = date.day + date.month + date.year;
  return reduceDigits(total, options);
}

function calculateDestiny(date: BirthDateInput, options: CalculationOptions): number {
  const daySum = sumDigits(date.day);
  const monthSum = sumDigits(date.month);
  const yearSum = sumDigits(date.year);
  return reduceDigits(daySum + monthSum + yearSum, options);
}

function calculateSoulUrge(name: string, options: CalculationOptions): number {
  const numbers = nameToNumbers(name);
  const vowelNumbers = numbers.filter((_, i) => isVowel(name[i]));
  return reduceDigits(vowelNumbers.reduce((a, b) => a + b, 0), options);
}

function calculatePersonality(name: string, options: CalculationOptions): number {
  const numbers = nameToNumbers(name);
  const consonantNumbers = numbers.filter((_, i) => !isVowel(name[i]));
  return reduceDigits(consonantNumbers.reduce((a, b) => a + b, 0), options);
}

function calculateExpression(name: string, options: CalculationOptions): number {
  const numbers = nameToNumbers(name);
  return reduceDigits(numbers.reduce((a, b) => a + b, 0), options);
}

function calculateBirthday(day: number, options: CalculationOptions): number {
  return reduceDigits(day, options);
}

function calculateMaturity(lifePath: number, destiny: number, options: CalculationOptions): number {
  return reduceDigits(lifePath + destiny, options);
}

function calculateChallenges(date: BirthDateInput, options: CalculationOptions): number[] {
  const day = reduceDigits(date.day, { ...options, includeMasterNumbers: false });
  const month = reduceDigits(date.month, { ...options, includeMasterNumbers: false });
  const year = reduceDigits(date.year, { ...options, includeMasterNumbers: false });

  return [
    Math.abs(month - day),      // First challenge (0-30)
    Math.abs(day - year),       // Second challenge (0-30)
    Math.abs(month - year),     // Third challenge (0-30)
    Math.abs((month + day) - year), // Fourth challenge (0-30)
  ].map((n) => reduceDigits(n, options));
}

function calculatePinnacles(date: BirthDateInput, options: CalculationOptions): number[] {
  const day = reduceDigits(date.day, { ...options, includeMasterNumbers: false });
  const month = reduceDigits(date.month, { ...options, includeMasterNumbers: false });
  const year = reduceDigits(date.year, { ...options, includeMasterNumbers: false });

  return [
    reduceDigits(month + day, options),           // First pinnacle (0-36)
    reduceDigits(day + year, options),            // Second pinnacle (36-45)
    reduceDigits(month + year, options),          // Third pinnacle (45-54)
    reduceDigits(month + day + year, options),    // Fourth pinnacle (54+)
  ];
}

function calculatePersonalYear(date: BirthDateInput, options: CalculationOptions): number {
  const today = new Date();
  const yearSum = sumDigits(today.getFullYear());
  return reduceDigits(date.day + date.month + yearSum, options);
}

function calculatePersonalMonth(personalYear: number, options: CalculationOptions): number {
  const today = new Date();
  return reduceDigits(personalYear + today.getMonth() + 1, options);
}

function calculatePersonalDay(personalMonth: number, options: CalculationOptions): number {
  const today = new Date();
  return reduceDigits(personalMonth + today.getDate(), options);
}

// ─── Energy Grid ────────────────────────────────────────────────

function generateEnergyGrid(core: CoreMatrix): EnergyGrid {
  const size = 9;
  const cells: EnergyGrid['cells'] = [];

  // Generate 9x9 grid based on numerological patterns
  const baseNumbers = [
    core.lifePath,
    core.destiny,
    core.soulUrge,
    core.personality,
    core.expression,
    core.birthday,
    core.maturity,
    core.personalYear,
    core.personalMonth,
  ];

  for (let row = 0; row < size; row++) {
    const rowCells: EnergyGrid['cells'][number] = [];
    for (let col = 0; col < size; col++) {
      // Algorithm: combine row and column influences
      const baseIndex = (row + col) % baseNumbers.length;
      const modifier = Math.abs(row - col) + 1;
      const value = reduceDigits(baseNumbers[baseIndex] * modifier, {
        system: 'pythagorean',
        includeMasterNumbers: false,
        includeKarmicDebt: false,
        language: 'id',
      });

      // Calculate intensity based on position and core numbers
      const isAligned = baseNumbers.includes(value);
      const intensity = isAligned
        ? 0.7 + Math.random() * 0.3
        : 0.1 + Math.random() * 0.5;

      // Color based on intensity
      const hue = isAligned ? 200 + (value * 20) % 60 : 0;
      const saturation = Math.round(intensity * 100);
      const lightness = Math.round(30 + intensity * 40);

      rowCells.push({
        value,
        intensity: Math.round(intensity * 100) / 100,
        position: { row, col },
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      });
    }
    cells.push(rowCells);
  }

  // Calculate summary
  const allValues = cells.flat().map((c) => c.value);
  const valueCounts = allValues.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const dominantNumber = Object.entries(valueCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0]
    ? parseInt(Object.entries(valueCounts).sort((a, b) => b[1] - a[1])[0][0])
    : 1;

  const weakestNumber = Object.entries(valueCounts)
    .sort((a, b) => a[1] - b[1])[0]?.[0]
    ? parseInt(Object.entries(valueCounts).sort((a, b) => a[1] - b[1])[0][0])
    : 9;

  const avgIntensity = cells.flat().reduce((sum, c) => sum + c.intensity, 0) / (size * size);
  const balance = 1 - (Math.max(...allValues) - Math.min(...allValues)) / 9;

  return {
    dimensions: [size, size],
    cells,
    summary: {
      dominantNumber,
      weakestNumber,
      balance: Math.round(balance * 100) / 100,
      intensity: Math.round(avgIntensity * 100) / 100,
    },
  };
}

// ─── Arkana Mapping ─────────────────────────────────────────────

function mapToArkana(lifePath: number, destiny: number): ArkanaInfo {
  // FIXED (was: reduceDigits(...) with includeMasterNumbers:false before
  // the modulo, which always collapsed the sum to a single digit 0-9,
  // making cards 10-21 unreachable). Now the raw sum is modulo'd directly
  // against the full 22-card range, so every Arkana card is reachable.
  const combined = lifePath + destiny;
  const arkanaNumber = ((combined % 22) + 22) % 22; // safe against negative sums
  return ARKANA_CARDS[arkanaNumber];
}

// ─── Main Engine ────────────────────────────────────────────────

export class NumerologyEngine {
  private options: CalculationOptions;

  constructor(options: Partial<CalculationOptions> = {}) {
    this.options = {
      system: 'pythagorean',
      includeMasterNumbers: true,
      includeKarmicDebt: true,
      language: 'id',
      ...options,
    };
  }

  calculate(input: NumerologyInput): EnergyMatrix {
    const date = parseBirthDate(input.birthDate);

    // Core calculations
    const lifePath = calculateLifePath(date, this.options);
    const destiny = calculateDestiny(date, this.options);
    const soulUrge = calculateSoulUrge(input.name, this.options);
    const personality = calculatePersonality(input.name, this.options);
    const expression = calculateExpression(input.name, this.options);
    const birthday = calculateBirthday(date.day, this.options);
    const maturity = calculateMaturity(lifePath, destiny, this.options);
    const challenge = calculateChallenges(date, this.options);
    const pinnacle = calculatePinnacles(date, this.options);
    const personalYear = calculatePersonalYear(date, this.options);
    const personalMonth = calculatePersonalMonth(personalYear, this.options);
    const personalDay = calculatePersonalDay(personalMonth, this.options);

    const core: CoreMatrix = {
      lifePath,
      destiny,
      soulUrge,
      personality,
      expression,
      birthday,
      maturity,
      challenge,
      pinnacle,
      personalYear,
      personalMonth,
      personalDay,
    };

    // Energy grid
    const energyGrid = generateEnergyGrid(core);

    // Arkana
    const arkana = mapToArkana(lifePath, destiny);

    return {
      version: '1.0.0',
      calculatedAt: new Date().toISOString(),
      input,
      matrix: core,
      energyGrid,
      arkana,
    };
  }

  updateOptions(options: Partial<CalculationOptions>): void {
    this.options = { ...this.options, ...options };
  }

  getOptions(): CalculationOptions {
    return { ...this.options };
  }
}

// Singleton instance
let defaultEngine: NumerologyEngine | null = null;

export function getEngine(options?: Partial<CalculationOptions>): NumerologyEngine {
  if (!defaultEngine) {
    defaultEngine = new NumerologyEngine(options);
  }
  return defaultEngine;
}

export function resetEngine(): void {
  defaultEngine = null;
}
 