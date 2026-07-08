// src/core/destiny-matrix/data/karmic-tails.ts

export interface KarmicTailDefinition {
  triad: string;          // Format: "C-C1-C2"
  title: string;          // Nama pola karma
  pastLifeDebt: string;   // Akar masalah dari masa lalu (BARU)
  manifestation: string;  // Bagaimana karma ini muncul di kehidupan sekarang
  currentTriggers: string; // Jebakan harian / Shadow triggers (BARU)
  healingWay: string;     // Solusi & Langkah transformasi
  affirmation: string;    // Mantra/Afirmasi penyembuhan (BARU)
}

export const KARMIC_TAIL_DATABASE: Record<string, KarmicTailDefinition> = {
  '15-20-5': {
    triad: '15-20-5',
    title: 'The Rebel / Broken Family Line (Pemberontak & Pemutus Karma Keluarga)',
    pastLifeDebt: 'Pada masa lalu, jiwa Anda mungkin telah melakukan tindakan yang merusak nama baik, struktur, atau tradisi keluarga, atau justru menjadi korban dari sistem klan/keluarga yang sangat menindas dan gagal menyelesaikannya dengan kedamaian.',
    manifestation: 'Di kehidupan ini, Anda terlahir dengan rasa terasing yang mendalam dari keluarga kandung. Anda sering merasa menjadi "kambing hitam" (*black sheep*), menghadapi konflik nilai yang tajam dengan orang tua, atau merasa memikul beban emosional/finansial dari generasi di atas Anda.',
    currentTriggers: 'Merasa marah atau defensif saat dikritik oleh keluarga, menutup komunikasi (*silent treatment*), atau sengaja melakukan sabotase diri demi membuktikan bahwa Anda berbeda dari garis keturunan Anda.',
    healingWay: 'Pahami bahwa Anda dipilih oleh semesta lahir di keluarga tersebut bukan untuk menghukum Anda, melainkan sebagai "transmutator" (pemutus rantai trauma). Belajarlah memaafkan keterbatasan emosional leluhur tanpa harus menyetujui perilaku mereka, dan bangun batasan diri (*boundaries*) yang sehat.',
    affirmation: 'Rhoma/garis keturunanku berhenti melakukan kesalahan di titik ini. Aku menghormati masa lalu mereka, namun aku bebas membangun takdirku sendiri dengan penuh cinta.'
  },
  '9-9-18': {
    triad: '9-9-18',
    title: 'The Magical Hermit / Wizard (Penyihir & Pengetahuan Tersembunyi)',
    pastLifeDebt: 'Di masa lalu, Anda memiliki pengetahuan spiritual, magis, atau intelektual yang sangat tinggi, namun Anda menyalahgunakannya, menyembunyikannya dari masyarakat karena ego, atau mati dalam keterasingan akibat persekusi sosial.',
    manifestation: 'Kehidupan sekarang diwarnai ketakutan bawah sadar yang masif untuk tampil di depan publik. Anda memiliki intuisi luar biasa dan bakat langka, tetapi selalu merasa tidak siap, takut dihakimi sebagai orang "aneh", fobia terhadap penolakan, atau sering menarik diri ke dalam kesendirian yang depresif.',
    currentTriggers: 'Menimbun sertifikat atau ilmu tanpa pernah mempraktikkannya (*imposter syndrome*), melarikan diri ke dunia fantasi/delusi saat stres, dan enggan mempercayai ketulusan orang lain.',
    healingWay: 'Mulailah membagikan isi kepala dan karya Anda secara bertahap (bisa lewat tulisan atau komunitas kecil anonim terlebih dahulu). Akui bahwa ketakutan Anda adalah memori kuno yang sudah tidak berlaku di masa sekarang. Gunakan intuisi tajam Anda untuk menyembuhkan orang lain.',
    affirmation: 'Dunia ini aman bagi kebijaksanaanku. Pengetahuan yang aku miliki adalah berkah yang siap dialirkan, bukan rahasia yang harus disembunyikan.'
  },
  '18-9-9': {
    triad: '18-9-9',
    title: 'The Hermit Witchcraft / Fear of Magic',
    pastLifeDebt: 'Sama seperti 9-9-18, namun penekanan pada Arcana 18 di awal menunjukkan penyalahgunaan hukum ketertarikan, manipulasi pikiran orang lain, atau ketakutan ekstrem terhadap hal mistis akibat trauma masa lalu.',
    manifestation: 'Sering mengalami mimpi buruk yang sangat nyata, memiliki bakat alami dalam manifes sesuatu (jika memikirkan hal buruk cepat terjadi), namun hidup dalam kecemasan konstan atau ketakutan berlebih terhadap energi negatif/guna-guna.',
    currentTriggers: 'Terjebak dalam pikiran obsesif berulang (*overthinking*), memanifestasikan skenario terburuk secara tidak sengaja karena kekuatan pikiran yang tidak terfokus.',
    healingWay: 'Pelajari ilmu psikologi atau spiritualitas terstruktur untuk menjinakkan keliaran imajinasi Anda. Bersihkan ruang mental secara rutin melalui meditasi keheningan.',
    affirmation: 'Pikiranku adalah instrumen cahaya. Hanya hal-hal murni dan damai yang dapat mewujud di dalam realitasku.'
  }
};

export function findKarmicTail(c: number, c1: number, c2: number): KarmicTailDefinition {
  const key = `${c}-${c1}-${c2}`;
  
  // Deteksi variasi susunan angka (karena urutan pembacaan triad terkadang bisa terbalik di beberapa mazhab)
  const alternativeKeys = [
    key,
    `${c}-${c2}-${c1}`,
    `${c1}-${c-${c2}`
  ];

  for (const k of alternativeKeys) {
    if (KARMIC_TAIL_DATABASE[k]) {
      return KARMIC_TAIL_DATABASE[k];
    }
  }

  // Fallback representasi dinamis yang jauh lebih kaya jika triad belum terdaftar
  return {
    triad: key,
    title: 'Custom Karmic Lessons',
    pastLifeDebt: `Adanya simpul energi yang belum terselesaikan yang melibatkan kombinasi getaran Arcana ${c}, ${c1}, dan ${c2}.`,
    manifestation: `Di kehidupan ini, Anda ditantang untuk menyeimbangkan distorsi energi dari ketiga pilar tersebut, yang biasanya bermanifestasi sebagai pola hambatan berulang di usia muda.`,
    currentTriggers: `Kehilangan kesabaran atau jatuh ke dalam kutub negatif (*shadow side*) dari Arcana dominan ${c} saat berada di bawah tekanan emosional.`,
    healingWay: `Analisis sifat negatif dari masing-masing Arcana ini (misal: ego untuk Arcana 4, keterikatan untuk Arcana 15) lalu lakukan aksi sebaliknya demi integrasi jiwa.`,
    affirmation: `Aku menerima seluruh bagian dari perjalanan jiwaku, dan dengan sadar aku memilih bertumbuh melampaui keterbatasan masa lalu.`
  };
}
