import type { DestinyPointKey } from '../types';

/**
 * PATH A: DIAGNOSIS STANDAR (Untuk Modal di Matrix Screen)
 * Fokus pada definisi karakter dasar dan apa adanya menggunakan gaya bahasa personal.
 */
export const POSITION_CONTEXTS: Record<DestinyPointKey, string> = {
  A: 'Di posisi Hari Lahir, {card} hadir sebagai identitas dasar dan karakter mental utamamu. {meaning}',
  B: 'Bulan Lahirmu diwakili oleh {card}, menunjukkan perlindungan spiritual serta caramu merespons intuisi. {meaning}',
  C: 'Garis Keturunan Material diisi oleh {card}, membawa pola tantangan keuangan masa lalu dari leluhurmu. {meaning}',
  D: 'Sintesis Pertamamu adalah {card}, menggambarkan gerbang pola karma (karmic tail) yang membentuk arah hidupmu. {meaning}',
  E: 'Esensi Jiwamu adalah {card}. Inilah pusat kenyamanan batin dan jati dirimu yang paling murni. {meaning}',
  F: 'Zona Nyaman Leluhur Kiri-Atas beresonansi dengan {card}, tempat energi masa lalu berkumpul. {meaning}',
  G: 'Zona Sosial Leluhur Kanan-Atas diisi oleh {card}, mencerminkan interaksi sosial silsilah keluargamu. {meaning}',
  H: 'Zona Tantangan Leluhur Bawah-Kanan adalah {card}, pelajaran silsilah materi yang harus diurai. {meaning}',
  I: 'Zona Keseimbangan Leluhur Bawah-Kiri dijaga oleh {card}, titik harmonisasi konflik masa lalu. {meaning}',
  J: 'Bakat Tersembunyi di jalur karaktermu diaktifkan melalui simbolisme {card}. {meaning}',
  K: 'Kekuatan Batin spiritualmu bersumber dari manifestasi {card}. {meaning}',
  L: 'Potensi Spiritual di jalur finansial dibimbing oleh getaran {card}. {meaning}',
  M: 'Arah Perkembangan karier dan takdir keuanganmu ditandai oleh {card}. {meaning}',
  N: 'Ekstensi Keturunan I diwakili oleh {card}, memperdalam makna transformasi garis keturunan. {meaning}',
  O: 'Ekstensi Keturunan II: {card} memberikan lapisan pemahaman esoteris baru pada karma. {meaning}',
  P: 'Ekstensi Keturunan III: {card} melengkapi siklus transisi spiritual leluhur. {meaning}',
  Q: 'Ekstensi Kepribadian luar: {card} memperluas topeng egomu di mata publik. {meaning}',
  R: 'Ekstensi Tujuan Hidup makro: {card} menguatkan magnet penarik takdirmu. {meaning}',
  S: 'Ekstensi Garis Keturunan bawah: {card} menambah kedalaman fondasi materialmu. {meaning}',
  T: 'Ekstensi Sintesis kiri: {card} mengintegrasikan tantangan karma masa lalu. {meaning}',
  A1: 'Ekstensi Jalur Karakter I: {card} menjembatani manifestasi fisik karakter dari ego luar menuju potensi batin. {meaning}',
  A2: 'Ekstensi Jalur Karakter II: {card} mengalirkan energi bakat tersembunyi langsung menuju pusat esensi jiwamu. {meaning}',
  A3: 'Titik Sinkronisasi Karakter-Jiwa: Melalui {card}, ego mental diselaraskan dengan kebenaran batinmu. {meaning}',
  B1: 'Ekstensi Jalur Spiritual I: {card} memperjelas visi idealis spiritual dari malaikat pelindungmu. {meaning}',
  B2: 'Ekstensi Jalur Spiritual II: {card} menegaskan panggilan batin untuk menyatu dengan kenyamanan jiwa. {meaning}',
  B3: 'Titik Sinkronisasi Spiritual-Jiwa: {card} menyempurnakan misi penyembuhan energi maskulin dan feminin dalam dirimu. {meaning}',
  C1: 'Ekstensi Jalur Finansial I: {card} bertindak sebagai pembuka blokir gerbang rezeki material leluhur. {meaning}',
  C2: 'Ekstensi Jalur Finansial II: {card} meneruskan kestabilan potensi spiritual ke dalam manajemen aset nyata. {meaning}',
  C3: 'Titik Sinkronisasi Finansial-Jiwa: {card} menyatukan kelimpahan materi dengan rasa cukup di dalam batinmu. {meaning}',
  D1: 'Ekstensi Jalur Karma I: {card} bertindak sebagai katalis pengurai lilitan utang karma masa lalu. {meaning}',
  D2: 'Ekstensi Jalur Karma II: {card} membawa stabilitas mental saat kamu berhadapan dengan ujian kehidupan yang berulang. {meaning}',
  D3: 'Titik Sinkronisasi Karma-Jiwa: {card} menyelesaikan pembersihan beban jiwa agar kamu dapat melangkah lebih bebas. {meaning}',
  E1: 'Garis Langit Leluhur: {card} membentuk koneksi spiritual dan kesadaran kolektif dari garis keturunan atas. {meaning}',
  E2: 'Garis Bumi Leluhur: {card} memengaruhi manifestasi fisik, kesehatan, dan warisan material dari garis keturunan bawah. {meaning}',
};

/**
 * PATH B: NASIHAT & TRANSFORMASI (Koreksi UX Baru Untuk Insight Screen)
 * Fokus pada saran tindakan, mitigasi sisi negatif arcana, dan solusi hidup yang akrab.
 */
export const POSITION_ADVICES: Record<DestinyPointKey, string> = {
  A: 'Sebagai panduan Hari Lahir, energi {card} memintamu untuk menyadari potensi jebakan egomu. Langkah terbaikmu: {advice}',
  B: 'Tantangan spiritual Bulan Lahirmu ({card}) dapat diatasi dengan melatih intuisi. Nasihat untukmu: {advice}',
  C: 'Untuk mengurai sumbatan finansial leluhur lewat jalur {card}, kamu disarankan untuk mengubah pola pikir materi. Solusinya: {advice}',
  D: 'Kunci pelepasan beban masa lalu (Karmic Tail) milikmu berada pada kendali energi {card}. Langkah penyembuhannya: {advice}',
  E: 'Agar Esensi Jiwamu ({card}) tetap selaras dan damai, luangkan waktu secara rutin untuk melakukan terapi batin ini: {advice}',
  
  F: 'Nasihat penyeimbang Zona Leluhur Kiri-Atas ({card}): {advice}',
  G: 'Nasihat interaksi sosial silsilah ({card}): {advice}',
  H: 'Solusi tantangan materi leluhur ({card}): {advice}',
  I: 'Cara harmonisasi konflik masa lalu ({card}): {advice}',
  J: 'Untuk mengaktifkan Bakat Tersembunyi dari simbol {card}: {advice}',
  K: 'Guna membangkitkan Kekuatan Batin dari getaran {card}: {advice}',
  L: 'Arah bimbingan potensi spiritual finansialmu ({card}): {advice}',
  M: 'Saran navigasi karier dan takdir keuanganmu ({card}): {advice}',
  N: 'Panduan transformasi garis keturunan melalui {card}: {advice}',
  O: 'Saran pemahaman esoteris lapisan karma ({card}): {advice}',
  P: 'Langkah pelengkap siklus transisi spiritual leluhur ({card}): {advice}',
  Q: 'Cara menyelaraskan topeng ego publikmu ({card}): {advice}',
  R: 'Saran untuk memperkuat magnet penarik takdir makro ({card}): {advice}',
  S: 'Panduan memperkokoh pondasi material bawah ({card}): {advice}',
  T: 'Cara mengintegrasikan tantangan karma masa lalu ({card}): {advice}',
  
  A1: 'Panduan aksi menjembatani manifestasi fisik karakter ({card}): {advice}',
  A2: 'Cara mengalirkan energi bakat tersembunyi ke esensi jiwa ({card}): {advice}',
  A3: 'Langkah sinkronisasi ego mental dengan kebenaran batin ({card}): {advice}',
  B1: 'Cara memperjelas visi idealis spiritual pelindungmu ({card}): {advice}',
  B2: 'Langkah merespons panggilan batin untuk menyatu dengan jiwa ({card}): {advice}',
  B3: 'Cara menyempurnakan misi penyembuhan energi internal ({card}): {advice}',
  C1: 'Langkah konkret pembuka blokir gerbang rezeki ({card}): {advice}',
  C2: 'Strategi meneruskan kestabilan potensi spiritual ke aset nyata ({card}): {advice}',
  C3: 'Cara menyatukan kelimpahan materi dengan kepuasan batin ({card}): {advice}',
  D1: 'Tindakan nyata sebagai katalis pengurai utang karma ({card}): {advice}',
  D2: 'Cara menjaga stabilitas mental saat menghadapi ujian berulang ({card}): {advice}',
  D3: 'Langkah pembersihan beban jiwa agar melangkah bebas ({card}): {advice}',
  E1: 'Cara memperkuat koneksi spiritual kesadaran kolektif atas ({card}): {advice}',
  E2: 'Panduan memanifestasikan kesehatan dan warisan fisik bawah ({card}): {advice}',
};

/**
 * 1. Menghasilkan interpretasi deskriptif (Untuk Matrix Modal)
 */
export function getPositionInterpretation(
  key: DestinyPointKey,
  cardName: string | undefined,
  meaningSnippet: string | undefined,
): string {
  const template = POSITION_CONTEXTS[key] ?? '{card} hadir pada titik {key}. {meaning}';
  const safeCardName = cardName || 'Arcana Rahasia';
  const safeMeaning = meaningSnippet || 'Definisi sedang diproses.';

  return template
    .replace('{card}', safeCardName)
    .replace('{meaning}', safeMeaning)
    .replace('{key}', key);
}

/**
 * 2. Menghasilkan nasihat solutif khusus (Untuk Insight Screen)
 */
export function getPositionAdvice(
  key: DestinyPointKey,
  cardName: string | undefined,
  adviceSnippet: string | undefined,
): string {
  const template = POSITION_ADVICES[key] ?? 'Nasihat titik {key} ({card}): {advice}';
  const safeCardName = cardName || 'Arcana Rahasia';
  const safeAdvice = adviceSnippet || 'Fokus pada kesadaran diri dan harmonisasi energi hari ini.';

  return template
    .replace('{card}', safeCardName)
    .replace('{advice}', safeAdvice)
    .replace('{key}', key);
}
