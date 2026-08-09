import type { ArcanaDefinition } from '../../arcana/types';

/* -------------------------------------------------------------------------- */
/*                              Element Advice                                */
/* -------------------------------------------------------------------------- */

export const ELEMENT_ADVICE: Record<ArcanaDefinition['element'], string> = {
  Fire: 'Salurkan energi apimu melalui olahraga, seni, atau proyek yang menantang. Hindari keputusan impulsif; gunakan kekuatanmu untuk menginspirasi orang lain.',

  Water:
    'Luangkan waktu untuk berefleksi dan bermeditasi. Percayai intuisimu, tetapi jangan biarkan dirimu tenggelam terlalu dalam dalam emosi. Ekspresikan perasaanmu melalui karya seni.',

  Air: 'Asah kemampuan komunikasimu melalui diskusi, menulis, atau mengajar. Hindari overthinking dan seimbangkan pikiran yang aktif dengan tindakan nyata.',

  Earth:
    'Bangun fondasi hidupmu melalui rutinitas yang sehat, disiplin, dan perencanaan yang matang. Nikmati setiap prosesnya serta rayakan pencapaian-pencapaian kecilmu.',
};

/* -------------------------------------------------------------------------- */
/*                            Element Opening                                 */
/* -------------------------------------------------------------------------- */

export const ELEMENT_OPENINGS: Record<ArcanaDefinition['element'], readonly string[]> = {
  Fire: [
    'Api dalam dirimu sedang menyala terang, mendorong keberanian untuk mengambil aksi nyata.',
    'Ada semangat membara yang mengalir di setiap langkahmu saat ini—saatnya melangkah maju.',
    'Energi api yang kuat memberikan dorongan besar bagimu untuk memimpin dan mulai berkreasi.',
  ],

  Water: [
    'Kedalaman emosimu bukanlah sebuah kelemahan, melainkan sumber kebijaksanaan terbesarmu.',
    'Intuisimu mengalir jernih seperti air, membimbing langkahmu dengan sangat lembut.',
    'Kepekaan hatimu adalah radar alami yang akan menuntunmu ke arah yang tepat.',
  ],

  Air: [
    'Pikiran yang tajam dan ide-ide cemerlang adalah anugerah terbesarmu saat ini.',
    'Kemampuanmu dalam berkomunikasi dan bertukar gagasan adalah kunci kekuatanmu.',
    'Energi udara membawa inspirasi segar dan koneksi baru ke dalam hidupmu.',
  ],

  Earth: [
    'Kestabilan dan ketekunan yang kamu miliki adalah fondasi utama dari kesuksesanmu.',
    'Layaknya bumi yang kokoh, kamu adalah sosok yang sangat diandalkan oleh orang-orang di sekitarmu.',
    'Kesabaranmu dalam berproses perlahan akan membuahkan hasil yang nyata dan bertahan lama.',
  ],
};

/* -------------------------------------------------------------------------- */
/*                          Narrative Templates                               */
/* -------------------------------------------------------------------------- */

export const NARRATIVE_TEMPLATES = [
  (essence: string, personality: string, direction: string, element: string, year: string) =>
    `Perjalanan spiritualmu bermula dari inti jiwa **${essence}**. ` +
    `Karakter **${personality}** menjadi fondasi utama yang mendorongmu bergerak maju menuju **${direction}**. ` +
    `${element} Khusus tahun ini, getaran energi dari **${year}** hadir untuk membimbing serta menguji langkahmu.`,

  (essence: string, personality: string, direction: string, element: string, year: string) =>
    `Kekuatan terbesarmu memancar penuh ketika esensi batin **${essence}** berpadu selaras dengan karakter **${personality}** yang kamu tunjukkan ke dunia. ` +
    `Kombinasi inilah yang mengarahkan jalan hidupmu menuju kelimpahan **${direction}**. ` +
    `${element} Di tahun dengan energi **${year}** ini, kamu sedang dipanggil untuk bertumbuh lebih dewasa.`,

  (essence: string, personality: string, direction: string, element: string, year: string) =>
    `Melalui inti jiwa **${essence}**, kamu diajarkan untuk mengenali jati dirimu yang paling autentik, sementara energi **${personality}** membentuk caramu untuk hadir dan bersinar di dunia. ` +
    `Arah hidup **${direction}** merupakan panggilan jiwamu yang sesungguhnya. ` +
    `${element} Energi dari **${year}** di tahun ini siap membawakan pelajaran hidup yang sangat berharga bagimu.`,
] as const;

/* -------------------------------------------------------------------------- */
/*                               Challenges                                   */
/* -------------------------------------------------------------------------- */

export const CHALLENGES: Record<number, string> = {
  1: 'Jangan biarkan keraguan diri menghalangi inisiatifmu.',
  2: 'Percayalah pada intuisi batinmu, bukan hanya logika semata.',
  3: 'Kurangi ketergantunganmu pada validasi orang lain.',
  4: 'Jangan terlalu kaku pada keadaan; fleksibilitas adalah kuncimu.',
  5: 'Jangan takut untuk melepaskan dan meninggalkan masa lalu.',
  6: 'Beranilah mengambil keputusan penting berdasarkan kata hatimu.',
  7: 'Kurangi kebiasaan menganalisis secara berlebihan dan mulailah bertindak.',
  8: 'Ambil keputusan hidupmu dengan tegas dan mantap.',
  9: 'Jangan mengisolasi diri atau menarik diri dari lingkungan sekitar.',
  10: 'Terimalah setiap perubahan sebagai bagian alami dari kehidupan.',
  11: 'Gunakan kekuatan dan pengaruhmu dengan penuh kebijaksanaan.',
  12: 'Belajarlah melihat persoalan hidup dari sudut pandang yang berbeda.',
  13: 'Beranilah mengakhiri hal-hal yang tidak lagi mendukung pertumbuhanmu.',
  14: 'Jagalah keseimbangan antara ambisi dan ketenangan hidup.',
  15: 'Hindari obsesi yang menguras energi dan pola hubungan yang tidak sehat.',
  16: 'Izinkan struktur lama dalam hidupmu runtuh demi lahirnya awal yang baru.',
  17: 'Pertahankan harapan dan impian besarmu.',
  18: 'Hadapi ketakutan terdalam yang ada di dalam dirimu.',
  19: 'Izinkan dirimu untuk menikmati kebahagiaan-kebahagiaan kecil.',
  20: 'Lakukan evaluasi diri secara jujur tanpa menghakimi dirimu sendiri.',
  21: 'Selesaikan dengan baik apa yang sudah kamu mulai.',
  22: 'Beranilah melangkah memasuki petualangan hidup yang baru.',
};

/* -------------------------------------------------------------------------- */
/*                                Strengths                                   */
/* -------------------------------------------------------------------------- */

export const STRENGTHS: Record<number, string> = {
  1: 'Kemampuan luar biasa dalam mewujudkan ide abstrak menjadi kenyataan.',
  2: 'Intuisi batin yang sangat tajam dan peka.',
  3: 'Kreativitas tinggi serta daya tarik alami yang memikat.',
  4: 'Kemampuan luar biasa dalam membangun fondasi hidup yang kokoh.',
  5: 'Sifat adaptif dan luwes dalam menghadapi perubahan.',
  6: 'Kemampuan alami untuk menciptakan hubungan yang harmonis dan damai.',
  7: 'Gaya berpikir yang mendalam, terstruktur, dan analitis.',
  8: 'Integritas tinggi serta rasa keadilan yang kuat.',
  9: 'Kebijaksanaan mendalam yang lahir dari pengalaman hidup.',
  10: 'Ketangguhan (resiliensi) luar biasa dalam menghadapi badai perubahan.',
  11: 'Kekuatan batin dan mental yang sangat tangguh.',
  12: 'Kemampuan objektif dalam melihat situasi dari berbagai perspektif.',
  13: 'Keberanian besar untuk bertransformasi dan lahir kembali.',
  14: 'Kesabaran yang luas dan kemampuan menjaga keseimbangan batin.',
  15: 'Keberanian untuk menghadapi dan berdamai dengan sisi gelap diri.',
  16: 'Kemampuan hebat untuk bangkit kembali setelah mengalami kegagalan.',
  17: 'Daya inspirasi yang kuat bagi orang-orang di sekitarmu.',
  18: 'Kepekaan tinggi terhadap intuisi dan pesan alam bawah sadar.',
  19: 'Optimisme hangat yang mudah menular ke sekitarmu.',
  20: 'Kemampuan refleksi diri yang jujur dan mendalam.',
  21: 'Kemampuan menyelesaikan setiap tanggung jawab dengan tuntas dan baik.',
  22: 'Keterbukaan penuh terhadap petualangan dan pengalaman baru.',
};

/* -------------------------------------------------------------------------- */
/*                          Chakra Status Text                                */
/* -------------------------------------------------------------------------- */

export const CHAKRA_DESCRIPTIONS = {
  Balanced: 'Energi mengalir dengan harmonis dan seimbang.',

  Overactive:
    'Energi bergerak terlalu berlebihan dan membutuhkan grounding (penyelarasan ke bumi).',

  Blocked: 'Energi tersumbat dan membutuhkan pemulihan batin serta penyembuhan emosional.',
} as const;
