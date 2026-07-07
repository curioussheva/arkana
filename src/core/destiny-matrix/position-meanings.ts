import type { DestinyPointKey } from './types';

/**
 * Template interpretasi untuk setiap titik di Destiny Matrix.
 * {card} akan diganti dengan nama kartu Arcana, {meaning} dengan makna singkat.
 */
export const POSITION_CONTEXTS: Record<DestinyPointKey, string> = {
  A: 'Di posisi Hari Lahir, {card} hadir sebagai identitas dasar Anda. {meaning}',
  B: 'Bulan Lahir Anda diwakili oleh {card}, menunjukkan cara Anda merespon emosi dan orang lain. {meaning}',
  C: 'Garis Keturunan Anda diisi oleh {card}, membawa warisan energi leluhur. {meaning}',
  D: 'Sintesis Pertama Anda adalah {card}, menggambarkan arah hidup yang terbentuk. {meaning}',
  E: 'Esensi Jiwa Anda adalah {card}. Inilah inti dari perjalanan spiritual Anda. {meaning}',
  F: 'Zona Nyaman Anda beresonansi dengan {card}. Di sini Anda merasa aman. {meaning}',
  G: 'Zona Sosial Anda diisi oleh {card}, mencerminkan interaksi dengan lingkungan. {meaning}',
  H: 'Zona Tantangan Anda adalah {card}. Pelajaran yang perlu dihadapi. {meaning}',
  I: 'Zona Keseimbangan Anda dijaga oleh {card}, titik harmonisasi energi. {meaning}',
  J: 'Bakat Tersembunyi Anda terungkap melalui {card}. {meaning}',
  K: 'Kekuatan Batin Anda bersumber dari {card}. {meaning}',
  L: 'Potensi Spiritual Anda dibimbing oleh {card}. {meaning}',
  M: 'Arah Perkembangan Anda ditandai oleh {card}. {meaning}',
  N: 'Ekstensi Keturunan I diwakili oleh {card}, memperdalam makna garis keturunan. {meaning}',
  O: 'Ekstensi Keturunan II: {card} memberikan lapisan pemahaman baru. {meaning}',
  P: 'Ekstensi Keturunan III: {card} melengkapi warisan spiritual. {meaning}',
  Q: 'Ekstensi Kepribadian: {card} memperluas identitas Anda. {meaning}',
  R: 'Ekstensi Tujuan Hidup: {card} menguatkan arah takdir. {meaning}',
  S: 'Ekstensi Garis Keturunan: {card} menambah kedalaman akar. {meaning}',
  T: 'Ekstensi Sintesis: {card} mengintegrasikan semua aspek. {meaning}',
  A1: 'Ekstensi Spiritual I: {card} menunjukkan lapisan pertama perjalanan spiritual. {meaning}',
  A2: 'Ekstensi Spiritual II: {card} membawa pesan penting. {meaning}',
  A3: 'Ekstensi Spiritual III: {card} menutup siklus spiritual. {meaning}',
  B1: 'Ekstensi Tujuan I: {card} memperjelas tujuan hidup. {meaning}',
  B2: 'Ekstensi Tujuan II: {card} menegaskan panggilan. {meaning}',
  B3: 'Ekstensi Tujuan III: {card} menyempurnakan misi. {meaning}',
  C1: 'Ekstensi Keturunan I (Sub): {card} mewarnai garis ibu. {meaning}',
  C2: 'Ekstensi Keturunan II (Sub): {card} meneruskan energi ayah. {meaning}',
  C3: 'Ekstensi Keturunan III (Sub): {card} menyatukan kedua garis. {meaning}',
  D1: 'Ekstensi Sintesis I (Sub): {card} sebagai katalis perubahan. {meaning}',
  D2: 'Ekstensi Sintesis II (Sub): {card} membawa stabilitas. {meaning}',
  D3: 'Ekstensi Sintesis III (Sub): {card} menyelesaikan sintesis. {meaning}',
  E1: 'Aspek Personal I: {card} membentuk hubungan dengan diri sendiri. {meaning}',
  E2: 'Aspek Personal II: {card} memengaruhi hubungan dengan pasangan. {meaning}',
};

/**
 * Menghasilkan interpretasi untuk satu titik matriks.
 * @param key - Kunci titik (A, B, C, ...)
 * @param cardName - Nama kartu Arcana
 * @param meaningSnippet - Makna upright yang sudah diringkas (kalimat pertama)
 * @returns String interpretasi yang sudah diisi
 */
export function getPositionInterpretation(
  key: DestinyPointKey,
  cardName: string,
  meaningSnippet: string
): string {
  const template = POSITION_CONTEXTS[key] || '{card} hadir di titik {key}. {meaning}';
  return template
    .replace('{card}', cardName)
    .replace('{meaning}', meaningSnippet)
    .replace('{key}', key);
}