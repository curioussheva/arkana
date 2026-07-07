// src/core/destiny-matrix/insight.ts
import { calculatePersonalYearArcana } from './personal-year';
import type { DestinyMatrix } from './types';
import type { ArkanaInfo } from '../numerology/types';

// ─── Types ───────────────────────────────────────────
export interface DestinyInsight {
  narrative: string;
  dominantElement: ArkanaInfo['element'];
  elementDistribution: Record<ArkanaInfo['element'], number>;
  dominantPercentage: number;
  secondaryElement?: ArkanaInfo['element'];
  coreEssence: { card: string; number: number; meaning: string };
  personality: { card: string; number: number; meaning: string };
  lifeDirection: { card: string; number: number; meaning: string };
  yearlyForecast: { year: number; card: string; personalYearValue: number; meaning: string };
  elementAdvice: string;
  challenge: string;
  strength: string;
  generatedAt: string;
  version: string;
}

// ─── Constanta ───────────────────────────────────────
const ELEMENT_ADVICE: Record<ArkanaInfo['element'], string> = {
  Fire: 'Salurkan energi api melalui olahraga, seni, atau proyek ambisius. Hindari keputusan impulsif; gunakan kekuatan untuk menginspirasi.',
  Water: 'Luangkan waktu untuk refleksi dan meditasi. Percayai intuisi, tapi jangan tenggelam dalam emosi. Ekspresikan perasaan melalui seni.',
  Air: 'Asah komunikasi melalui diskusi, menulis, atau mengajar. Jangan overthinking; seimbangkan pikiran dengan tindakan nyata.',
  Earth: 'Bangun fondasi kokoh melalui rutinitas dan perencanaan. Nikmati proses dan rayakan pencapaian kecil.',
};

const ELEMENT_OPENINGS: Record<ArkanaInfo['element'], string[]> = {
  Fire: [
    'Api dalam diri Anda menyala terang, mendorong aksi dan keberanian. ',
    'Semangat membara mengalir dalam setiap langkah Anda. ',
    'Energi api memberikan dorongan untuk memimpin dan berkreasi. ',
  ],
  Water: [
    'Kedalaman emosi Anda adalah sumber kebijaksanaan. ',
    'Intuisi mengalir seperti air, membimbing Anda dengan lembut. ',
    'Kepekaan hati Anda adalah kekuatan, bukan kelemahan. ',
  ],
  Air: [
    'Pikiran yang tajam dan ide-ide cemerlang adalah anugerah Anda. ',
    'Komunikasi adalah kekuatan super Anda. ',
    'Udara membawa inspirasi dan koneksi baru setiap hari. ',
  ],
  Earth: [
    'Kestabilan dan ketekunan adalah fondasi kesuksesan Anda. ',
    'Seperti bumi, Anda kokoh dan dapat diandalkan. ',
    'Kesabaran Anda membuahkan hasil yang nyata dan bertahan lama. ',
  ],
};

const NARRATIVE_TEMPLATES = [
  (essence: string, personality: string, direction: string, element: string, year: string) =>
    `Perjalanan spiritual Anda dimulai dari inti jiwa ${essence}. ` +
    `Kepribadian ${personality} menjadi fondasi yang mendorong Anda menuju ${direction}. ` +
    `${element} Tahun ini, energi ${year} akan membimbing langkah Anda.`,
  (essence: string, personality: string, direction: string, element: string, year: string) =>
    `Kekuatan terbesar Anda terpancar dari ${essence} yang berpadu dengan ${personality}. ` +
    `Kombinasi ini mengarahkan hidup Anda pada ${direction}. ` +
    `${element} Di tahun yang dipenuhi energi ${year}, Anda dipanggil untuk bersinar.`,
  (essence: string, personality: string, direction: string, element: string, year: string) =>
    `Esensi ${essence} mengajarkan Anda tentang jati diri, sementara ${personality} mewarnai interaksi dengan dunia. ` +
    `Arah hidup ${direction} adalah panggilan jiwa Anda. ` +
    `${element} Energi ${year} tahun ini membawa pelajaran berharga.`,
];

const CHALLENGES: Record<number, string> = {
  1: 'Jangan biarkan keraguan diri menghalangi inisiatif Anda.',
  2: 'Percayalah pada intuisi, bukan hanya logika.',
  3: 'Hindari ketergantungan pada validasi eksternal.',
  4: 'Jangan terlalu kaku; fleksibilitas adalah kunci.',
  5: 'Jangan takut melepaskan yang lama untuk pengalaman baru.',
  6: 'Buatlah pilihan dari hati, bukan karena takut.',
  7: 'Jangan terlalu banyak menganalisis; terkadang tindakan diperlukan.',
  8: 'Ambil keputusan dengan tegas, jangan menunda.',
  9: 'Jangan mengisolasi diri; berbagilah kebijaksanaan Anda.',
  10: 'Terimalah bahwa perubahan adalah bagian dari siklus.',
  11: 'Gunakan kekuatan Anda dengan bijak, bukan untuk dominasi.',
  12: 'Berhentilah menjadi korban; lihat situasi dari sudut berbeda.',
  13: 'Lepaskan yang tidak lagi bermanfaat, jangan takut berakhir.',
  14: 'Cari keseimbangan di segala aspek kehidupan.',
  15: 'Jangan terjebak dalam obsesi atau pola tidak sehat.',
  16: 'Biarkan struktur lama runtuh agar yang baru bisa dibangun.',
  17: 'Tetap percaya pada harapan meski jalan terlihat gelap.',
  18: 'Hadapi ketakutan Anda; di baliknya ada kebenaran.',
  19: 'Nikmati kebahagiaan tanpa merasa bersalah.',
  20: 'Lakukan refleksi dan evaluasi diri secara jujur.',
  21: 'Selesaikan apa yang telah dimulai; saatnya merayakan.',
  22: 'Beranilah melangkah ke petualangan baru.',
};

const STRENGTHS: Record<number, string> = {
  1: 'Kemampuan mewujudkan ide menjadi kenyataan.',
  2: 'Intuisi tajam yang membimbing keputusan.',
  3: 'Kreativitas dan daya tarik yang melimpah.',
  4: 'Fondasi kuat dan kemampuan membangun sistem.',
  5: 'Adaptabilitas dan semangat petualangan.',
  6: 'Kemampuan mencintai dan membangun hubungan harmonis.',
  7: 'Pemikiran mendalam dan kemampuan analisis.',
  8: 'Keadilan dan integritas dalam bertindak.',
  9: 'Kebijaksanaan yang datang dari pengalaman.',
  10: 'Resiliensi menghadapi perubahan hidup.',
  11: 'Kekuatan besar yang terkendali dengan baik.',
  12: 'Kemampuan melihat dari berbagai perspektif.',
  13: 'Keberanian melepaskan dan memulai lagi.',
  14: 'Kesabaran dan keseimbangan dalam segala hal.',
  15: 'Kekuatan menghadapi bayangan diri sendiri.',
  16: 'Kemampuan bangkit setelah kehancuran.',
  17: 'Harapan dan inspirasi bagi orang lain.',
  18: 'Kepekaan terhadap alam bawah sadar dan mimpi.',
  19: 'Optimisme dan energi positif yang menular.',
  20: 'Kemampuan evaluasi dan refleksi mendalam.',
  21: 'Pencapaian dan penyelesaian yang memuaskan.',
  22: 'Keterbukaan terhadap pengalaman baru.',
};

// ─── Helper Functions ────────────────────────────────
export function countElements(matrix: DestinyMatrix): Record<ArkanaInfo['element'], number> {
  const counts: Record<ArkanaInfo['element'], number> = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
  Object.values(matrix.points).forEach((point) => {
    if (point?.arcana?.element) {
      const element = point.arcana.element as keyof typeof counts;
      counts[element] += 1;
    }
  });
  return counts;
}
  
function getElementStats(counts: Record<ArkanaInfo['element'], number>) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const sorted = (Object.entries(counts) as [ArkanaInfo['element'], number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return {
    dominant: sorted[0][0],
    dominantCount: sorted[0][1],
    dominantPercentage: Math.round((sorted[0][1] / total) * 100),
    secondary: sorted.length > 1 && sorted[1][1] > 0 ? sorted[1][0] : undefined,
  };
}

export function firstSentence(text: string): string {
  if (!text) return '';
  const sentence = text.split('. ')[0];
  return sentence.endsWith('.') ? sentence : `${sentence}.`;
}

function lowercaseFirst(text: string): string {
  return text.length > 0 ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Main Generator ──────────────────────────────────
export function generateInsight(matrix: DestinyMatrix): DestinyInsight {
  const { A, D, E } = matrix.points;
  const elementCounts = countElements(matrix);
  const { dominant: dominantElement, dominantPercentage, secondary: secondaryElement } =
    getElementStats(elementCounts);
  
  // Mengambil tahun dinamis saat ini (2026)
  const currentYear = new Date().getFullYear();
  const personalYear = calculatePersonalYearArcana(matrix.input.birthDate, currentYear);

  const coreEssence = {
    card: E?.arcana?.card ?? 'Unknown',
    number: E?.arcana?.number ?? 0,
    meaning: firstSentence(E?.arcana?.uprightMeaning ?? ''),
  };

  const personality = {
    card: A?.arcana?.card ?? 'Unknown',
    number: A?.arcana?.number ?? 0,
    meaning: firstSentence(A?.arcana?.uprightMeaning ?? ''),
  };

  const lifeDirection = {
    card: D?.arcana?.card ?? 'Unknown',
    number: D?.arcana?.number ?? 0,
    meaning: firstSentence(D?.arcana?.uprightMeaning ?? ''),
  };

  const yearlyForecast = {
    year: personalYear.year,
    card: personalYear.arcana?.card ?? 'Unknown',
    personalYearValue: personalYear.personalYearValue,
    meaning: firstSentence(personalYear.arcana?.uprightMeaning ?? ''),
  };

  const template = pickRandom(NARRATIVE_TEMPLATES);
  const elementOpening = pickRandom(ELEMENT_OPENINGS[dominantElement]);

  const mainNarrative = template(
    coreEssence.card,
    personality.card,
    lifeDirection.card,
    elementOpening,
    yearlyForecast.card
  );

  const challenge = CHALLENGES[coreEssence.number] || 'Teruslah bertumbuh dan belajar dari setiap pengalaman.';
  const strength = STRENGTHS[coreEssence.number] || 'Kekuatan unik Anda adalah anugerah yang perlu terus diasah.';
  const elementAdvice = ELEMENT_ADVICE[dominantElement];

  const fullNarrative = [
    mainNarrative,
    `Kekuatan utama Anda: ${lowercaseFirst(strength)}`,
    `Tantangan yang perlu dihadapi: ${lowercaseFirst(challenge)}`,
    `Saran untuk energi ${dominantElement} (${dominantPercentage}%): ${lowercaseFirst(elementAdvice)}`,
  ].join(' ');

  return {
    narrative: fullNarrative,
    dominantElement,
    elementDistribution: elementCounts,
    dominantPercentage,
    secondaryElement,
    coreEssence,
    personality,
    lifeDirection,
    yearlyForecast,
    elementAdvice,
    challenge,
    strength,
    generatedAt: new Date().toISOString(),
    version: '2.1.0',
  };
}

// ==================== RECALIBRATED CONTEXTS ====================

/**
 * Template interpretasi kontekstual yang disinkronkan dengan Engine V1.4.0
 */
export const POSITION_CONTEXTS: Record<any, string> = {
  A: 'Di posisi Hari Lahir, {card} hadir sebagai identitas dasar dan karakter mental utama Anda. {meaning}',
  B: 'Bulan Lahir Anda diwakili oleh {card}, menunjukkan perlindungan spiritual dan cara Anda merespon intuisi. {meaning}',
  C: 'Garis Keturunan Material diisi oleh {card}, membawa pola tantangan keuangan masa lalu dari leluhur. {meaning}',
  D: 'Sintesis Pertama Anda adalah {card}, menggambarkan gerbang karmic tail yang membentuk arah hidup Anda. {meaning}',
  E: 'Esensi Jiwa Anda adalah {card}. Inilah pusat kenyamanan spiritual dan jati diri Anda yang paling murni. {meaning}',
  F: 'Zona Nyaman Leluhur Kiri-Atas beresonansi dengan {card}, tempat energi masa lalu berkumpul. {meaning}',
  G: 'Zona Sosial Leluhur Kanan-Atas diisi oleh {card}, mencerminkan interaksi sosial silsilah keluarga Anda. {meaning}',
  H: 'Zona Tantangan Leluhur Bawah-Kanan adalah {card}, pelajaran silsilah materi yang harus diurai. {meaning}',
  I: 'Zona Keseimbangan Leluhur Bawah-Kiri dijaga oleh {card}, titik harmonisasi konflik masa lalu. {meaning}',
  J: 'Bakat Tersembunyi di jalur karakter Anda diaktifkan melalui simbolisme {card}. {meaning}',
  K: 'Kekuatan Batin spiritual Anda bersumber dari manifestasi {card}. {meaning}',
  L: 'Potensi Spiritual di jalur finansial dibimbing oleh getaran {card}. {meaning}',
  M: 'Arah Perkembangan karier dan takdir keuangan Anda ditandai oleh {card}. {meaning}',
  N: 'Ekstensi Keturunan I diwakili oleh {card}, memperdalam makna transformasi garis keturunan. {meaning}',
  O: 'Ekstensi Keturunan II: {card} memberikan lapisan pemahaman esoteris baru pada karma. {meaning}',
  P: 'Ekstensi Keturunan III: {card} melengkapi siklus transisi spiritual leluhur. {meaning}',
  Q: 'Ekstensi Kepribadian luar: {card} memperluas topeng ego Anda di mata publik. {meaning}',
  R: 'Ekstensi Tujuan Hidup makro: {card} menguatkan magnet penarik takdir Anda. {meaning}',
  S: 'Ekstensi Garis Keturunan bawah: {card} menambah kedalaman pondasi material Anda. {meaning}',
  T: 'Ekstensi Sintesis kiri: {card} mengintegrasikan tantangan karma masa lalu.',
  
  // Sub-titik Aliran Garis Energi Linier (Engine 1.4.0 Sync)
  A1: 'Ekstensi Jalur Karakter I: {card} menjembatani manifestasi fisik karakter dari ego luar menuju potensi batin. {meaning}',
  A2: 'Ekstensi Jalur Karakter II: {card} mengalirkan energi bakat tersembunyi langsung menuju pusat esensi jiwa Anda. {meaning}',
  A3: 'Titik Sinkronisasi Karakter-Jiwa: Melalui {card}, ego mental diselaraskan dengan kebenaran batin Anda. {meaning}',
  B1: 'Ekstensi Jalur Spiritual I: {card} memperjelas visi idealis spiritual dari malaikat pelindung Anda. {meaning}',
  B2: 'Ekstensi Jalur Spiritual II: {card} menegaskan panggilan batin untuk menyatu dengan kenyamanan jiwa. {meaning}',
  B3: 'Titik Sinkronisasi Spiritual-Jiwa: {card} menyempurnakan misi penyembuhan energi maskulin/feminin dalam diri Anda. {meaning}',
  C1: 'Ekstensi Jalur Finansial I: {card} bertindak sebagai pembuka blokir gerbang rezeki material leluhur. {meaning}',
  C2: 'Ekstensi Jalur Finansial II: {card} meneruskan kestabilan potensi spiritual ke dalam manajemen aset nyata. {meaning}',
  C3: 'Titik Sinkronisasi Finansial-Jiwa: {card} menyatukan kelimpahan materi dengan rasa cukup di dalam batin. {meaning}',
  D1: 'Ekstensi Jalur Karma I: {card} bertindak sebagai katalis pengurai lilitan utang karma masa lalu. {meaning}',
  D2: 'Ekstensi Jalur Karma II: {card} membawa stabilitas mental saat Anda berhadapan dengan ujian berulang kehidupan. {meaning}',
  D3: 'Titik Sinkronisasi Karma-Jiwa: {card} menyelesaikan pembersihan beban jiwa agar Anda bisa melangkah bebas. {meaning}',
  E1: 'Garis Langit Leluhur: {card} membentuk koneksi spiritual dan komunal kolektif silsilah atas. {meaning}',
  E2: 'Garis Bumi Leluhur: {card} memengaruhi manifestasi fisik, kesehatan, dan warisan genetik materi bawah. {meaning}',
};

export function getPositionInterpretation(
  key: any,
  cardName: string,
  meaningSnippet: string
): string {
  const template = POSITION_CONTEXTS[key] || '{card} hadir di titik {key}. {meaning}';
  return template
    .replace('{card}', cardName)
    .replace('{meaning}', meaningSnippet)
    .replace('{key}', String(key));
}
 