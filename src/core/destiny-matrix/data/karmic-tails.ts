export interface KarmicTailDefinition {
  triad: string;
  title: string;
  pastLifeDebt: string;
  manifestation: string;
  currentTriggers: string;
  healingWay: string;
  affirmation: string;
}

export const KARMIC_TAIL_DATABASE: Record<string, KarmicTailDefinition> = {
  // 1
  '18-6-6': {
    triad: '18-6-6',
    title: 'Love Magic / Fear of Rejection (Trauma Penolakan & Ilusi Ekspektasi Cinta)',
    pastLifeDebt:
      'Penyalahgunaan pesona, manipulasi perasaan orang lain, atau mengalami penolakan cinta yang traumatis di masa lalu.',
    manifestation:
      'Selalu curiga pasangan akan pergi, mencari validasi konstan, atau berekspektasi terlalu sempurna pada hubungan nyata.',
    currentTriggers:
      'Cemas berlebihan saat pasangan lambat merespons, menciptakan drama imajiner karena ketakutan bawah sadar.',
    healingWay:
      'Sembuhkan luka penolakan masa lalu. Belajarlah mencintai realitas pasangan apa adanya tanpa tuntutan fantasi sempurna.',
    affirmation:
      'Aku aman di dalam cinta. Aku melepaskan ketakutan akan penolakan dan menerima hubungan yang nyata.',
  },

  // 2
  '18-9-9': {
    triad: '18-9-9',
    title: 'The Hermit Witchcraft / Fear of Magic (Penyihir Kesendirian & Ketakutan Magis)',
    pastLifeDebt:
      'Penyalahgunaan pengetahuan magis/spiritual atau mengalami trauma persekusi mistis karena ilmu yang dimiliki.',
    manifestation:
      'Mimpi buruk yang terasa sangat nyata, manifesting negatif secara tidak sadar, dan kecemasan berlebih terhadap energi sekitar.',
    currentTriggers:
      'Overthinking obsesif dan ketakutan tidak rasional terhadap hal-hal gaib atau mistis.',
    healingWay:
      'Praktikkan spiritualitas yang terstruktur dan lakukan meditasi keheningan (grounding) secara rutin.',
    affirmation:
      'Pikiranku adalah instrumen cahaya. Aku aman dan dilindungi oleh energi alam semesta.',
  },

  // 3
  '9-18-9': {
    triad: '9-18-9',
    title: 'The Sacrificial Lamb / Magical Sacrifice (Pengorbanan Jiwa & Manipulasi Keyakinan)',
    pastLifeDebt:
      'Mengorbankan diri demi sekte/kelompok secara buta, atau sebaliknya menghasut orang lain demi kepentingan spiritual pribadi.',
    manifestation:
      'Sering merasa dimanfaatkan oleh lingkaran sosial terdekat dan terjebak dalam sindrom merasa harus menyelamatkan semua orang.',
    currentTriggers:
      'Kehilangan jati diri saat terlalu fokus memenuhi ekspektasi kelompok atau komunitas spiritual.',
    healingWay:
      'Tegakkan batasan diri yang sangat ketat. Bantu orang lain tanpa harus menumbalkan kebahagiaan pribadi Anda.',
    affirmation: 'Aku berharga. Aku bisa membantu dunia tanpa harus menghancurkan diriku sendiri.',
  },

  // 4
  '9-9-18': {
    triad: '9-9-18',
    title: 'The Magical Hermit / Wizard (Penyihir & Pengetahuan Tersembunyi)',
    pastLifeDebt:
      'Menimbun pengetahuan spiritual/ilmiah yang sangat tinggi di masa lalu namun menolak membagikannya karena mati dalam keterasingan.',
    manifestation:
      'Takut tampil di depan publik, mengalami imposter syndrome kronis, dan memiliki kecenderungan mengisolasi diri secara ekstrem.',
    currentTriggers:
      'Terus-menerus mengumpulkan sertifikasi atau belajar tanpa pernah mempraktikkannya ke dunia nyata.',
    healingWay:
      'Bagikan pengetahuan Anda secara bertahap. Gunakan intuisi dan kebijaksanaan Anda untuk membimbing sesama.',
    affirmation:
      'Dunia ini aman bagi kebijaksanaanku. Pengetahuanku adalah berkah yang siap dibagikan.',
  },

  // 5
  '15-20-5': {
    triad: '15-20-5',
    title: 'The Rebel / Broken Family Line (Pemberontak & Pemutus Karma Keluarga)',
    pastLifeDebt:
      'Melakukan tindakan yang menghancurkan nama baik atau tradisi klan keluarga, atau menjadi korban dari sistem keluarga yang tiran.',
    manifestation:
      'Rasa terasing yang mendalam dari keluarga kandung, sering dicap sebagai "anak hilang" (black sheep), dan konflik nilai radikal dengan orang tua.',
    currentTriggers:
      'Sikap defensif atau kemarahan otomatis yang meledak saat dikritik oleh anggota keluarga.',
    healingWay:
      'Posisikan diri sebagai transmutator karma. Memaafkan luka masa kecil tanpa harus menyetujui perilaku toksik mereka.',
    affirmation:
      'Trauma garis keturunanku berhenti di titik ini. Aku bebas membangun takdir baruku.',
  },

  // 6
  '15-5-8': {
    triad: '15-5-8',
    title: 'Losing Wealth / Financial Karma (Siklus Kehilangan Uang & Karma Finansial)',
    pastLifeDebt:
      'Menyalahgunakan kekayaan melimpah untuk menindas orang lain, judi, atau mendapatkan materi dengan cara yang tidak jujur.',
    manifestation:
      'Siklus finansial yang naik turun secara drastis; uang sangat cepat datang namun cepat habis karena kejadian tak terduga.',
    currentTriggers:
      'Mengambil keputusan investasi besar atau bisnis murni karena dorongan keserakahan sesaat.',
    healingWay:
      'Terapkan manajemen keuangan yang transparan dan bersihkan energi uang melalui sedekah/filantropi rutin.',
    affirmation:
      'Rezekiku bersih, mengalir dengan stabil, dan membawa keberkahan bagi banyak jiwa.',
  },

  // 7
  '18-3-12': {
    triad: '18-3-12',
    title: 'Physical Suffering / Body Invalidation (Penderitaan Fisik & Pengabaian Raga)',
    pastLifeDebt:
      'Mengalami penderitaan fisik yang parah karena kelalaian sendiri, atau menyiksa fisik orang lain demi kepuasan ego.',
    manifestation:
      'Sering mengalami masalah kesehatan misterius, fobia terhadap penyakit, atau merasa tidak nyaman dengan bentuk tubuh sendiri.',
    currentTriggers:
      'Mengabaikan jam istirahat, mengonsumsi makanan buruk secara emosional (emotional eating).',
    healingWay:
      'Rawat tubuh fisik sebagai kuil spiritual Anda. Belajarlah melakukan olahraga grounding dan meditasi tubuh.',
    affirmation:
      'Tubuhku adalah kuil suci yang sehat. Aku menghormati dan menyayangi setiap jengkal ragaku.',
  },

  // 8
  '9-15-6': {
    triad: '9-15-6',
    title: 'Worldly Passions / Love Disappointment (Keterikatan Duniawi & Kekecewaan Cinta)',
    pastLifeDebt:
      'Terjebak dalam obsesi hubungan gelap, nafsu duniawi yang berlebihan, atau memanipulasi emosi pasangan demi kepuasan fisik.',
    manifestation:
      'Selalu tertarik pada hubungan toksik (toxic attraction) dan mengalami pengkhianatan romantis secara berulang.',
    currentTriggers:
      'Munculnya rasa ingin mengontrol pasangan secara penuh atau melarikan diri ke kesenangan instan saat stres.',
    healingWay:
      'Belajarlah membangun konsep cinta tanpa syarat (unconditional love) yang didasarkan pada batasan yang sehat.',
    affirmation:
      'Aku melepaskan keterikatan obsesif. Aku layak mendapatkan cinta yang damai dan jujur.',
  },

  // 9
  '6-17-11': {
    triad: '6-17-11',
    title: 'The Lost Talent / Hidden Star (Bakat Terpendam & Ketakutan untuk Bersinar)',
    pastLifeDebt:
      'Menyembunyikan bakat luar biasa karena trauma kritik ekstrem atau memilih mundur dari panggung karena kesombongan di masa lalu.',
    manifestation:
      'Memiliki potensi besar untuk menjadi figur publik namun menderita minder kronis dan sering membandingkan diri secara ekstrem.',
    currentTriggers:
      'Menolak peluang emas untuk tampil karena ketakutan bawah sadar akan dihakimi atau dinilai gagal.',
    healingWay:
      'Ekspresikan karya Anda secara autentik tanpa perlu menunggu sempurna. Izinkan diri Anda untuk dilihat publik.',
    affirmation: 'Aku mengizinkan diriku untuk bersinar. Bakatku adalah hadiah untuk dunia.',
  },

  // 10
  '12-19-7': {
    triad: '12-19-7',
    title: 'Heroic Sacrifice / Martyr Complex (Pengorbanan Heroik & Kompleks Martir)',
    pastLifeDebt:
      'Melakukan pengorbanan besar demi negara atau kelompok di masa lalu, namun menyimpan dendam tersembunyi karena merasa tidak dihargai.',
    manifestation:
      'Sering dimanfaatkan oleh lingkungan kerja/sosial, merasa menjadi korban ketidakadilan (victim mentality).',
    currentTriggers:
      'Mengatakan "ya" pada permintaan orang lain padahal batin dan energi Anda sudah sangat kelelahan.',
    healingWay:
      'Latih sikap asertif. Sadarilah bahwa menolong diri sendiri adalah prioritas spiritual yang utama.',
    affirmation:
      'Menjaga energi dan batasan diriku adalah bentuk penghormatan tertinggiku pada Tuhan.',
  },

  // 11
  '12-17-5': {
    triad: '12-17-5',
    title: 'The Spiritual Star / Dimmed Talent (Bintang Spiritual yang Meredup)',
    pastLifeDebt:
      'Memiliki popularitas, bakat besar, atau ilmu luas di masa lalu namun gagal menggunakannya karena terjebak kesombongan atau rasa tidak percaya diri.',
    manifestation:
      'Menderita Sindrom Penipu (imposter syndrome), takut menjadi pusat perhatian, namun di sisi lain gemar menggurui secara kaku.',
    currentTriggers:
      'Menyembunyikan keahlian asli karena takut dikritik, atau bersikap kaku terhadap aturan saat memimpin.',
    healingWay:
      'Bagikan keahlian Anda tanpa bersikap menggurui. Katakan "tidak" pada orang yang memanfaatkan kebaikan Anda.',
    affirmation:
      'Pikiranku adalah ruang yang aman dan jernih. Aku mengizinkan potensiku bersinar dengan rendah hati.',
  },

  // 12
  '9-12-3': {
    triad: '9-12-3',
    title: 'The Lonely Woman / Isolation Wound (Kutukan Kesepian & Penolakan Feminin)',
    pastLifeDebt:
      'Menolak peran pengasuhan, mengisolasi diri dari cinta, atau mengalami penindasan berat dari figur otoritas wanita di masa lalu.',
    manifestation:
      'Kesulitan membangun keintiman emosional yang mendalam, ketakutan akan pernikahan, atau hubungan dingin dengan ibu.',
    currentTriggers: 'Menarik diri total dari pasangan saat terjadi kesalahpahaman kecil.',
    healingWay:
      'Sembuhkan energi feminin (divine feminine). Belajarlah menerima kelembutan dan perhatian tanpa rasa curiga.',
    affirmation: 'Pintu hatiku terbuka untuk cinta yang aman. Aku layak dikasihi secara utuh.',
  },

  // 13
  '3-22-19': {
    triad: '3-22-19',
    title: 'The Unborn Child / Lost Soul (Jiwa Pengembara & Urusan Anak yang Belum Selesai)',
    pastLifeDebt:
      'Menolak tanggung jawab membesarkan anak, mengalami keguguran traumatis, atau menyia-nyiakan masa muda di masa lalu.',
    manifestation:
      'Ketakutan berlebih untuk memiliki keturunan, atau sebaliknya, bersikap terlalu protektif (overprotective) secara tidak sehat.',
    currentTriggers:
      'Merasa sangat terbebani oleh komitmen jangka panjang yang mengikat kebebasan waktu Anda.',
    healingWay:
      'Lakukan penyembuhan anak dalam (inner child healing). Berikan kebebasan bermain bagi jiwa kekanakan Anda secara sehat.',
    affirmation: 'Jiwaku bebas dan aman. Aku menyambut tanggung jawab hidup dengan penuh sukacita.',
  },

  // 14
  '21-4-10': {
    triad: '21-4-10',
    title: 'Inability to Enjoy Life / Masculine Block (Blok Energi Maskulin & Lupa Bahagia)',
    pastLifeDebt:
      'Menjadi pekerja keras yang kejam atau tiran materi yang mengorbankan kebahagiaan demi status kekuasaan di masa lalu.',
    manifestation:
      'Mengalami burnout kronis, merasa bersalah secara batin jika bersantai, dan pola hubungan bermasalah dengan figur pria.',
    currentTriggers:
      'Panik atau merasa tidak berguna saat tidak ada pekerjaan atau proyek yang dikerjakan.',
    healingWay:
      'Sembuhkan inner father. Integrasikan energi bekerja keras dengan seni merayakan kemenangan-kemenangan kecil kehidupan.',
    affirmation:
      'Aku layak menikmati hasil kerja keras ku. Kelimpahan datang bersamaan dengan rasa damai.',
  },

  // 15
  '12-16-4': {
    triad: '12-16-4',
    title: 'The Cruel Emperor / Control Karma (Penguasa Kejam & Karma Kontrol Ego)',
    pastLifeDebt:
      'Menyalahgunakan kekuasaan politik, militer, atau status kepala keluarga untuk menindas kebebasan orang lain secara kejam.',
    manifestation:
      'Sering terlibat dalam pertarungan kekuasaan (power struggle) di tempat kerja atau konflik kendali yang intens dengan pasangan.',
    currentTriggers:
      'Marah besar ketika situasi di lapangan atau perilaku orang lain tidak berjalan sesuai rencana Anda.',
    healingWay:
      'Belajarlah mendelegasikan tugas dan melepaskan ilusi bahwa Anda harus mengontrol jalannya dunia.',
    affirmation: 'Kekuatan sejatiku adalah memberdayakan sesama, bukan mendominasi mereka.',
  },

  // 16
  '21-10-16': {
    triad: '21-10-16',
    title: 'Spiritual Awakening Failure / Tower Karma (Kegagalan Iman & Penghancuran Fondasi)',
    pastLifeDebt:
      'Menghancurkan iman kepercayaan orang banyak, atau membangun fondasi kehidupan di atas kebohongan besar dan ego.',
    manifestation:
      'Sering mengalami fase kehidupan yang hancur berantakan secara mendadak di berbagai aspek (Tower Moment).',
    currentTriggers:
      'Menolak perubahan zaman dan bersikersis mempertahankan metode usang yang sudah tidak relevan.',
    healingWay:
      'Belajar untuk ikhlas melepaskan hal yang sudah usang. Bangun kembali hidup Anda di atas fondasi kejujuran murni.',
    affirmation:
      'Setiap kehancuran dalam hidupku hanyalah cara semesta membersihkan jalan menuju bangunan yang lebih kokoh.',
  },

  // 17
  '6-8-20': {
    triad: '6-8-20',
    title: 'Disappointment of Ancestors / Family Pride (Kekecewaan Leluhur & Beban Ekspektasi)',
    pastLifeDebt:
      'Mengecewakan harapan besar klan keluarga besar atau membawa aib yang merusak nama baik leluhur di masa lalu.',
    manifestation:
      'Memiliki beban mental harus terlihat sukses di depan keluarga besar, takut gagal, dan selalu dibanding-bandingkan.',
    currentTriggers:
      'Merasa cemas luar biasa ketika pilihan karir atau pasangan hidup Anda tidak disetujui oleh orang tua.',
    healingWay:
      'Sadarilah bahwa Anda tidak lahir untuk menebus mimpi orang tua yang kandas. Jalani takdir autentik Anda sendiri.',
    affirmation:
      'Aku menghormati leluhurku, namun aku adalah pemilik tunggal atas keputusan hidupku.',
  },

  // 18
  '3-7-22': {
    triad: '3-7-22',
    title: 'The Prisoner / Freedom Debt (Tahanan Fisik & Ketakutan Kehilangan Kebebasan)',
    pastLifeDebt:
      'Mengekang kebebasan orang lain atau menjadi tahanan fisik yang mati dalam keputusasaan di masa lalu.',
    manifestation:
      'Mengalami sesak napas batin atau panik saat berkomitmen dalam pernikahan, kontrak kerja jangka panjang, atau aturan ketat.',
    currentTriggers:
      'Melakukan tindakan menghilang tiba-tiba (ghosting) ketika beban tanggung jawab sosial mulai meningkat.',
    healingWay:
      'Ubah cara pandang Anda. Lihatlah komitmen sebagai wadah suci untuk bertumbuh, bukan sebagai penjara yang mengekang.',
    affirmation:
      'Aku bebas untuk memilih komitmenku. Kebebasan sejatiku ada di dalam kedamaian hatiku.',
  },

  // 19
  '9-3-21': {
    triad: '9-3-21',
    title: 'The Locked Wanderer / Restless Soul (Jiwa Pengembara yang Terkunci)',
    pastLifeDebt:
      'Membatasi ruang gerak geografis orang lain atau membatasi diri untuk tidak mengeksplorasi dunia luas karena ketakutan.',
    manifestation:
      'Mudah merasa bosan dengan rutinitas harian, sering berpindah-pindah pekerjaan tanpa arah, dan merasa jiwanya tidak punya rumah.',
    currentTriggers:
      'Ingin kabur atau melakukan perjalanan jauh setiap kali menghadapi konflik nyata di dunia profesional.',
    healingWay:
      'Temukan rasa damai dari dalam diri sendiri terlebih dahulu. Perluas skala pengaruh Anda melalui dunia digital/global.',
    affirmation: 'Di mana pun kakiku berpijak, jiwaku aman, tenang, dan merdeka.',
  },

  // 20
  '6-5-17': {
    triad: '6-5-17',
    title: 'Spiritual Pride / Intellectual Arrogance (Kesombongan Intelektual & Ego Ilmu)',
    pastLifeDebt:
      'Merasa lebih suci, lebih pintar, atau mengucilkan orang lain karena perbedaan tingkat pengetahuan/kasta spiritual di masa lalu.',
    manifestation:
      'Suka mengkritik cara berpikir orang lain secara diam-diam dan kesulitan menerima masukan dari orang yang dianggap di bawahnya.',
    currentTriggers:
      'Terpancing emosi dan berdebat kusir saat prinsip atau ilmu pengetahuannya didebat oleh orang lain.',
    healingWay:
      'Praktikkan kerendahan hati yang radikal. Sadarilah bahwa setiap jiwa memiliki kecepatan dan jalan belajarnya masing-masing.',
    affirmation:
      'Aku adalah pembelajar seumur hidup. Aku menghormati setiap warna kebenaran di dunia ini.',
  },

  // 21
  '21-7-13': {
    triad: '21-7-13',
    title:
      'Destruction of Many Souls / Global Karma (Karma Kerusakan Massa & Tanggung Jawab Skala Besar)',
    pastLifeDebt:
      'Mengambil keputusan makro (perang, kebijakan korup, bencana industri) yang menghancurkan hajat hidup orang banyak di masa lalu.',
    manifestation:
      'Ketakutan bawah sadar yang ekstrem untuk memimpin organisasi besar, takut membuat keputusan finansial yang melibatkan orang banyak.',
    currentTriggers:
      'Ragu-ragu mengambil keputusan besar (rem-gas) sesaat sebelum eksekusi proyek massal dimulai.',
    healingWay:
      'Bayar hutang karma ini dengan cara menciptakan program atau proyek yang membawa dampak kesejahteraan massal secara positif.',
    affirmation: 'Kepemimpinanku membawa rahmat dan kemakmuran bagi semua jiwa yang aku pimpin.',
  },

  // 22
  '15-8-11': {
    triad: '15-8-11',
    title: 'Abuse of Physical Strength / Aggression Karma (Penyalahgunaan Kekuatan Fisik & Agresi)',
    pastLifeDebt:
      'Menggunakan kekuatan fisik, militer, atau kekerasan domestik untuk menekan dan melukai makhluk hidup yang lebih lemah.',
    manifestation:
      'Sering berada di lingkungan kerja yang kompetitif secara toksik atau memiliki ledakan amarah (anger issue) yang sulit dikontrol.',
    currentTriggers:
      'Munculnya insting ingin memaki atau membanting barang saat ego Anda merasa disudutkan.',
    healingWay:
      'Salurkan kelebihan energi kinetik Anda melalui olahraga berat, bela diri terarah, atau meditasi pernapasan mendalam.',
    affirmation:
      'Kekuatan sejatiku terletak pada kemampuanku mengendalikan diri dengan kelembutan.',
  },

  // 23
  '18-6-15': {
    triad: '18-6-15',
    title: 'The Dark Magician / Manipulation Core (Manipulator Ulung & Karma Kegelapan Ego)',
    pastLifeDebt:
      'Menggunakan ilmu hitam, hipnotis, atau manipulasi psikologis tingkat tinggi demi mendapatkan harta, takhta, dan cinta di masa lalu.',
    manifestation:
      'Sangat pandai membaca kelemahan psikologis orang lain, namun sering tergoda menggunakan keahlian itu untuk memanipulasi situasi.',
    currentTriggers:
      'Menggunakan taktik bermain korban (playing victim) atau gaslighting saat terjebak dalam argumen bersalah.',
    healingWay:
      'Alihkan kecerdasan psikologis Anda menjadi alat penyembuhan atau motivasi tulus untuk membantu membangkitkan mental orang lain.',
    affirmation: 'Aku menggunakan kecerdasanku murni sebagai instrumen cahaya dan kejujuran hidup.',
  },

  // 24
  '6-20-14': {
    triad: '6-20-14',
    title: 'Sacrifice to Family / Generational Burden (Pengorbanan Martir Demi Keluarga)',
    pastLifeDebt:
      'Mengorbankan seluruh impian hidup, cinta, dan masa depan pribadi murni karena dipaksa menanggung beban utang/kesalahan keluarga.',
    manifestation:
      'Merasa terjebak menjadi tulang punggung yang tidak boleh mengeluh, menomorduakan kebahagiaan pribadi demi senyum orang tua.',
    currentTriggers:
      'Muncul rasa bersalah yang amat dalam saat Anda ingin membeli barang mewah untuk diri sendiri atau pergi berlibur.',
    healingWay:
      'Sembuhkan konsep pengorbanan Anda. Anda bisa berbakti dan menyayangi keluarga tanpa harus mematikan impian jiwa Anda sendiri.',
    affirmation:
      'Aku berhak bahagia. Kebahagiaanku adalah hadiah terbaik yang bisa aku berikan kepada keluargaku.',
  },

  // 25
  '21-10-7': {
    triad: '21-10-7',
    title: 'Warrior of False Faith / Crusader Karma (Pejuang Ideologi Salah & Pemaksaan Keyakinan)',
    pastLifeDebt:
      'Menjadi eksekutor fanatik yang berjuang, membunuh, atau menindas peradaban lain demi membela ideologi/doktrin yang salah di masa lalu.',
    manifestation:
      'Sikap keras kepala ekstrem, mudah memberi cap "salah" pada gaya hidup orang lain yang tidak sejalan dengan prinsip idealis Anda.',
    currentTriggers:
      'Terbakar amarah moral (moral outrage) saat melihat fenomena sosial di internet yang tidak sesuai standar kebenaran Anda.',
    healingWay:
      'Perluas wawasan budaya Anda. Belajarlah menerima bahwa kebenaran semesta itu berdimensi banyak dan tidak tunggal.',
    affirmation:
      'Aku melepaskan fanatisme. Aku menghormati setiap perbedaan sebagai keindahan spektrum takdir.',
  },

  // 26
  '3-13-10': {
    triad: '3-13-10',
    title: 'Suicide / Wasted Life Karma (Penyia-nyiaan Karunia Kehidupan & Keputusasaan Jiwa)',
    pastLifeDebt:
      'Menyerah kalah pada ujian hidup dan memilih mengakhiri inkarnasi tubuh secara sengaja dalam keputusasaan di masa lalu.',
    manifestation:
      'Memiliki ketahanan stres yang rentan di awal kehidupan, mudah merasa "ingin menghilang saja" saat diterpa masalah bertubi-tubi.',
    currentTriggers:
      'Mengalami penolakan bisnis atau kegagalan asmara yang membuat Anda merasa dunia ini runtuh seketika.',
    healingWay:
      'Tanamkan kesadaran bahwa setiap masalah adalah modul ujian kenaikan kelas jiwa Anda. Cari bantuan profesional saat mental turun.',
    affirmation:
      'Setiap napasku adalah karunia suci. Aku kuat, aku berani, dan aku akan menyelesaikan perjalanan hidup ini dengan kemenangan.',
  },
};

export interface RumpunDefinition {
  name: string;
  icon: string;
  description: string;
  variations: { triad: string; title: string }[];
}

export const RUMPUN_DATABASE: Record<string, RumpunDefinition> = {
  '🔮': {
    name: 'Rumpun Ilusi & Pengetahuan Sunyi',
    icon: '🔮',
    description:
      'Fokus pada pergolakan batin, kecemasan pikiran, dan ketakutan bawaan untuk membuka diri, membagikan bakat, atau tampil di depan publik.',
    variations: [
      { triad: '18-6-6', title: 'Love Magic / Fear of Rejection' },
      { triad: '18-9-9', title: 'The Hermit Witchcraft / Fear of Magic' },
      { triad: '9-18-9', title: 'The Sacrificial Lamb / Magical Sacrifice' },
      { triad: '9-9-18', title: 'The Magical Hermit / Wizard' },
      { triad: '18-6-15', title: 'The Dark Magician / Manipulation Core' },
    ],
  },
  '🔥': {
    name: 'Rumpun Obsesi & Kendali Nafsu',
    icon: '🔥',
    description:
      'Fokus pada distorsi hasrat ego, baik dalam bentuk pencarian materi secara serakah, luapan dominasi fisik, maupun keterikatan hubungan cinta yang toksik.',
    variations: [
      { triad: '15-5-8', title: 'Losing Wealth / Financial Karma' },
      { triad: '9-15-6', title: 'Worldly Passions / Love Disappointment' },
      { triad: '15-8-11', title: 'Abuse of Physical Strength / Aggression Karma' },
    ],
  },
  '🌳': {
    name: 'Rumpun Luka Akar & Otoritas Leluhur',
    icon: '🌳',
    description:
      'Fokus pada konflik nilai yang intens dengan sistem klan keluarga besar, kegagalan memenuhi ekspektasi, atau penolakan mendalam terhadap tradisi.',
    variations: [
      { triad: '15-20-5', title: 'The Rebel / Broken Family Line' },
      { triad: '6-8-20', title: 'Disappointment of Ancestors / Family Pride' },
      { triad: '6-20-14', title: 'Sacrifice to Family / Generational Burden' },
    ],
  },
  '🕊️': {
    name: 'Rumpun Kekangan & Kedaulatan Jiwa',
    icon: '🕊️',
    description:
      'Fokus pada rasa sesak terhadap belenggu aturan, ketakutan bawah sadar akan hilangnya kebebasan berekspresi, serta trauma pengekangan ruang gerak.',
    variations: [
      { triad: '3-7-22', title: 'The Prisoner / Freedom Debt' },
      { triad: '9-3-21', title: 'The Locked Wanderer / Restless Soul' },
      { triad: '21-7-13', title: 'Destruction of Many Souls / Global Karma' },
    ],
  },
  '👑': {
    name: 'Rumpun Otoritas Ego & Pejuang Ideologi',
    icon: '👑',
    description:
      'Fokus pada penyalahgunaan kekuasaan makro, kesombongan intelektual, serta pemaksaan doktrin atau kontrol yang merugikan hajat hidup orang banyak.',
    variations: [
      { triad: '12-16-4', title: 'The Cruel Emperor / Control Karma' },
      { triad: '6-5-17', title: 'Spiritual Pride / Intellectual Arrogance' },
      { triad: '21-10-7', title: 'Warrior of False Faith / Crusader Karma' },
      { triad: '21-4-10', title: 'Inability to Enjoy Life / Masculine Block' },
    ],
  },
  '🎯': {
    name: 'Rumpun Kompleks Martir & Ujian Eksistensial',
    icon: '🎯',
    description:
      'Fokus pada sindrom pengorbanan diri yang salah, ketakutan tidak rasional untuk bersinar, rasa minder kronis, hingga keputusasaan berat saat diterpa ujian hidup.',
    variations: [
      { triad: '6-17-11', title: 'The Lost Talent / Hidden Star' },
      { triad: '12-19-7', title: 'Heroic Sacrifice / Martyr Complex' },
      { triad: '12-17-5', title: 'The Spiritual Star / Dimmed Talent' },
      { triad: '9-12-3', title: 'The Lonely Woman / Isolation Wound' },
      { triad: '3-22-19', title: 'The Unborn Child / Lost Soul' },
      { triad: '21-10-16', title: 'Spiritual Awakening Failure / Tower Karma' },
      { triad: '3-13-10', title: 'Suicide / Wasted Life Karma' },
    ],
  },
};

// Kamus Esensi Energi Singkat untuk Generator Narasi Dinamis
const ARCANA_ESSENCE: Record<number, { light: string; shadow: string; key: string }> = {
  1: { light: 'Inovasi & Manifestasi', shadow: 'Ego & Hambatan Memulai', key: 'Penciptaan' },
  2: { light: 'Intuisi & Keseimbangan', shadow: 'Kebohongan & Keraguan', key: 'Dualitas' },
  3: { light: 'Kelimpahan & Kasih Ibu', shadow: 'Kontrol Berlebih & Kemandulan', key: 'Merawat' },
  4: { light: 'Struktur & Kepemimpinan', shadow: 'Tirani & Perfeksionisme Kaku', key: 'Otoritas' },
  5: {
    light: 'Kebijaksanaan & Aturan',
    shadow: 'Kekakuan Berpikir & Menghakimi',
    key: 'Pembelajaran',
  },
  6: {
    light: 'Cinta Autentik & Pilihan',
    shadow: 'Segitiga Cinta & Idealism Fantasi',
    key: 'Hubungan',
  },
  7: { light: 'Target Fokus & Kemenangan', shadow: 'Siklus Rem-Gas & Apatis', key: 'Pergerakan' },
  8: {
    light: 'Keadilan & Sebab-Akibat',
    shadow: 'Pelanggaran Hukum & Ketidakseimbangan',
    key: 'Integritas',
  },
  9: {
    light: 'Kebijaksanaan Sunyi & Analisis',
    shadow: 'Isolasi Diri & Minder Kronis',
    key: 'Pengetahuan',
  },
  10: {
    light: 'Roda Nasib & Alur Keberuntungan',
    shadow: 'Stuck & Sindrom Pasif Menunggu',
    key: 'Siklus',
  },
  11: {
    light: 'Kekuatan Potensi & Daya Tahan',
    shadow: 'Agresivitas & Ledakan Amarah',
    key: 'Energi',
  },
  12: {
    light: 'Sudut Pandang Baru & Empati',
    shadow: 'Martyr Complex & Merasa Jadi Korban',
    key: 'Pengorbanan',
  },
  13: {
    light: 'Transformasi Total & Pelepasan',
    shadow: 'Takut Perubahan & Stagnasi Masa Lalu',
    key: 'Mutasi',
  },
  14: {
    light: 'Moderasi & Harmoni Emosi',
    shadow: 'Kecanduan & Perilaku Ekstrem',
    key: 'Keseimbangan',
  },
  15: { light: 'Daya Tarik & Karisma', shadow: 'Obsesi Materi, Manipulasi & Nafsu', key: 'Godaan' },
  16: {
    light: 'Kebangkitan Spiritual & Perubahan',
    shadow: 'Kehancuran Mendadak & Ego Runtuh',
    key: 'Dinamika',
  },
  17: {
    light: 'Bakat Bintang & Harapan',
    shadow: 'Pesimisme Kronis & Takut Bersinar',
    key: 'Visi',
  },
  18: {
    light: 'Daya Visualisasi & Imajinasi',
    shadow: 'Ketakutan Batin, Ilusi & Overthinking',
    key: 'Misteri',
  },
  19: {
    light: 'Kelimpahan Finansial & Sukacita',
    shadow: 'Kehilangan Semangat & Rasa Bersalah',
    key: 'Kejayaan',
  },
  20: {
    light: 'Transformasi Keluarga & Kebangkitan',
    shadow: 'Luka Garis Keturunan & Trauma Akar',
    key: 'Klan',
  },
  21: {
    light: 'Kebebasan Global & Ekspansi',
    shadow: 'Perasaan Terisolasi & Fobia Pengekangan',
    key: 'Kosmik',
  },
  22: {
    light: 'Kebebasan Murni & Langkah Baru',
    shadow: 'Lari dari Tanggung Jawab & Ketakutan Berkomitmen',
    key: 'Fobia',
  },
};

/**
 * Generates custom dynamic Karmic Tail definition when a triad is not in static database.
 * 🎯 DIBETULKAN: Menggunakan d, d1, d2 (Sumbu Karma)
 */
export function generateCustomKarmicTail(d: number, d1: number, d2: number): KarmicTailDefinition {
  const normD = d === 0 ? 22 : d;
  const normD1 = d1 === 0 ? 22 : d1;
  const normD2 = d2 === 0 ? 22 : d2;

  const arcD = ARCANA_ESSENCE[normD] || {
    light: 'Energi Kosmik',
    shadow: 'Sumbatan Energi',
    key: 'Misteri',
  };
  const arcD1 = ARCANA_ESSENCE[normD1] || {
    light: 'Energi Kosmik',
    shadow: 'Sumbatan Energi',
    key: 'Misteri',
  };
  const arcD2 = ARCANA_ESSENCE[normD2] || {
    light: 'Energi Kosmik',
    shadow: 'Sumbatan Energi',
    key: 'Misteri',
  };

  return {
    triad: `${d}-${d1}-${d2}`,
    title: `Custom Karmic: Esensi ${arcD.key} - ${arcD1.key}`,
    pastLifeDebt: `Jiwamu membawa kurikulum belajar spesifik. Cetak biru masa lalumu melibatkan getaran utama kebocoran energi pada aspek [${arcD.key}], yang dipicu oleh dinamika lintasan [${arcD1.key}].`,
    manifestation: `Di kehidupan sekarang, tantangan utamamu muncul sebagai kebocoran energi di mana kamu sering terjebak dalam kondisi "${arcD.shadow}". Kondisi ini secara berkala menekan potensi bawaanmu untuk mencapai "${arcD2.light}".`,
    currentTriggers: `Sumbatan karma ini paling cepat aktif (terpicu) saat kamu dihadapkan pada situasi yang menyentuh sisi bayangan dari Arcana ${normD1}, yaitu ketika muncul rasa "${arcD1.shadow}".`,
    healingWay: `Untuk melepas simpul ini, fokuslah menyembuhkan akar kebocoranmu dengan mengubah pola "${arcD.shadow}" menjadi kesadaran murni "${arcD.light}". Jangan biarkan ketakutanmu menyumbat aliran gerakmu.`,
    affirmation: `Aku menerima bahwa jiwaku memilih kurikulum ujian yang istimewa ini. Aku melepaskan bayangan masa lalu, merangkul energi ${arcD.key} dengan sehat, dan melangkah dengan berdaulat.`,
  };
}

/**
 * Finds Karmic Tail by triad permutation (D - D1 - D2).
 * 🎯 DIBETULKAN: Menggunakan d, d1, d2
 */
// Helper untuk menormalisasi angka Arcana
function normalizeArcana(n: number): number {
  if (n === 0) return 22;
  if (n > 22) {
    const reduced = n % 22;
    return reduced === 0 ? 22 : reduced;
  }
  return n;
}

export function findKarmicTail(d: number, d1: number, d2: number): KarmicTailDefinition {
  // Normalisasi ketiga angka dulu
  const nD = normalizeArcana(d);
  const nD1 = normalizeArcana(d1);
  const nD2 = normalizeArcana(d2);

  const permutations = [
    `${nD}-${nD1}-${nD2}`,
    `${nD}-${nD2}-${nD1}`,
    `${nD1}-${nD}-${nD2}`,
    `${nD1}-${nD2}-${nD}`,
    `${nD2}-${nD}-${nD1}`,
    `${nD2}-${nD1}-${nD}`,
  ];

  for (const key of permutations) {
    if (KARMIC_TAIL_DATABASE[key]) {
      return KARMIC_TAIL_DATABASE[key];
    }
  }

  return generateCustomKarmicTail(nD, nD1, nD2);
}

export function findRumpunByTriad(triad: string): RumpunDefinition | null {
  // 1. Cari kecocokan di database variasi statis
  for (const key in RUMPUN_DATABASE) {
    const rumpun = RUMPUN_DATABASE[key];
    if (rumpun.variations.some(v => v.triad === triad)) {
      return rumpun;
    }
  }

  // 2. Deteksi Dinamis berdasarkan angka penyusun
  const numbers = triad.split('-').map(Number);

  if (numbers.some(n => [21, 22, 4].includes(n))) return RUMPUN_DATABASE['🕊️'];
  if (numbers.some(n => [15, 11, 6].includes(n))) return RUMPUN_DATABASE['🔥'];
  if (numbers.some(n => [9, 18].includes(n))) return RUMPUN_DATABASE['🔮'];
  if (numbers.some(n => [20, 5, 3].includes(n))) return RUMPUN_DATABASE['🌳'];
  if (numbers.some(n => [12, 16, 7, 19, 13, 10, 17].includes(n))) return RUMPUN_DATABASE['🎯'];

  return RUMPUN_DATABASE['🎯']; // Default fallback rumpun
}
