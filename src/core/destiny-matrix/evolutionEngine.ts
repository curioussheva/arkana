// Berkas: src/core/evolution/evolutionEngine.ts

import type { ArcanaDefinition } from '../arcana/types';
import type { AssessmentState } from '../assessment/assessmentEngine';

export interface EvolutionPointsInput {
  D: ArcanaDefinition; // Karma Masa Lalu (Akar Pola)
  B: ArcanaDefinition; // Kekuatan Mental (Pikiran/Bakat)
  A: ArcanaDefinition; // Ujian Karakter (Titik Balik)
  E: ArcanaDefinition; // Inti Jiwa / Comfort Zone
  C: ArcanaDefinition; // Puncak Finansial / Misi Hidup
}

/**
 * Helper internal untuk menyamakan penulisan nama kartu: Tarot Name ("Matrix Name")
 */
function formatCardName(arcana: ArcanaDefinition, fallback: string): string {
  if (!arcana) return fallback;
  const tarot = arcana.tarotName;
  const matrix = arcana.matrixName;
  const cleanId = arcana.id === 0 ? 22 : arcana.id;

  if (tarot && matrix) {
    return `#${cleanId} ${tarot} ("${matrix}")`;
  }
  return `#${cleanId} ${tarot || matrix || fallback}`;
}

/**
 * Pustaka Narasi Penyambung (Modular Narrative Weaver) dengan alur storytelling alami.
 */
const NARRATIVE_BRIDGES = {
  intro: (d: ArcanaDefinition) =>
    `## 🔴 Phase 1: Urai Akar Pola Masa Lalu\n\n` +
    `Perjalananmu dimulai dari memahami kecenderungan emosional bawah sadar yang diwakili oleh **${formatCardName(d, 'Arcana Karma')}**. ` +
    `Ini adalah jangkar pembalajaran utama jiwamu. Kebanyakan konflik berulang yang kamu alami bersumber dari satu pelajaran penting yang belum tuntas, yaitu tentang **${d.karmicLessons?.[0] || 'pendewasaan kesadaran batin'}**. Tanpa menyadari pola ini, kamu akan merasa terus mengulangi siklus yang sama.`,

  dToB: (b: ArcanaDefinition) =>
    `\n\n## 🧠 Phase 2: Senjata Pikiran & Bakat Alami\n\n` +
    `Untuk memutus rantai masalah tersebut, kamu dibekali oleh ketajaman pola pikir melalui arketipe **${formatCardName(b, 'Arcana Mental')}**. ` +
    `Perspektifmu bekerja paling jernih ketika kamu berani mengandalkan bakat alamimu dalam **${b.talents?.[0] || 'memahami esensi masalah'}**. ` +
    `Kunci penguat tahap ini adalah menjaga konsistensi untuk **${b.advice?.[0] || 'menjaga kestabilan pikiran'}**.`,

  bToA: (a: ArcanaDefinition) =>
    `\n\n## ⚖️ Phase 3: Gerbang Ujian Karakter Nyata\n\n` +
    `Teori dan bakat mental kemudian diuji secara riil dalam panggung kehidupan melalui **${formatCardName(a, 'Arcana Ujian')}**. ` +
    `Di sinilah dunia nyata menguji seberapa kokoh prinsipmu, terutama saat berhadapan dengan situasi yang memicu ego dan dorongan emosional.`,

  // 🔴 ALUR BLOKADE (Stuck Loop)
  stuckLoop: (a: ArcanaDefinition, d: ArcanaDefinition, e: ArcanaDefinition, c: ArcanaDefinition) =>
    `\n\n---\n\n### ⚠️ Status Dinamika Batin: Siklus Terhambat\n\n` +
    `Berdasarkan refleksi dirimu, aliran energimu saat ini **mengalami hambatan di tahap Ujian Karakter**. Kamu cenderung tertarik ke sisi bayangan energimu: *${a.shadowTraits?.slice(0, 3).join(', ') || 'reaksi defensif'}*.\n\n` +
    `**Dampak pada Realitas:**\n` +
    `Karena ujian di titik ini belum terselesaikan dengan tenang, energi takdirmu memantul kembali ke bawah. Hal ini menjelaskan mengapa kamu sering merasa kewalahan dan kembali mengundang rasa takut lama terhadap **${d.fears?.[0] || 'kegagalan'}**.\n\n` +
    `🔒 **Akses Inti Jiwa & Rezeki:**\n` +
    `Selama hambatan ini belum kamu sadari dengan belajar **${a.advice?.[0] || 'menerima kenyataan tanpa menghakimi'}**, jalan menuju kedamaian batin (**${formatCardName(e, 'Inti Jiwa')}**) serta potensi kelimpahan materi (**${formatCardName(c, 'Puncak Finansial')}**) akan terasa tertutup atau tertahan sementara.`,

  // 🟡 ALUR TRANSISI (Cleaning Phase)
  partialFlow: (e: ArcanaDefinition, c: ArcanaDefinition) =>
    `\n\n---\n\n### 🌗 Status Dinamika Batin: Fase Transisi & Pembersihan\n\n` +
    `Kabar baik! Kamu mulai berhasil mengurai sumbatan di gerbang ujian karakter. Pintu menuju rumah batin sejatimu (**${formatCardName(e, 'Inti Jiwa')}**) kini mulai terbuka.\n\n` +
    `**Dinamika yang Sedang Berlangsung:**\n` +
    `Kamu mulai peka terhadap pola masa lalu dan berusaha memperbaikinya. Karunia alamimu dalam hal **${e.gifts?.slice(0, 2).join(' dan ') || 'intuisi & kesadaran'}** mulai aktif memancar, meski getarannya terkadang masih naik-turun tergantung kedamaian batin harianmu.\n\n` +
    `🔒 **Status Energi Finansial:**\n` +
    `Gerbang menuju **${formatCardName(c, 'Puncak Finansial')}** saat ini berstatus **dalam proses penyesuaian (menunggu kestabilanmu)**. Begitu kamu konsisten menjaga ketenangan batin, potensi rezeki ini akan mengalir lebih deras.\n\n` +
    `💡 **Penyelarasan Diri:**\n` +
    `Fokuskan harimu pada pemulihan kedamaian internal, khususnya mengolah aspek **${e.narrative?.spirituality?.toLowerCase() || 'keheningan batin'}**.`,

  // 🟢 ALUR MENGALIR (Flow State)
  flowToE: (e: ArcanaDefinition) =>
    `\n\n---\n\n### ✨ Status Dinamika Batin: Energi Mengalir Selaras (Flow State)\n\n` +
    `Luar biasa! Kamu telah berhasil melalui ujian karakter dengan keheningan batin yang matang. Energimu kini menembus inti jiwa sejati sebagai pemilik arketipe **${formatCardName(e, 'Inti Jiwa')}** yang autentik.\n\n` +
    `Saat ini, karunia **${e.gifts?.slice(0, 2).join(' dan ') || 'kekuatan batin'}** aktif penuh sebagai magnet pelindung. Kamu merasakan kedamaian yang kokoh karena telah menyelaraskan hidup dengan **${e.narrative?.spirituality?.toLowerCase() || 'kesadaran murni'}**.`,

  eToC: (c: ArcanaDefinition) =>
    `\n\n## 🚀 Phase 4: Kelimpahan Realitas & Misi Jiwa\n\n` +
    `Ketika batinmu berada dalam frekuensi yang tenang dan selaras, rezeki materi akan tertarik secara alami tanpa perlu dikejar dengan stres berlebih. Puncak manifestasi finansial dan karyamu terbuka lebar di jalur: **${c.career?.slice(0, 3).join(', ') || 'pengembangan potensi murni'}**.\n\n` +
    `Kamu dipanggil untuk menjalankan misi membawa manfaat nyata melalui **${c.lifeMission?.[0] || 'kebaikan bagi sesama'}**. Tanamkan afirmasi penguat setiap pagi: *"${c.affirmations?.[0] || 'Saya terbuka menerima segala kelimpahan dan keberkahan semesta.'}"*`,
};

/**
 * Merangkai narasi evolusi secara deterministik & offline.
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
    narrativeOutput += NARRATIVE_BRIDGES.partialFlow(E, C);
  } else {
    narrativeOutput += NARRATIVE_BRIDGES.flowToE(E);
    narrativeOutput += NARRATIVE_BRIDGES.eToC(C);
  }

  return narrativeOutput;
}
