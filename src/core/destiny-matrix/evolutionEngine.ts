import type { ArcanaDefinition } from '../arcana/types';
import type { AssessmentState } from '../assessment/assessmentEngine';

export interface EvolutionPointsInput {
  D: ArcanaDefinition; // Karma Masa Lalu (Akar Masalah)
  B: ArcanaDefinition; // Kekuatan Mental (Proses Pikir)
  A: ArcanaDefinition; // Titik Uji (Ujian Karakter Nyata)
  E: ArcanaDefinition; // Inti Jiwa / Comfort Zone (Katalis Roda)
  C: ArcanaDefinition; // Goal / Hasil Finansial Akhir (Puncak Sukses)
}

/**
 * Helper internal untuk menyamakan format penulisan nama kartu: Tarot Name ("Matrix Name")
 */
function formatCardName(arcana: ArcanaDefinition, fallback: string): string {
  if (!arcana) return fallback;
  const tarot = arcana.tarotName;
  const matrix = arcana.matrixName;

  if (tarot && matrix) {
    return `${tarot} ("${matrix}")`;
  }
  return tarot || matrix || fallback;
}

/**
 * Pustaka Kalimat Penyambung (Modular Narrative Weaver).
 * Kini menggunakan helper formatCardName agar narasinya mengalir selaras dengan layar lainnya.
 */
const NARRATIVE_BRIDGES = {
  intro: (d: ArcanaDefinition) => 
    `## 🔴 Tahap 1: Akar Pola Masa Lalu\n\n` +
    `Perjalanan hidupmu saat ini sangat dipengaruhi oleh sebuah pola emosional bawah sadar yang mendalam, yang diwakili oleh energi **${formatCardName(d, 'Arcana Karma')}**. ` +
    `Ini adalah jangkar masalah yang perlu kamu urai terlebih dahulu. Kebanyakan tantangan berulang yang kamu hadapi bersumber dari satu pelajaran hidup yang belum tuntas, yaitu tentang **${d.karmicLessons[0] || 'pendewasaan diri'}**. Selama ini belum disadari, kamu akan merasa seperti berjalan di tempat.`,

  dToB: (b: ArcanaDefinition) => 
    `\n\n## 🧠 Tahap 2: Senjata Mental & Bakatmu\n\n` +
    `Kabar baiknya, untuk memutus lingkaran setan tersebut, jiwamu dibekali dengan kekuatan mental yang luar biasa melalui arketipe **${formatCardName(b, 'Arcana Mental')}**. ` +
    `Pikiranmu akan bekerja paling tajam dan membawa solusi ketika kamu berani mengandalkan bakat alami dirimu dalam **${b.talents[0] || 'menganalisis keadaan'}**. ` +
    `Langkah praktis terbaik untuk mengaktifkan kekuatan ini adalah fokus untuk **${b.advice[0] || 'menjaga kejernihan pikiran'}**.`,

  bToA: (a: ArcanaDefinition) => 
    `\n\n## ⚖️ Tahap 3: Ujian Karakter Nyata\n\n` +
    `Namun, teori dan bakat mental saja tidak cukup. Semuanya akan diuji secara nyata dalam kehidupan sehari-hari lewat energi **${formatCardName(a, 'Arcana Ujian')}**. ` +
    `Di sinilah dunia luar menguji seberapa kuat prinsipmu, terutama dalam menghadapi situasi di mana ego dan emosimu ditantang secara langsung.`,

  // 🔴 ALUR BLOKADE (Siklus Terjebak / Stuck Loop)
  stuckLoop: (a: ArcanaDefinition, d: ArcanaDefinition, e: ArcanaDefinition, c: ArcanaDefinition) => 
    `\n\n---\n\n### ⚠️ Kondisi Saat Ini: Siklus Terhambat\n\n` +
    `Dari refleksi yang kamu lakukan, energi takdirmu saat ini **sedang mengalami penyumbatan**. Kamu cenderung terseret ke sisi bayangan energimu, seperti: *${a.shadowTraits.slice(0, 3).join(', ')}*.\n\n` +
    `**Dampak yang Kamu Rasakan:**\n` +
    `Karena ujian di tahap ini belum terlewati, energimu memantul kembali ke bawah. Ini menjelaskan mengapa kamu sering merasa frustrasi karena menghadapi konflik yang itu-itu saja, serta kembali menghidupkan rasa takut lamamu terhadap **${d.fears[0] || 'kegagalan'}**.\n\n` +
    `🔒 **Dampak ke Finansial & Kedamaian:**\n` +
    `Selama sumbatan emosional ini belum kamu urai dengan belajar untuk **${a.advice[0] || 'menerima kenyataan'}**, akses menuju rasa damai terdalammu (**${formatCardName(e, 'Inti Jiwa')}**) serta pintu kelimpahan finansialmu (**${formatCardName(c, 'Puncak Finansial')}**) akan terasa **terkunci dan sulit dijangkau**. Kamu sedang menghalangi potensimu sendiri karena pola lama ini.`,

  // 🟡 ALUR TRANSISI (Proses Pembersihan / Kuesioner Netral)
  partialFlow: (e: ArcanaDefinition, c: ArcanaDefinition) =>
    `\n\n---\n\n### 🌗 Kondisi Saat Ini: Fase Transisi & Pembersihan\n\n` +
    `Kabar yang sangat melegakan! Kamu mulai berhasil mengurai sumbatan di tahap ujian karakter. Perlahan, pintu menuju kedamaian sejati jiwamu (**${formatCardName(e, 'Inti Jiwa')}**) mulai terbuka. Kamu sedang berada di fase transisi yang sangat penting.\n\n` +
    `**Apa yang Sedang Terjadi pada Dirimu?**\n` +
    `Kamu mulai mengenali polamu yang salah di masa lalu dan berusaha memperbaikinya. Karunia alamimu berupa **${e.gifts.slice(0, 2).join(' dan ')}** sudah mulai muncul ke permukaan, meskipun getarannya terkadang masih naik-turun karena sisa-sisa kebiasaan lama.\n\n` +
    `🔒 **Status Energi Finansial:**\n` +
    `Jalur kelimpahan menuju **${formatCardName(c, 'Puncak Finansial')}** saat ini statusnya adalah **tertunda (menunggu kesiapanmu)**, bukan tertutup. Begitu kamu bisa lebih konsisten dan stabil menjaga ketenangan batin, energi kemakmuran ini akan langsung mengalir deras secara alami.\n\n` +
    `💡 **Langkah Navigasi Berikutnya:**\n` +
    `Fokuskan harimu pada pemulihan batin dan spiritual, terutama dalam hal **${e.narrative.spirituality.toLowerCase()}**. Ini adalah obat penenang sekaligus booster tercepat untuk menuntaskan fase transisimu.`,

  // 🟢 ALUR MENGALIR (Siklus Mulus / Flow State)
  flowToE: (e: ArcanaDefinition) => 
    `\n\n---\n\n### ✨ Kondisi Saat Ini: Energi Mengalir Selaras (Flow State)\n\n` +
    `Luar biasa! Kamu telah berhasil memenangkan ujian karaktermu dengan matang. Aliran energimu kini menembus inti terdalam jiwa, membuatmu berhasil pulang ke 'rumah batin' sejatimu sebagai pemilik energi **${formatCardName(e, 'Inti Jiwa')}** yang autentik.\n\n` +
    `Saat ini, karunia **${e.gifts.slice(0, 2).join(' dan ')}** aktif sepenuhnya menjadi magnet pelindung dalam hidupmu. Kamu merasakan kedamaian batin yang kokoh karena kamu telah mampu menyelaraskan hidup dengan **${e.narrative.spirituality.toLowerCase()}**.`,

  eToC: (c: ArcanaDefinition) => 
    `\n\n## 🚀 Tahap Akhir: Kelimpahan Finansial & Misi Hidup\n\n` +
    `Ketika jiwamu sudah berada di frekuensi yang tenang dan selaras, roda takdir secara otomatis akan menarik kemakmuran materi ke hidupmu tanpa perlu kamu kejar dengan stres. Puncak perwujudan rezeki dan kesuksesan finansialmu akan terbuka sangat lebar melalui bidang: **${c.career.slice(0, 3).join(', ')}**.\n\n` +
    `Kamu akan mampu menjalankan misi besar hidupmu untuk **${c.lifeMission[0] || 'membawa kebaikan bagi sesama'}** dengan penuh kelonggaran. Kunci getaran kemakmuran ini setiap pagi dengan menegaskan dalam hati: *"${c.affirmations[0] || 'Saya selaras dengan kelimpahan alam semesta.'}"*`
};


/**
 * FUNGSI UTAMA: Merangkai potongan string secara struktural (Deterministic Text Assembly).
 * Sangat ringan, berjalan 100% offline, bebas alokasi memori berlebih.
 */
export function compileEvolutionCycle(
  points: EvolutionPointsInput,
  currentState: AssessmentState
): string {
  const { D, B, A, E, C } = points;

  let narrativeOutput = NARRATIVE_BRIDGES.intro(D);
  narrativeOutput += NARRATIVE_BRIDGES.dToB(B);
  narrativeOutput += NARRATIVE_BRIDGES.bToA(A);

  if (currentState === 'NEGATIF') {
    narrativeOutput += NARRATIVE_BRIDGES.stuckLoop(A, D, E, C);
  } else if (currentState === 'NETRAL') {
    // 🆕 Fase transisi: E terbuka, C masih tertunda
    narrativeOutput += NARRATIVE_BRIDGES.partialFlow(E, C);
  } else {
    // POSITIF: siklus penuh terbuka
    narrativeOutput += NARRATIVE_BRIDGES.flowToE(E);
    narrativeOutput += NARRATIVE_BRIDGES.eToC(C);
  }

  return narrativeOutput;
}
 