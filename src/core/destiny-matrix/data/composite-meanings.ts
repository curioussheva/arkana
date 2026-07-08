// src/core/destiny-matrix/data/composite-meanings.ts

export interface CompositeRelationDefinition {
  arcanaNumber: number;
  soulOfUnion: string;      // Esensi utama hubungan
  partnershipStrength: string; // Kekuatan bersama
  karmicChallenge: string;     // Tantangan/Gesekan terbesar
  growthAdvice: string;        // Solusi/Nasihat pertumbuhan
}

export const COMPOSITE_DATABASE: Record<number, CompositeRelationDefinition> = {
  3: {
    arcanaNumber: 3,
    soulOfUnion: 'The Empress (Kesuburan & Kelimpahan Bersama)',
    partnershipStrength: 'Hubungan yang sangat nyaman, penuh kasih sayang, dan berpotensi besar dalam membangun kenyamanan finansial, rumah tangga yang makmur, atau keturunan.',
    karmicChallenge: 'Kecenderungan salah satu pihak menjadi terlalu mengontrol (posesif) atau terjebak dalam pusaran tuntutan materialistis.',
    growthAdvice: 'Berikan ruang kebebasan satu sama lain dan fokuslah pada penciptaan karya kreatif atau stabilitas domestik tanpa memaksakan kehendak.'
  },
  10: {
    arcanaNumber: 10,
    soulOfUnion: 'The Wheel of Fortune (Aliran Takdir & Keberuntungan)',
    partnershipStrength: 'Pertemuan kedua jiwa ini terasa sangat beruntung, santai, dan dipenuhi sinkronisitas kebetulan yang ajaib. Rezeki sering datang secara tak terduga saat kalian bersama.',
    karmicChallenge: 'Hubungan ini rentan mengalami fluktuasi ketidakpastian. Jika tidak memiliki jangkar yang kuat, komitmen bisa goyah saat roda kehidupan berada di bawah.',
    growthAdvice: 'Belajarlah untuk berselancar di atas perubahan ritme hidup, bangun fondasi komitmen yang stabil, dan jangan hanya mengandalkan keberuntungan jangka pendek.'
  },
  15: {
    arcanaNumber: 15,
    soulOfUnion: 'The Devil (Magnetisme Kuat & Pemurnian Hasrat)',
    partnershipStrength: 'Kombinasi energi yang sangat magnetis, penuh gairah, memiliki chemistry fisik yang luar biasa, serta ambisi materi yang sangat masif untuk sukses bersama.',
    karmicChallenge: 'Rentannya manipulasi psikologis, kecemburuan buta, ketergantungan emosional yang tidak sehat (*codependency*), atau godaan gaya hidup konsumtif.',
    growthAdvice: 'Transformasikan energi obsesif ini menjadi ambisi bisnis yang sehat, kedepankan transparansi total, dan jaga batas moral dalam hubungan.'
  }
  // Anda dapat memperluas dari Arcana 1 hingga 22 sesuai kebutuhan pustaka narasi Anda...
};

export function getCompositeInterpretation(centerArcana: number): CompositeRelationDefinition {
  return COMPOSITE_DATABASE[centerArcana] || {
    arcanaNumber: centerArcana,
    soulOfUnion: `Arcana ${centerArcana}: Jalur Pembelajaran Bersama`,
    partnershipStrength: 'Pertemuan energi kalian membentuk sebuah wadah pembelajaran baru untuk saling melengkapi ego masing-masing.',
    karmicChallenge: 'Tantangan ego personal yang saling berbenturan perlu diredam demi keharmonisan visi jangka panjang.',
    growthAdvice: 'Gali aspek positif dari Arcana ini untuk menyelaraskan komunikasi dan komitmen harian kalian.'
  };
}
