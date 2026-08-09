// src/core/destiny-matrix/analysis/positions.ts
import type { DestinyPointKey } from '../types';

export const POSITION_CONTEXTS: Partial<Record<DestinyPointKey, string>> = {
  A: 'Di posisi Hari Lahir, {card} hadir sebagai identitas dasar dan karakter mental utamamu. {meaning}',
  B: 'Bulan Lahirmu diwakili oleh {card}, menunjukkan perlindungan spiritual serta caramu merespons intuisi. {meaning}',
  C: 'Garis Keturunan Material diisi oleh {card}, membawa pola tantangan keuangan masa lalu dari leluhurmu. {meaning}',
  D: 'Sintesis Pertamamu adalah {card}, menggambarkan gerbang pola karma (karmic tail) yang membentuk arah hidupmu. {meaning}',
  E: 'Esensi Jiwamu adalah {card}. Inilah pusat kenyamanan batin dan jati dirimu yang paling murni. {meaning}',

  // Penyelarasan Akurat Sudut Kotak Tegak Keluarga (Ancestral Square)
  F: 'Garis Leluhur Ayah (Spiritual - Top Left) beresonansi dengan {card}. Titik ini menyempurnakan misi penyembuhan energi maskulin spiritual dalam dirimu. {meaning}',
  G: 'Garis Leluhur Ibu (Spiritual - Top Right) diisi oleh {card}. Titik ini mencerminkan pengembangan potensi feminin intuitif dari garis keturunanmu. {meaning}',
  H: 'Garis Leluhur Ayah (Material - Bottom Right) adalah {card}. Pelajaran silsilah materi dan pembersihan beban karma fisik yang harus diurai. {meaning}',
  I: 'Garis Leluhur Ibu (Material - Bottom Left) dijaga oleh {card}. Titik harmonisasi konflik duniawi dan penyeimbang kestabilan emosi material silsilah. {meaning}',

  // Inner Cross Dasar
  J: 'Bakat Tersembunyi di jalur karaktermu diaktifkan melalui simbolisme {card}, mengalirkan energi langsung menuju pusat esensi jiwamu. {meaning}',
  K: 'Kekuatan Batin spiritualmu bersumber dari manifestasi {card}, menegaskan panggilan batin untuk menyatu dengan kenyamanan jiwa. {meaning}',
  L: 'Potensi Spiritual di jalur finansial dibimbing oleh getaran {card}, meneruskan kestabilan potensi spiritual ke dalam manajemen aset nyata. {meaning}',
  M: 'Arah Perkembangan karier dan takdir keuanganmu ditandai oleh {card}, membawa stabilitas mental saat kamu berhadapan dengan ujian kehidupan yang berulang. {meaning}',

  // Koreksi Konteks Fungsional Money & Love Channel (N, O, P)
  N: 'Di Pusat Saluran Hubungan & Finansial (LM_Center), {card} hadir sebagai titik temu keseimbangan asmara dan kemakmuran hidupmu. {meaning}',
  O: 'Pada Jalur Finansial Utama (Money/O), {card} mengontrol potensi rezeki, magnet bisnis, serta ambisi materi duniamu. {meaning}',
  P: 'Pada Jalur Hubungan Utama (Love/P), {card} mengontrol dinamika asmara, jodoh ideal, serta harmonisasi hubungan sosial. {meaning}',

  // Ekstensi Sub-Nodes Pendamping (Companion Nodes)
  Q: 'Ekstensi Kepribadian luar: {card} memperluas topeng egomu di mata publik, menjembatani manifestasi fisik karakter dari ego luar menuju potensi batin. {meaning}',
  R: 'Ekstensi Tujuan Hidup makro: {card} menguatkan magnet penarik takdirmu, memperjelas visi idealis spiritual dari malaikat pelindungmu. {meaning}',
  S: 'Ekstensi Garis Keturunan bawah: {card} menambah kedalaman fondasi materialmu, bertindak sebagai pembuka blokir gerbang rezeki material leluhur. {meaning}',
  T: 'Ekstensi Sintesis kiri: {card} mengintegrasikan tantangan karma masa lalu, bertindak sebagai katalis pengurai lilitan utang karma masa lalu. {meaning}',
};

export const POSITION_ADVICES: Partial<Record<DestinyPointKey, string>> = {
  A: 'Sebagai panduan Hari Lahir, energi {card} memintamu untuk menyadari potensi jebakan egomu. Langkah terbaikmu: {advice}',
  B: 'Tantangan spiritual Bulan Lahirmu ({card}) dapat diatasi dengan melatih intuisi. Nasihat untukmu: {advice}',
  C: 'Untuk mengurai sumbatan finansial leluhur lewat jalur {card}, kamu disarankan untuk mengubah pola pikir materi. Solusinya: {advice}',
  D: 'Kunci pelepasan beban masa lalu (Karmic Tail) milikmu berada pada kendali energi {card}. Langkah penyembuhannya: {advice}',
  E: 'Agar Esensi Jiwamu ({card}) tetap selaras dan damai, luangkan waktu secara rutin untuk melakukan terapi batin ini: {advice}',

  // Nasihat Solutif Kotak Leluhur
  F: 'Nasihat penyeimbang Leluhur Ayah (Spiritual - {card}): Aktifkan kebijaksanaan maskulin spiritualmu dengan cara: {advice}',
  G: 'Nasihat penyeimbang Leluhur Ibu (Spiritual - {card}): Dengarkan suara batin silsilah femininmu dengan langkah: {advice}',
  H: 'Solusi tantangan Leluhur Ayah (Material - {card}): Langkah pembersihan hambatan finansial dan pemulihan karma kerja: {advice}',
  I: 'Cara harmonisasi Leluhur Ibu (Material - {card}): Langkah konkret menyelaraskan ego fisik dengan kenyamanan emosional materi: {advice}',

  // Inner Cross
  J: 'Untuk mengaktifkan Bakat Tersembunyi dari simbol {card}, cara mengalirkan energinya ke esensi jiwa: {advice}',
  K: 'Guna membangkitkan Kekuatan Batin dari getaran {card}, langkah merespons panggilan batin untuk menyatu dengan jiwa: {advice}',
  L: 'Arah bimbingan potensi spiritual finansialmu ({card}), strategi meneruskan kestabilan ke aset nyata: {advice}',
  M: 'Saran navigasi karier dan takdir keuanganmu ({card}), cara menjaga stabilitas mental saat menghadapi ujian berulang: {advice}',

  // Nasihat Jalur Uang & Cinta yang Presisi
  N: 'Untuk menjaga keseimbangan jembatan Cinta-Uang lewat getaran {card}, integrasikan harmoni hidupmu melalui langkah: {advice}',
  O: 'Untuk mengurai sumbatan di Jalur Keuanganmu ({card}), magnet kemakmuranmu akan aktif maksimal jika kamu: {advice}',
  P: 'Untuk menarik keharmonisan di Jalur Hubungan/Jodohmu ({card}), perbaiki kualitas interaksi asmaramu dengan: {advice}',

  // Companions
  Q: 'Cara menyelaraskan topeng ego publikmu ({card}), panduan aksi menjembatani manifestasi fisik karakter: {advice}',
  R: 'Saran untuk memperkuat magnet penarik takdir makro ({card}), cara memperjelas visi idealis spiritual pelindungmu: {advice}',
  S: 'Panduan memperkokoh pondasi material bawah ({card}), langkah konkret pembuka blokir gerbang rezeki: {advice}',
  T: 'Cara mengintegrasikan tantangan karma masa lalu ({card}), tindakan nyata sebagai katalis pengurai utang karma: {advice}',
};

/**
 * Peta alias untuk menyelaraskan nama key alternatif (seperti alias UI atau channel)
 * ke key alfabet dasar (A - T)
 */
const ALIAS_KEY_MAP: Record<string, DestinyPointKey> = {
  LM_Center: 'N',
  Money: 'O',
  Love: 'P',
  A1: 'J',
  B1: 'K',
  C1: 'L',
  D1: 'M',
  SubA: 'Q',
  SubB: 'R',
  SubC: 'S',
  SubD: 'T',
};

/**
 * Normalisasi key ke DestinyPointKey standar
 */
function resolveCanonicalKey(key: DestinyPointKey | string): DestinyPointKey {
  return ALIAS_KEY_MAP[key] ?? (key as DestinyPointKey);
}

/**
 * 1. Menghasilkan interpretasi deskriptif (Untuk Matrix Modal)
 */
export function getPositionInterpretation(
  key: DestinyPointKey | string,
  cardName: string | undefined,
  meaningSnippet: string | undefined
): string {
  const canonicalKey = resolveCanonicalKey(key);
  const template = POSITION_CONTEXTS[canonicalKey] ?? '{card} hadir pada titik {key}. {meaning}';
  const safeCardName = cardName || 'Arcana Rahasia';
  const safeMeaning = meaningSnippet || 'Definisi sedang diproses.';

  return template
    .replace(/{card}/g, safeCardName)
    .replace(/{meaning}/g, safeMeaning)
    .replace(/{key}/g, String(key));
}

/**
 * 2. Menghasilkan nasihat solutif khusus (Untuk Insight Screen)
 */
export function getPositionAdvice(
  key: DestinyPointKey | string,
  cardName: string | undefined,
  adviceSnippet: string | undefined
): string {
  const canonicalKey = resolveCanonicalKey(key);
  const template = POSITION_ADVICES[canonicalKey] ?? 'Nasihat titik {key} ({card}): {advice}';
  const safeCardName = cardName || 'Arcana Rahasia';
  const safeAdvice = adviceSnippet || 'Fokus pada kesadaran diri dan harmonisasi energi hari ini.';

  return template
    .replace(/{card}/g, safeCardName)
    .replace(/{advice}/g, safeAdvice)
    .replace(/{key}/g, String(key));
}
