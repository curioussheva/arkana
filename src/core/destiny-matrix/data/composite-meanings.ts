export interface CompositeRelationDefinition {
  arcanaNumber: number;
  soulOfUnion: string;          // Esensi utama hubungan
  partnershipStrength: string;  // Kekuatan bersama
  karmicChallenge: string;      // Tantangan/Gesekan terbesar
  growthAdvice: string;         // Solusi/Nasihat pertumbuhan
}

export const COMPOSITE_DATABASE: Record<number, CompositeRelationDefinition> = {
  1: {
    arcanaNumber: 1,
    soulOfUnion: 'The Magician (Inovasi & Manifestasi Bersama)',
    partnershipStrength: 'Hubungan yang dipenuhi ide-ide cemerlang, kemampuan komunikasi yang dinamis, dan potensi besar untuk mewujudkan mimpi atau merintis proyek baru dari nol bersama.',
    karmicChallenge: 'Gesekan ego yang kuat karena masing-masing ingin mendominasi pembicaraan atau merasa paling benar dalam mengambil keputusan.',
    growthAdvice: 'Belajarlah untuk saling mendengarkan secara tulus. Bagilah peran secara adil agar tidak ada yang merasa tersisih atau tidak dihargai.'
  },
  2: {
    arcanaNumber: 2,
    soulOfUnion: 'The High Priestess (Intuisi & Kedalaman Emosional)',
    partnershipStrength: 'Koneksi batin yang sangat pekat, saling memahami tanpa banyak bicara, serta empati mendalam yang membuat kalian menjadi tempat bersandar yang sangat aman.',
    karmicChallenge: 'Kecenderungan untuk menyimpan rahasia, memendam kekecewaan secara pasif-agresif, atau membiarkan kecurigaan merusak kepercayaan tanpa komunikasi terbuka.',
    growthAdvice: 'Ungkapkan isi hatimu secara jujur meskipun itu terasa tidak nyaman. Jangan biarkan asumsi liar merusak kehangatan hubungan kalian.'
  },
  3: {
    arcanaNumber: 3,
    soulOfUnion: 'The Empress (Kesuburan & Kelimpahan Bersama)',
    partnershipStrength: 'Hubungan yang sangat nyaman, penuh kasih sayang hangat, serta berpotensi besar dalam membangun kenyamanan finansial, rumah tangga yang makmur, atau keturunan.',
    karmicChallenge: 'Kecenderungan salah satu pihak menjadi terlalu mengontrol (posesif) atau terjebak dalam tuntutan materialistis dan kenyamanan fisik semata.',
    growthAdvice: 'Berikan ruang kebebasan untuk bertumbuh bagi satu sama lain, dan fokuslah pada penciptaan karya kreatif atau stabilitas domestik yang sehat.'
  },
  4: {
    arcanaNumber: 4,
    soulOfUnion: 'The Emperor (Fondasi Kokoh & Stabilitas Hidup)',
    partnershipStrength: 'Hubungan yang sangat terstruktur, disiplin, aman secara materi, dan memiliki rencana masa depan yang jelas serta perlindungan yang kuat satu sama lain.',
    karmicChallenge: 'Suasana hubungan bisa menjadi kaku, dingin, atau terlalu diatur oleh aturan-aturan yang membatasi ekspresi kebebasan emosional.',
    growthAdvice: 'Selipkan tawa dan kelembutan di sela-sela rutinitas kalian. Ingatlah bahwa cinta juga butuh ruang berekspresi yang santai dan tanpa tekanan.'
  },
  5: {
    arcanaNumber: 5,
    soulOfUnion: 'The Hierophant (Nilai Tradisi, Pembelajaran, & Spiritual)',
    partnershipStrength: 'Kalian disatukan oleh kesamaan visi hidup, prinsip moral, atau kecintaan pada pembelajaran. Sering kali berperan sebagai mentor atau pendukung spiritual bagi satu sama lain.',
    karmicChallenge: 'Sikap saling menceramahi, menghakimi secara moral, atau terjebak dalam kekakuan dogma yang membuat hubungan terasa seperti ruang kelas.',
    growthAdvice: 'Hargai perbedaan cara pandang pasanganmu. Belajarlah untuk menerima bahwa pertumbuhan jiwa setiap orang memiliki waktunya masing-masing.'
  },
  6: {
    arcanaNumber: 6,
    soulOfUnion: 'The Lovers (Keindahan Cinta & Pilihan Bersama)',
    partnershipStrength: 'Chemistry romantis yang sangat manis, penuh kasih sayang visual, dan kemampuan menciptakan suasana yang estetis, harmonis, serta menyenangkan.',
    karmicChallenge: 'Ketergantungan emosional yang tinggi (*codependency*), ketakutan akan konflik yang membuat kalian menutupi masalah nyata, atau keraguan dalam mengambil komitmen jangka panjang.',
    growthAdvice: 'Belajarlah menghadapi konflik dengan dewasa sebagai sarana bertumbuh, kurangi ekspektasi perfeksionisme terhadap pasangan, dan pilih komitmen secara sadar.'
  },
  7: {
    arcanaNumber: 7,
    soulOfUnion: 'The Chariot (Perjalanan & Target Bersama)',
    partnershipStrength: 'Hubungan yang sangat dinamis, berorientasi pada pencapaian target, menyukai petualangan/perjalanan fisik, dan selalu saling mendorong untuk sukses.',
    karmicChallenge: 'Kehilangan arah jika tidak memiliki visi yang sama, atau rentan berkompetisi satu sama lain sehingga melupakan esensi kerja sama tim.',
    growthAdvice: 'Tentukan satu kompas tujuan besar bersama, rayakan setiap kemenangan kecil berdua, dan hindari sikap saling mendahului demi keegoisan diri.'
  },
  8: {
    arcanaNumber: 8,
    soulOfUnion: 'Justice (Keseimbangan, Keberanian, & Hukum Sebab-Akibat)',
    partnershipStrength: 'Hubungan yang sangat adil, logis, transparan, dan menjunjung tinggi kejujuran serta kesetaraan hak dalam memikul tanggung jawab bersama.',
    karmicChallenge: 'Sikap terlalu dingin, suka menghitung siapa yang berbuat salah, atau terjebak dalam perdebatan logika yang melupakan empati dan kepekaan rasa.',
    growthAdvice: 'Ingatlah bahwa hubungan asmara bukanlah ruang sidang. Sentuhlah hati pasanganmu dengan kelembutan emosional terlebih dahulu sebelum berargumen dengan logika.'
  },
  9: {
    arcanaNumber: 9,
    soulOfUnion: 'The Hermit (Kebijaksanaan & Keheningan Jiwa)',
    partnershipStrength: 'Kedekatan intelektual dan spiritual yang sangat dalam. Kalian mampu menikmati kebersamaan dalam keheningan yang berkualitas tanpa perlu banyak kebisingan luar.',
    karmicChallenge: 'Kecenderungan untuk menarik diri, membangun benteng emosional masing-masing, atau merasa kesepian meskipun sedang berada di dalam satu ruangan.',
    growthAdvice: 'Jembatani keheningan kalian dengan obrolan dari hati ke hati yang mendalam. Berikan ruang menyendiri yang sehat tanpa kehilangan kehangatan pelukan hangat.'
  },
  10: {
    arcanaNumber: 10,
    soulOfUnion: 'The Wheel of Fortune (Aliran Takdir & Sinkronisitas)',
    partnershipStrength: 'Pertemuan kedua jiwa yang terasa sangat beruntung, santai, dan dipenuhi kejutan sinkronisitas yang ajaib. Rezeki sering datang tak terduga saat kalian bersama.',
    karmicChallenge: 'Hubungan ini rentan mengalami fluktuasi ketidakpastian. Jika tidak memiliki jangkar komitmen yang kuat, hubungan bisa goyah saat roda takdir berada di bawah.',
    growthAdvice: 'Belajarlah untuk berselancar di atas perubahan ritme hidup, bangun fondasi komitmen yang stabil, dan kelola keuangan bersama secara bijaksana.'
  },
  11: {
    arcanaNumber: 11,
    soulOfUnion: 'Strength (Gairah & Saling Menguatkan)',
    partnershipStrength: 'Kombinasi energi fisik, gairah, dan daya tahan yang luar biasa. Kalian adalah pasangan tangguh yang mampu melewati badai krisis apa pun bersama-sama.',
    karmicChallenge: 'Benturan ego yang meledak-ledak, perebutan kekuasaan dalam hubungan, atau kecenderungan memaksakan kehendak dengan cara yang kasar.',
    growthAdvice: 'Gunakan kekuatan kalian untuk saling melindungi, bukan mendominasi. Jinakkan keliaran ego masing-masing dengan kesabaran dan kelembutan kasih sayang.'
  },
  12: {
    arcanaNumber: 12,
    soulOfUnion: 'The Hanged Man (Perspektif Baru & Pengorbanan Suci)',
    partnershipStrength: 'Kepekaan empati yang luar biasa tinggi, kreativitas tanpa batas, serta kerelaan untuk saling menolong dan melayani satu sama lain dengan tulus.',
    karmicChallenge: 'Jebakan kompleks martir (merasa menjadi korban keadaan) atau membiarkan hubungan yang stagnan tanpa kepastian karena takut mengambil keputusan tegas.',
    growthAdvice: 'Bangun batasan diri yang sehat. Jangan biarkan dirimu dikorbankan atau mengorbankan pasangan demi rasa bersalah. Bergeraklah maju dari posisi diam.'
  },
  13: {
    arcanaNumber: 13,
    soulOfUnion: 'Death (Transformasi & Regenerasi Jiwa)',
    partnershipStrength: 'Koneksi yang membawa perubahan revolusioner bagi hidup kalian berdua. Kalian saling membantu untuk melepas versi diri yang lama demi lahirnya karakter baru.',
    karmicChallenge: 'Hubungan dipenuhi drama pelepasan yang intens, ketakutan ekstrem akan kehilangan, atau kesulitan beradaptasi ketika situasi hidup berubah drastis.',
    growthAdvice: 'Belajarlah untuk merelakan apa yang memang harus selesai. Biarkan masa lalu gugur agar benih-benih kebahagiaan baru memiliki ruang untuk tumbuh bersama.'
  },
  14: {
    arcanaNumber: 14,
    soulOfUnion: 'Temperance (Keharmonisan, Penyembuhan, & Ketenangan)',
    partnershipStrength: 'Hubungan yang sangat damai, membawa efek penyembuhan emosional, moderat, serta mampu menciptakan kompromi yang indah di tengah perbedaan.',
    karmicChallenge: 'Kecenderungan untuk menghindari pembahasan masalah krusial demi menjaga kedamaian semu, atau suasana hubungan yang perlahan terasa terlalu flat (hambar).',
    growthAdvice: 'Jangan takut untuk sesekali menyuarakan kegelisahanmu secara jujur. Bumbui hubungan dengan kejutan-kejutan kecil agar api cinta tetap menyala hangat.'
  },
  15: {
    arcanaNumber: 15,
    soulOfUnion: 'The Devil (Magnetisme Kuat & Pemurnian Hasrat)',
    partnershipStrength: 'Kombinasi energi yang sangat magnetis, penuh gairah, memiliki chemistry fisik luar biasa, serta ambisi materi yang sangat kuat untuk sukses finansial bersama.',
    karmicChallenge: 'Rentannya manipulasi psikologis, kecemburuan buta, ketergantungan emosional yang tidak sehat (*codependency*), atau godaan gaya hidup konsumtif.',
    growthAdvice: 'Transformasikan energi obsesif ini menjadi kerja sama bisnis yang sehat, kedepankan transparansi emosional, dan jaga batas moral dalam hubungan.'
  },
  16: {
    arcanaNumber: 16,
    soulOfUnion: 'The Tower (Membangun Kembali Fondasi Sejati)',
    partnershipStrength: 'Hubungan yang menuntut kejujuran mutlak tanpa topeng. Kebersamaan kalian memiliki kekuatan untuk menghancurkan ilusi-ilusi palsu demi membangun hidup baru yang kokoh.',
    karmicChallenge: 'Sering menghadapi krisis atau perubahan mendadak di luar rencana yang menguji stabilitas komitmen dan emosi kalian secara radikal.',
    growthAdvice: 'Ketika badai meruntuhkan rencana kalian, jangan saling menyalahkan. Berpeganganlah erat dan fokuslah untuk membangun kembali fondasi hidup yang lebih jujur.'
  },
  17: {
    arcanaNumber: 17,
    soulOfUnion: 'The Star (Harapan, Inspirasi, & Visi Masa Depan)',
    partnershipStrength: 'Hubungan yang sangat inspiratif, indah, dipenuhi mimpi-mimpi besar, romantis, serta saling mendukung untuk bersinar di bidang masing-masing.',
    karmicChallenge: 'Kecenderungan terjebak dalam ekspektasi fantasi yang terlalu tinggi, sehingga merasa kecewa ketika berhadapan dengan realita harian yang biasa saja.',
    growthAdvice: 'Tetaplah bermimpi bersama, namun pastikan kedua kaki kalian tetap memijak bumi dengan mengapresiasi keindahan di balik kesederhanaan hidup sehari-hari.'
  },
  18: {
    arcanaNumber: 18,
    soulOfUnion: 'The Moon (Imajinasi, Rasa, & Alam Bawah Sadar)',
    partnershipStrength: 'Koneksi emosional yang sangat dalam, puitis, kaya akan imajinasi, serta memiliki ikatan batin bawah sadar yang sangat kuat satu sama lain.',
    karmicChallenge: 'Ketakutan tak beralasan, kecurigaan yang lahir dari proyeksi kecemasan pribadi, atau terjebak dalam ilusi emosi yang pasang-surut.',
    growthAdvice: 'Bawa setiap ketakutan atau keraguanmu ke dalam obrolan yang santai dan terbuka di siang hari yang terang. Buatlah jangkar realita agar pikiranmu tidak tersesat dalam kecemasan.'
  },
  19: {
    arcanaNumber: 19,
    soulOfUnion: 'The Sun (Kehangatan, Kegembiraan, & Kelimpahan)',
    partnershipStrength: 'Hubungan yang dipenuhi kehangatan, tawa riang, optimisme, keberuntungan materi, serta mampu membawa energi positif bagi lingkungan di sekitar kalian.',
    karmicChallenge: 'Ego yang bersaing memperebutkan perhatian (siapa yang paling bersinar) atau kecenderungan salah satu pihak bersikap terlalu kekanak-kanakan.',
    growthAdvice: 'Saling berbagilah panggung perhatian. Jadilah pendukung terbesar bagi kesuksesan pasanganmu tanpa merasa redup di samping cahayanya.'
  },
  20: {
    arcanaNumber: 20,
    soulOfUnion: 'Judgement (Kebangkitan & Rekonsiliasi Keluarga)',
    partnershipStrength: 'Hubungan yang membawa misi penting untuk menyembuhkan luka antargenerasi, berdamai dengan masa lalu, serta memiliki kedalaman spiritual yang matang.',
    karmicChallenge: 'Kecenderungan untuk mengungkit-ungkit kesalahan masa lalu atau terjebak dalam tuntutan keluarga besar yang mencampuri urusan domestik kalian.',
    growthAdvice: 'Jadikan masa lalu sebagai guru terbaik, bukan senjata untuk melukai. Bangunlah benteng perlindungan yang sehat bagi privasi rumah tangga kalian.'
  },
  21: {
    arcanaNumber: 21,
    soulOfUnion: 'The World (Kebebasan, Integrasi, & Kedamaian Global)',
    partnershipStrength: 'Hubungan yang sangat lapang, bebas dari batasan sempit, memiliki pemikiran global, serta membawa rasa damai dan kepuasan batin yang seutuhnya.',
    karmicChallenge: 'Kesulitan untuk menetap di satu tempat atau fokus pada detail praktis kehidupan karena pikiran yang terlalu luas menjelajahi dunia.',
    growthAdvice: 'Nikmati kebebasan mengeksplorasi dunia bersama, namun luangkan waktu untuk menciptakan satu tempat pulang yang stabil bagi fisik dan emosi kalian.'
  },
  22: {
    arcanaNumber: 22,
    soulOfUnion: 'The Fool (Kebebasan Murni & Petualangan Baru)',
    partnershipStrength: 'Hubungan yang sangat santai, bebas dari drama masa lalu, penuh tawa spontan, dan selalu siap menghadapi petualangan hidup baru dengan hati ringan.',
    karmicChallenge: 'Kurangnya tanggung jawab praktis, perilaku impulsif yang berisiko merusak kestabilan finansial, atau keengganan untuk membicarakan komitmen jangka panjang.',
    growthAdvice: 'Bersenang-senanglah menikmati petualangan hidup, namun jangan abaikan persiapan bekal logistik serta keselamatan jalur perjalanan masa depan kalian.'
  }
};

export function getCompositeInterpretation(centerArcana: number): CompositeRelationDefinition {
  return COMPOSITE_DATABASE[centerArcana] || {
    arcanaNumber: centerArcana,
    soulOfUnion: `Arcana ${centerArcana}: Jalur Pembelajaran Bersama`,
    partnershipStrength: 'Pertemuan energi kalian membentuk wadah pembelajaran yang sangat berharga untuk saling melatih kedewasaan ego masing-masing.',
    karmicChallenge: 'Tantangan ego personal yang sesekali berbenturan perlu dihadapi dengan kepala dingin demi menyelaraskan visi jangka panjang.',
    growthAdvice: 'Gali aspek positif dari getaran energi ini untuk mempererat kualitas komunikasi serta komitmen harian kalian.'
  };
}
