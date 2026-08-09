// src/core/destiny-matrix/utils.ts
import type { BirthDateInput } from '../arcana/types';

/**
 * Membantu menghitung total nilai matematika dari tiap karakter angka.
 */
export function sumDigits(n: number): number {
  if (isNaN(n) || !isFinite(n)) return 0;
  return String(Math.abs(Math.floor(n)))
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

/**
 * Mengurangi angka ke rentang Major Arcana 1-22 sesuai pakem Natalia Ladini.
 * Jika angka <= 22, langsung dikembalikan.
 * Jika angka > 22, dijumlahkan digit-digitnya hingga <= 22.
 */
export function reduceToArcana(num: number): number {
  if (isNaN(num) || num <= 0) return 0;

  while (num > 22) {
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  return num;
}

/**
 * Mengurai string tanggal berformat YYYY-MM-DD, DD/MM/YYYY, atau DD-MM-YYYY secara fleksibel.
 */
export function parseBirthDate(dateStr: string): BirthDateInput {
  if (!dateStr || typeof dateStr !== 'string') {
    return { day: 1, month: 1, year: 1990 };
  }

  // Normalisasi pemisah (ganti slash dengan dash)
  const normalized = dateStr.replace(/\//g, '-').trim();
  const parts = normalized.split('-').map(p => parseInt(p, 10));

  if (parts.some(p => isNaN(p))) {
    return { day: 1, month: 1, year: 1990 };
  }

  // Jika format YYYY-MM-DD (bagian pertama adalah Tahun 4 digit)
  if (parts[0] > 31) {
    return {
      year: parts[0],
      month: parts[1] || 1,
      day: parts[2] || 1,
    };
  }

  // Jika format DD-MM-YYYY (bagian terakhir adalah Tahun 4 digit)
  return {
    day: parts[0] || 1,
    month: parts[1] || 1,
    year: parts[2] || 1990,
  };
}
