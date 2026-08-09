// src/core/destiny-matrix/analysis/named-lines.ts
import type { DestinyMatrixPoints, DestinyPoint, NamedLines } from '../types';
import { KARMIC_TAIL_DATABASE } from '../data/karmic-tails';

// Kamus interpretasi Love Line berdasarkan Arcana Pasangan Utama
const LOVE_LINE_DICTIONARY: Record<number, { meaning: string; lesson: string }> = {
  6: {
    meaning:
      'Perjalanan cintamu sangat dipengaruhi oleh idealisme tinggi. Kamu selalu mencari sosok pasangan yang sempurna, romantis, dan estetik, namun sering kali kecewa ketika realita tidak seindah fantasi.',
    lesson:
      'Belajarlah untuk menerima dan mencintai pasangan apa adanya, kurangi ketergantungan emosional, dan berhentilah mencari validasi dari luar.',
  },
  10: {
    meaning:
      'Hubungan asmaramu dipenuhi oleh kejutan indah dan sinkronisitas ilahi. Pasanganmu kemungkinan besar adalah belahan jiwa (soulmate) yang dipertemukan oleh semesta di waktu yang tak terduga.',
    lesson:
      'Belajarlah mencintai tanpa rasa takut akan perubahan, nikmati setiap proses hubungan, dan percayalah penuh pada waktu terbaik yang diatur semesta.',
  },
};

// Kamus interpretasi Money Line berdasarkan Arcana Keuangan Utama
const MONEY_LINE_DICTIONARY: Record<number, { meaning: string; advice: string }> = {
  8: {
    meaning:
      'Aliran finansialmu terikat sangat kuat pada hukum sebab-akibat (Karma Keuangan). Kejujuran, keadilan, kontrak yang jelas, dan keteraturan adalah kunci magnet rezekimu.',
    advice:
      'Kelola keuanganmu dengan transparansi mutlak, hindari skema cepat kaya yang tidak jujur, dan bangun sistem kerja atau bisnismu secara adil.',
  },
  15: {
    meaning:
      'Kamu memiliki potensi keuangan yang sangat besar melalui bisnis, investasi, atau bidang kreatif yang karismatik. Namun, energi ini juga menguji integritasmu terhadap keserakahan.',
    advice:
      'Gunakan modal atau keuntunganmu untuk memberdayakan sesama, kelola hasrat materi dengan bijak, dan pastikan setiap aliran uangmu bersih dari manipulasi.',
  },
};

/**
 * Helper untuk mengekstrak nilai numerik dari DestinyPoint secara defensif
 */
function getPointValue(point?: DestinyPoint | null): number {
  if (!point) return 0;
  if (typeof point.value === 'number') return point.value;
  if (point.arcana && typeof point.arcana.id === 'number') return point.arcana.id;
  return 0;
}

export function analyzeNamedLines(points: DestinyMatrixPoints): NamedLines {
  if (!points) {
    throw new Error('DestinyMatrixPoints harus disediakan.');
  }

  // 1. Ekstraksi Titik-Titik Utama Kalkulator
  const D = points.D;
  const M = points.M;
  const T = points.T;

  const Money = points.Money || points.P || points.O;
  const Love = points.Love || points.O || points.P;
  const LM_Center = points.LM_Center || points.N;
  const C = points.C;

  // 2. Pembacaan Nilai Angka
  const dVal = getPointValue(D); // Jangkar Karma Bawah
  const mVal = getPointValue(M); // Svadhisthana Surga (Chakra Hubungan)
  const tVal = getPointValue(T); // Sub-Node / Extension Ekor Karma

  const moneyVal = getPointValue(Money);
  const loveVal = getPointValue(Love);

  // 3. Penentuan Triad Ekor Karma (Format: D-M-T)
  const tripletKey = `${dVal}-${mVal}-${tVal}`;

  // Ekstraksi Database Ekor Karma
  const registeredKarmic = KARMIC_TAIL_DATABASE[tripletKey];

  const karmicData = registeredKarmic
    ? {
        title: registeredKarmic.title,
        meaning: `Hutang Masa Lalu: ${registeredKarmic.pastLifeDebt}\n\nManifestasi: ${registeredKarmic.manifestation}\n\nPemicu Saat Ini: ${registeredKarmic.currentTriggers}`,
        resolution: `Cara Penyembuhan: ${registeredKarmic.healingWay}\n\nAfirmasi: ${registeredKarmic.affirmation}`,
      }
    : {
        title: `Pola Karma (${tripletKey})`,
        meaning: `Energi masa lalumu membawa sebuah pola jalinan karma (${tripletKey}) yang menantang di kehidupan ini. Kamu sedang diajak untuk menyadari dan melepaskan beban emosional lama di area jangkar hidupmu.`,
        resolution:
          'Kenali pola masalah yang sering berulang dalam hidupmu, lalu responslah tantangan tersebut dengan kesadaran baru yang lebih bijaksana.',
      };

  // 4. Ekstraksi Jalur Hubungan (Love Line)
  const loveData = LOVE_LINE_DICTIONARY[loveVal] || {
    meaning: `Perjalanan asmaramu dituntun langsung oleh energi dari titik hubungan (${loveVal}), memintamu untuk melakukan transformasi emosional yang mendalam dari pola masa lalu menuju masa depan yang lebih seimbang.`,
    lesson:
      'Bangunlah hubungan yang autentik, setara, dan mulailah berdamai dengan bayang-bayang luka masa lalu.',
  };

  // 5. Ekstraksi Jalur Keuangan (Money Line)
  const moneyData = MONEY_LINE_DICTIONARY[moneyVal] || {
    meaning: `Aliran rezeki dan jalur finansialmu sangat dipengaruhi oleh bagaimana caramu mengelola serta mengoptimalkan kekuatan karakter kerjamu pada energi kuncimu (${moneyVal}).`,
    advice:
      'Ambil setiap peluang yang datang dengan penuh kesiapan mental, kelola risiko secara matang, dan tetaplah rendah hati.',
  };

  // Ensure points exist as proper DestinyPoint tuples or fallback safely
  const karmicPoints = [D, M, T].filter((p): p is DestinyPoint => Boolean(p)) as [
    DestinyPoint,
    DestinyPoint,
    DestinyPoint,
  ];

  return {
    karmicTail: {
      points: karmicPoints,
      pattern: tripletKey,
      title: karmicData.title,
      meaning: karmicData.meaning,
      resolution: karmicData.resolution,
    },
    loveLine: {
      entry: LM_Center,
      partner: Love,
      outcome: M,
      past: D,
      meaning: loveData.meaning,
      keyLesson: loveData.lesson,
    },
    moneyLine: {
      entry: LM_Center!,
      core: Money!,
      exit: C!,
      meaning: moneyData.meaning,
      advice: moneyData.advice,
    },
  };
}
