// src/core/destiny-matrix/analysis/helpers.ts

/**
 * Mengambil kalimat pertama dari sebuah paragraf.
 */
export function firstSentence(text: string): string {
  if (!text) return '';

  const sentence = text.split('. ')[0].trim();

  return sentence.endsWith('.') ? sentence : `${sentence}.`;
}

/**
 * Mengubah huruf pertama menjadi lowercase.
 */
export function lowercaseFirst(text: string): string {
  if (!text.length) return '';

  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Memilih satu item secara acak dari array.
 */
export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Mengganti placeholder pada template.
 *
 * Contoh:
 * "{card} adalah {meaning}"
 */
export function replaceTemplate(template: string, values: Record<string, string>): string {
  let result = template;

  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, value);
  }

  return result;
}

/**
 * Membersihkan whitespace berlebih.
 */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Menggabungkan beberapa paragraf tanpa menghasilkan spasi kosong.
 */
export function joinParagraphs(...paragraphs: Array<string | undefined | null>): string {
  return paragraphs
    .filter((text): text is string => typeof text === 'string' && text.trim().length > 0)
    .map(normalizeText)
    .join(' ');
}

/**
 * Mengambil meaning Arcana dengan aman.
 */
export function safeMeaning(meaning?: string | null): string {
  return firstSentence(meaning ?? '');
}

/**
 * Menghasilkan string fallback jika kosong.
 */
export function fallbackText(value: string | undefined | null, fallback = 'Unknown'): string {
  return value?.trim() ? value : fallback;
}
