import type { ArcanaDefinition } from './types';

/**
 * Normalisasi teks untuk pencarian.
 */
export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/**
 * Hilangkan item duplikat.
 */
export function unique(values: string[]): string[] {
  return [...new Set(values)];
}

/**
 * Capitalize huruf pertama.
 */
export function capitalize(value: string): string {
  if (!value.length) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Menggabungkan beberapa array string menjadi satu.
 */
export function mergeKeywords(...arrays: (string[] | undefined)[]): string[] {
  return unique(arrays.flatMap(v => v ?? []));
}

/**
 * Menghitung skor kecocokan sederhana.
 */
export function keywordScore(arcana: ArcanaDefinition, query: string): number {
  const q = normalizeText(query);

  const fields = [
    arcana.tarotName,
    arcana.matrixName,
    ...(arcana.keywords ?? []),
    ...(arcana.positiveTraits ?? []),
    ...(arcana.shadowTraits ?? []),
    ...(arcana.talents ?? []),
    ...(arcana.career ?? []),
    ...(arcana.finance ?? []),
    ...(arcana.relationship ?? []),
    ...(arcana.health ?? []),
    ...(arcana.spiritualLessons ?? []),
    ...(arcana.karmicLessons ?? []),
    ...(arcana.gifts ?? []),
    ...(arcana.fears ?? []),
    ...(arcana.colors ?? []),
    ...(arcana.symbols ?? []),
  ];

  return fields.reduce((score, value) => {
    return normalizeText(value).includes(q) ? score + 1 : score;
  }, 0);
}

/**
 * Mengubah id menjadi nomor Arcana (0-21).
 */
export function normalizeArcanaId(id: number): number {
  return ((id % 22) + 22) % 22;
}
