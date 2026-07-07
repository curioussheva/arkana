// src/core/destiny-matrix/lines.ts
import type { DestinyMatrixPoints, DestinyPoint, NamedLines } from './types';

// Kamus data interpretasi mendalam untuk Karmic Tail (Triad H-I-C)
const KARMIC_TAIL_DICTIONARY: Record<string, { title: string; meaning: string; resolution: string }> = {
  '18-9-9': {
    title: 'Wizard / Hermit Karma',
    meaning: 'Di kehidupan lampau, Anda memiliki pengetahuan mistis/spiritual besar namun menyembunyikannya atau menyalahgunakannya karena ketakutan. Di kehidupan ini, Anda sering merasa kesepian, takut ditolak, atau meragukan bakat supranatural/intuisi Anda sendiri.',
    resolution: 'Bagikan pengetahuan Anda kepada dunia, atasi ketakutan akan kesepian, dan pelajari sains atau spiritualitas secara terbuka.'
  },
  '15-20-5': {
    title: 'Rebel / Family Karma',
    meaning: 'Pola karma yang berkaitan dengan agresi, kontrol, atau konflik besar dalam silsilah keluarga. Anda mungkin mewarisi trauma antargenerasi atau merasa sebagai "black sheep" (domba hitam) di keluarga.',
    resolution: 'Belajarlah memaafkan silsilah keluarga, lepaskan keinginan mengontrol orang lain, dan gunakan energi Anda untuk menyembuhkan hubungan.'
  },
  '9-15-6': {
    title: 'Worldly Passions / Love Disappointment',
    meaning: 'Ada kecenderungan terjebak dalam godaan materialistis, obsesi romantis, atau kecanduan di masa lalu. Anda mungkin berulang kali mengalami pengkhianatan dalam cinta atau kesulitan mengendalikan hasrat duniawi.',
    resolution: 'Transformasikan nafsu menjadi cinta tanpa syarat, bangun batasan diri yang sehat, dan utamakan nilai spiritual dibanding materi.'
  }
};

// Kamus data interpretasi mendalam untuk Love Line (Berdasarkan energi pusat E dan masa lalu A)
const LOVE_LINE_DICTIONARY: Record<number, { meaning: string; lesson: string }> = {
  6: {
    meaning: 'Hubungan Anda sangat dipengaruhi oleh idealisme tinggi. Anda mencari cinta yang sempurna, romantis, dan estetik, namun sering kecewa jika realita tidak sesuai ekspektasi.',
    lesson: 'Belajarlah untuk mencintai pasangan apa adanya, kurangi ketergantungan emosional, dan berhentilah mencari validasi eksternal.'
  },
  10: {
    meaning: 'Perjalanan cinta yang penuh kejutan dan sinkronisitas ilahi. Pasangan Anda kemungkinan besar adalah belahan jiwa karmik yang dipertemukan oleh takdir di momen yang tak terduga.',
    lesson: 'Belajar mencintai tanpa rasa takut terhadap perubahan, ikuti arus hubungan, dan percayalah pada timing semesta.'
  }
};

// Kamus data interpretasi mendalam untuk Money Line (Berdasarkan energi inti uang M)
const MONEY_LINE_DICTIONARY: Record<number, { meaning: string; advice: string }> = {
  8: {
    meaning: 'Finansial Anda terikat kuat pada hukum sebab-akibat (Karma Keuangan) dan keadilan sistemik. Kejujuran, kontrak legal, dan keteraturan adalah kunci utama magnet uang Anda.',
    advice: 'Kelola keuangan dengan transparansi mutlak, hindari skema cepat kaya yang ilegal, dan bangun sistem bisnis yang adil.'
  },
  15: {
    meaning: 'Potensi finansial yang luar biasa besar melalui bisnis skala besar, investasi, atau industri karismatik. Namun, energi ini juga membawa godaan keserakahan atau manipulasi keuangan.',
    advice: 'Gunakan modal besar untuk memberdayakan sesama, kelola ego dan hasrat materi, serta pastikan aliran uang Anda bersih dari energi negatif.'
  }
};


export function analyzeNamedLines(points: DestinyMatrixPoints): NamedLines {
  if (!points) {
    throw new Error('DestinyMatrixPoints harus disediakan.');
  }

  const { A, B, C, D, E, H, I, M } = points;

  // Membuat kode triad unik untuk Karmic Tail, contoh: "18-9-9"
  const hVal = H?.value ?? 0;
  const iVal = I?.value ?? 0;
  const cVal = C?.value ?? 0;
  const tripletKey = `${hVal}-${iVal}-${cVal}`;

  // Mengambil interpretasi mendalam dari kamus data (atau fallback jika belum terdaftar)
  const karmicData = KARMIC_TAIL_DICTIONARY[tripletKey] || {
    title: `Karmic Code (${tripletKey})`,
    meaning: `Energi ${hVal} pada root membawa pola karmik masa lalu yang dikombinasikan dengan energi ${iVal} dan ${cVal}. Anda sedang diuji untuk melepaskan beban lama ini.`,
    resolution: 'Identifikasi pola berulang dalam hidup Anda, lalu responslah dengan kesadaran moral yang lebih tinggi.'
  };

  const loveData = LOVE_LINE_DICTIONARY[E?.value ?? 0] || {
    meaning: `Perjalanan cinta Anda dikepalai oleh energi Arcanum ${E?.value ?? '?'}, menuntut transformasi emosional yang mendalam dari masa lalu (${A?.value ?? '?'}) ke masa depan (${D?.value ?? '?'}).`,
    lesson: 'Membangun hubungan yang autentik, seimbang, dan bebas dari proyeksi masa lalu.'
  };

  const moneyData = MONEY_LINE_DICTIONARY[M?.value ?? 0] || {
    meaning: `Money Line (${B?.value ?? '?'} → ${M?.value ?? '?'} → ${C?.value ?? '?'}) menunjukkan bahwa aliran rezeki Anda sangat bergantung pada bagaimana Anda mengelola energi Arcanum ${M?.value ?? '?'}.`,
    advice: 'Ikuti peluang yang muncul dengan disiplin spiritual dan manajemen risiko yang matang.'
  };

  return {
    karmicTail: {
      points: [H, I, C].filter(Boolean) as DestinyPoint[],
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
 