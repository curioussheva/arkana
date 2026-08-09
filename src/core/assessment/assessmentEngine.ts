// Berkas: src/core/assessment/assessmentEngine.ts

import type { ArcanaDefinition } from '../arcana/types';

export type AssessmentState = 'NEGATIF' | 'NETRAL' | 'POSITIF';

export interface AssessmentOption {
  text: string;
  score: AssessmentState;
}

export interface DynamicAssessment {
  cardId: number;
  tarotName: string;
  questionTitle: string;
  options: AssessmentOption[];
}

/**
 * Membentuk opsi pertanyaan refleksi psikologis secara deterministik
 * dengan konteks batin yang lebih dekat dengan kenyataan emosional pengguna.
 */
export function generateAssessmentForTitikE(arcanaE: ArcanaDefinition): DynamicAssessment {
  // Safe extraction dengan fallback ramah pengguna
  const shadow = arcanaE.shadowTraits?.[0] || 'kehilangan kendali batin';
  const fear = arcanaE.fears?.[0] || 'ketidakpastian masa depan';
  const trait = arcanaE.positiveTraits?.[0] || 'percaya pada proses';
  const gift = arcanaE.gifts?.[0] || 'potensi terbaik diri';

  const energyName = arcanaE.matrixName || arcanaE.tarotName || 'Inti Jiwa';
  const archetype = arcanaE.archetype ? ` (${arcanaE.archetype})` : '';

  return {
    cardId: arcanaE.id === 0 ? 22 : arcanaE.id,
    tarotName: arcanaE.tarotName,

    // Pertanyaan difokuskan pada refleksi langsung
    questionTitle: `Jujur pada dirimu, bagaimana relasi batinmu saat ini saat berhadapan dengan cermin energi "${energyName}"${archetype}?`,

    options: [
      {
        // 🔴 NEGATIF: Gejala Kebuntuan & Reaksi Defensif
        text: `Saya merasa buntu dan lelah. Sering kali saya terjebak dalam rasa ${shadow.toLowerCase()} akibat dorongan pemicu takut akan ${fear.toLowerCase()}.`,
        score: 'NEGATIF',
      },
      {
        // 🟡 NETRAL: Kesadaran Transisi & Proses Penyelarasan
        text: `Saya menyadari potensi besar di dalam diri, namun masih berada di persimpangan jalan—mulai memahami polanya, tetapi belum sepenuhnya konsisten melangkah.`,
        score: 'NETRAL',
      },
      {
        // 🟢 POSITIF: Keberdayaan & Aliran Kesadaran Utuh
        text: `Saya merasa selaras dan tenang. Energi saya mengalir ${trait.toLowerCase()}, dan saya mampu memanfaatkan karunia ${gift.toLowerCase()} ini untuk hal-hal produktif.`,
        score: 'POSITIF',
      },
    ],
  };
}
