import { ElementType } from './element';

export interface TemperamentInfo {
  name: string;
  label: string;
  keyTraits: string[];
  description: string;
}

export interface JungianInfo {
  functionName: string;
  mbtiMatch: string;
  focus: string;
  description: string;
}

export interface DiscInfo {
  type: string;
  archetype: string;
  strengths: string[];
  growthArea: string;
}

export interface BigFiveInfo {
  highTrait: string;
  description: string;
}

export interface FullPsychoProfile {
  element: ElementType;
  temperament: TemperamentInfo;
  jungian: JungianInfo;
  disc: DiscInfo;
  bigFive: BigFiveInfo;
  blindSpot: string;
  communicationStyle: string;
}

export const PSYCHO_PROFILES: Record<ElementType, FullPsychoProfile> = {
  Fire: {
    element: 'Fire',
    temperament: {
      name: 'Koleris (Choleric)',
      label: '🚀 Tipe Penggerak & Pemimpin Action-Oriented',
      keyTraits: ['Proaktif', 'Tegas', 'Mandiri', 'Berani Mengambil Risiko'],
      description:
        'Digerakkan oleh pencapaian target dan dampak nyata. Memproses situasi dengan keinginan cepat untuk bertindak dan mengubah keadaan.',
    },
    jungian: {
      functionName: 'Intuisi Ekstravert (Ne/Se)',
      mbtiMatch: 'Predominan ENTJ / ESTP / ENTP',
      focus: 'Visi Masa Depan & Peluang Aksi',
      description:
        'Menangkap peluang besar sebelum orang lain melihatnya. Cepat mengeksekusi ide tanpa terlalu banyak ragu.',
    },
    disc: {
      type: 'D (Dominance)',
      archetype: 'The Driver / Leader',
      strengths: ['Eksekusi cepat', 'Mengambil keputusan di bawah tekanan', 'Memotivasi tim'],
      growthArea:
        'Mengendalikan dorongan impulsif dan melatih kesabaran pada proses yang bertahap.',
    },
    bigFive: {
      highTrait: 'Ekstraversi Tinggi & Dorongan Hasil',
      description: 'Memiliki energi sosial yang tinggi dan tegas menyampaikan keinginan.',
    },
    blindSpot:
      'Cenderung menganggap kehati-hatian orang lain sebagai bentuk kelambatan atau keraguan.',
    communicationStyle: 'To-the-point, lugas, berfokus pada hasil akhir, dan penuh gairah.',
  },

  Earth: {
    element: 'Earth',
    temperament: {
      name: 'Melankolis (Melancholic)',
      label: '🛡️ Tipe Analitis & Pembangun Sistem',
      keyTraits: ['Terstruktur', 'Teliti', 'Setia', 'Perfeksionis'],
      description:
        'Menyukai stabilitas, bukti nyata, dan struktur yang teratur. Memproses situasi lewat observasi mendalam dan logika praktis.',
    },
    jungian: {
      functionName: 'Penginderaan Introvert (Si)',
      mbtiMatch: 'Predominan ISTJ / ISFJ / ESTJ',
      focus: 'Realitas Konkret & Manajemen Risiko',
      description:
        'Fokus pada detail, fakta historis, serta prosedur yang teruji untuk memastikan keamanan.',
    },
    disc: {
      type: 'C (Compliance)',
      archetype: 'The Analyst / Anchor',
      strengths: ['Perencanaan matang', 'Riset mendalam', 'Manajemen kualitas & risiko'],
      growthArea:
        'Membuka diri terhadap fleksibilitas dan tidak terlalu menuntut kesempurnaan mutlak.',
    },
    bigFive: {
      highTrait: 'Conscientiousness (Kehati-hatian) Tinggi',
      description: 'Disiplin tinggi, sangat bertanggung jawab, dan terorganisir.',
    },
    blindSpot:
      'Mudah mengalami kelelahan mental (*overthinking*) saat dihadapkan pada perubahan mendadak.',
    communicationStyle: 'Runtut, berbasis fakta, hati-hati, dan terstruktur.',
  },

  Air: {
    element: 'Air',
    temperament: {
      name: 'Sanguinis (Sanguine)',
      label: '💡 Tipe Komunikator & Visioner Konseptual',
      keyTraits: ['Kreatif', 'Komunikatif', 'Luwes', 'Inovatif'],
      description:
        'Digerakkan oleh pencarian ide-ide baru dan pertukaran informasi. Memproses dunia lewat konsep abstrak dan jejaring sosial.',
    },
    jungian: {
      functionName: 'Pikiran Ekstravert (Te/Ti)',
      mbtiMatch: 'Predominan ENFP / ENTP / ENFJ',
      focus: 'Kerangka Ide & Strategi Komunikasi',
      description:
        'Mampu menghubungkan ide-ide terpisah menjadi konsep utuh dan menyampaikannya secara persuasif.',
    },
    disc: {
      type: 'I (Influence)',
      archetype: 'The Communicator / Innovator',
      strengths: ['Networking', 'Persuasi & Negosiasi', 'Brainstorming ide segar'],
      growthArea: 'Menjaga konsistensi eksekusi hingga tuntas sebelum berpindah ke ide baru.',
    },
    bigFive: {
      highTrait: 'Openness to Experience (Keterbukaan Ide) Tinggi',
      description: 'Rasa ingin tahu intelektual yang kuat dan menyukai variasi pengalaman.',
    },
    blindSpot: 'Cenderung menghindari detail administrasi atau rincian rutin yang membosankan.',
    communicationStyle: 'Antusias, konseptual, kaya metafora, dan persuasif.',
  },

  Water: {
    element: 'Water',
    temperament: {
      name: 'Flegmatis (Phlegmatic)',
      label: '🌊 Tipe Empatis & Penyelaras Hubungan',
      keyTraits: ['Penyabar', 'Adaptif', 'Empatis', 'Pendengar Baik'],
      description:
        'Menyerap dan memahami dinamika emosional lingkungan sekitar. Memproses dunia lewat intuisi rasa dan pencarian keharmonisan.',
    },
    jungian: {
      functionName: 'Perasaan Introvert/Ekstravert (Fi/Fe)',
      mbtiMatch: 'Predominan INFP / INFJ / ISFP',
      focus: 'Kompas Nilai & Kesejahteraan Jiwa',
      description:
        'Membuat keputusan berdasarkan nilai kemanusiaan, kedamaian batin, dan dampak emosional pada orang lain.',
    },
    disc: {
      type: 'S (Steadiness)',
      archetype: 'The Harmonizer / Counselor',
      strengths: ['Mediasi konflik', 'Loyalitas tinggi', 'Pendengar yang sangat peka'],
      growthArea:
        'Berani menyuarakan batas diri (*boundaries*) dan tidak takut menatap konflik terbuka.',
    },
    bigFive: {
      highTrait: 'Agreeableness & Kestabilan Empati',
      description: 'Tinggi kepedulian sosial, hangat, dan mengutamakan keharmonisan.',
    },
    blindSpot: 'Cenderung memendam kekecewaan demi menghindari konfrontasi langsung.',
    communicationStyle: 'Hangat, suportif, lembut, dan mendengarkan secara aktif.',
  },
};

export function getPsychoAnalysis(dominantElement: ElementType, coreElement?: ElementType) {
  const dominantProfile = PSYCHO_PROFILES[dominantElement] || PSYCHO_PROFILES.Fire;
  const coreProfile = coreElement ? PSYCHO_PROFILES[coreElement] : null;
  const isAligned = dominantElement === coreElement;

  return {
    dominantProfile,
    coreProfile,
    isAligned,
    summaryNarrative: isAligned
      ? `Resonansi psikologis harianmu (${dominantProfile.temperament.name}) berjalan selaras dengan karakter dasar jiwamu. Ini membuatmu mengambil keputusan secara natural dan otentik.`
      : `Ekspresi operasional harianmu cenderung seperti ${dominantProfile.temperament.name}, sedangkan kompas emosi terdalammu berakar pada ${coreProfile?.temperament.name}. Perpaduan ini memberimu fleksibilitas dalam interaksi sosial.`,
  };
}
