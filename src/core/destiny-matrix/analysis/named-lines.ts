//import type { DestinyMatrixPoints, DestinyPoint, NamedLines } from './types';
// Ganti baris 1 dari './types' menjadi lokasi absolut/relatif types matrix yang valid, contoh:
import type { DestinyMatrixPoints, DestinyPoint, NamedLines } from '../types'; 

// Kamus data interpretasi mendalam untuk Karmic Tail (Triad H-I-C) - Diubah menjadi "Kamu/Dirimu"
const KARMIC_TAIL_DICTIONARY: Record<string, { title: string; meaning: string; resolution: string }> = {
  '18-9-9': {
    title: 'Wizard / Hermit Karma',
    meaning: 'Di kehidupan lampau, kamu memiliki pengetahuan spiritual atau mistis yang besar, namun kamu menyembunyikannya atau menyalahgunakannya karena rasa takut. Akibatnya, di kehidupan ini kamu sering kali merasa kesepian, takut ditolak, atau meragukan bakat intuisi alamimu sendiri.',
    resolution: 'Mulailah membagikan pengetahuanmu kepada dunia secara tulus, atasi ketakutan akan kesunyian, dan pelajari sains serta spiritualitas secara terbuka.'
  },
  '15-20-5': {
    title: 'Rebel / Family Karma',
    meaning: 'Pola karma ini berkaitan erat dengan konflik besar, keinginan mengontrol, atau trauma dalam silsilah keluarga. Kamu mungkin merasa sebagai "black sheep" (domba hitam) atau memikul beban emosional turun-temurun dari keluargamu.',
    resolution: 'Belajarlah untuk berdamai dan memaafkan silsilah keluarga, lepaskan ego untuk mengendalikan orang lain, dan gunakan energimu untuk memulihkan hubungan.'
  },
  '9-15-6': {
    title: 'Worldly Passions / Love Disappointment',
    meaning: 'Ada kecenderungan masa lalu yang terjebak dalam godaan duniawi, obsesi romantis, atau ketergantungan emosional. Di kehidupan ini, kamu mungkin berulang kali mengalami kekecewaan dalam cinta atau kesulitan mengendalikan hasrat emosionalmu.',
    resolution: 'Ubah obsesi menjadi cinta tanpa syarat yang tulus, bangun batasan diri yang sehat, dan utamakan ketenangan batin dibanding tuntutan ego.'
  }
};

// Kamus data interpretasi mendalam untuk Love Line
const LOVE_LINE_DICTIONARY: Record<number, { meaning: string; lesson: string }> = {
  6: {
    meaning: 'Perjalanan cintamu sangat dipengaruhi oleh idealisme tinggi. Kamu selalu mencari sosok pasangan yang sempurna, romantis, dan estetik, namun sering kali kecewa ketika realita tidak seindah fantasi.',
    lesson: 'Belajarlah untuk menerima dan mencintai pasangan apa adanya, kurangi ketergantungan emosional, dan berhentilah mencari validasi dari luar.'
  },
  10: {
    meaning: 'Hubungan asmaramu dipenuhi oleh kejutan indah dan sinkronisitas ilahi. Pasanganmu kemungkinan besar adalah belahan jiwa (soulmate) yang dipertemukan oleh semesta di waktu yang tak terduga.',
    lesson: 'Belajarlah mencintai tanpa rasa takut akan perubahan, nikmati setiap proses hubungan, dan percayalah penuh pada waktu terbaik yang diatur semesta.'
  }
};

// Kamus data interpretasi mendalam untuk Money Line
const MONEY_LINE_DICTIONARY: Record<number, { meaning: string; advice: string }> = {
  8: {
    meaning: 'Aliran finansialmu terikat sangat kuat pada hukum sebab-akibat (Karma Keuangan). Kejujuran, keadilan, kontrak yang jelas, dan keteraturan adalah kunci magnet rezekimu.',
    advice: 'Kelola keuanganmu dengan transparansi mutlak, hindari skema cepat kaya yang tidak jujur, dan bangun sistem kerja atau bisnismu secara adil.'
  },
  15: {
    meaning: 'Kamu memiliki potensi keuangan yang sangat besar melalui bisnis, investasi, atau bidang kreatif yang karismatik. Namun, energi ini juga menguji integritasmu terhadap keserakahan.',
    advice: 'Gunakan modal atau keuntunganmu untuk memberdayakan sesama, kelola hasrat materi dengan bijak, dan pastikan setiap aliran uangmu bersih dari manipulasi.'
  }
};

/**
 * Helper untuk mengekstrak nilai angka (value/id) dari DestinyPoint secara aman
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

  const { A, B, C, D, E, H, I, M } = points;

  // Ekstraksi nilai numerik secara aman menggunakan helper
  const aVal = getPointValue(A);
  const bVal = getPointValue(B);
  const cVal = getPointValue(C);
  const dVal = getPointValue(D);
  const eVal = getPointValue(E);
  const hVal = getPointValue(H);
  const iVal = getPointValue(I);
  const mVal = getPointValue(M);

  // Membuat kode triad unik untuk Karmic Tail, contoh: "18-9-9"
  const tripletKey = `${hVal}-${iVal}-${cVal}`;

  // Mengambil interpretasi mendalam dari kamus data (atau fallback yang bersahabat jika belum terdaftar)
  const karmicData = KARMIC_TAIL_DICTIONARY[tripletKey] || {
    title: `Pola Karma (${tripletKey})`,
    meaning: `Energi masa lalumu membawa sebuah pola karmik yang menantang di kehidupan ini. Kamu sedang diajak untuk menyadari dan melepaskan beban emosional yang tersisa agar hidupmu terasa lebih ringan.`,
    resolution: 'Kenali pola masalah yang sering berulang dalam hidupmu, lalu responslah tantangan tersebut dengan kesadaran baru yang lebih bijaksana.'
  };

  const loveData = LOVE_LINE_DICTIONARY[eVal] || {
    meaning: `Perjalanan asmaramu dituntun langsung oleh energi inti jiwamu, memintamu untuk melakukan transformasi emosional yang mendalam dari pola masa lalu menuju masa depan yang lebih seimbang.`,
    lesson: 'Bangunlah hubungan yang autentik, setara, dan mulailah berdamai dengan bayang-bayang luka masa lalu.'
  };

  const moneyData = MONEY_LINE_DICTIONARY[mVal] || {
    meaning: `Aliran rezeki dan jalur finansialmu sangat dipengaruhi oleh bagaimana caramu mengelola serta mengoptimalkan kekuatan karakter kerjamu secara konsisten.`,
    advice: 'Ambil setiap peluang yang datang dengan penuh kesiapan mental, kelola risiko secara matang, dan tetaplah rendah hati.'
  };

  return {
    karmicTail: {
      points: [H, I, C].filter((p): p is DestinyPoint => p !== undefined && p !== null),
      pattern: `(${hVal}-${iVal}-${cVal})`,
      title: karmicData.title,
      meaning: karmicData.meaning,
      resolution: karmicData.resolution,
    },
    loveLine: {
      past: A,
      present: E,
      future: D,
      meaning: loveData.meaning,
      keyLesson: loveData.lesson,
    },
    moneyLine: {
      entry: B,
      core: M,
      exit: C,
      meaning: moneyData.meaning,
      advice: moneyData.advice,
    },
  };
}
