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
 * dengan bahasa yang lebih membumi, mengalir, dan berfokus pada gejala emosional nyata.
 */
export function generateAssessmentForTitikE(arcanaE: ArcanaDefinition): DynamicAssessment {
  // 1. Ekstraksi data mentah dengan fallback yang aman
  const shadow = arcanaE.shadowTraits?.[0] || 'kehilangan arah';
  const fear = arcanaE.fears?.[0] || 'situasi yang tidak pasti';
  const trait = arcanaE.positiveTraits?.[0] || 'percaya diri';
  const gift = arcanaE.gifts?.[0] || 'potensi terbaik diri';
  
  // Ambil karakter utama arkana untuk dijadikan subjek kalimat yang ramah
  const energyName = arcanaE.matrixName || arcanaE.tarotName;
  const archetype = arcanaE.archetype ? ` si ${arcanaE.archetype}` : '';

  return {
    cardId: arcanaE.id,
    tarotName: arcanaE.tarotName,
    
    // 🔮 Pertanyaan dibuat lebih personal & tidak terlalu teoretis
    questionTitle: `Jujur pada dirimu sendiri, bagaimana kondisi batinmu saat ini ketika menghadapi energi "${energyName}"${archetype} dalam keseharian?`,
    
    options: [
      {
        // 🔴 NEGATIF: Fokus pada "Gejala Frustrasi & Stuck" (Shadow & Fear)
        text: `Jujur, saya sedang merasa stuck. Saya sering terjebak dalam kondisi ${shadow.toLowerCase()} dan dipicu oleh rasa takut akan ${fear.toLowerCase()}.`,
        score: 'NEGATIF',
      },
      {
        // 🟡 NETRAL: Fokus pada "Kesadaran Tanpa Aksi / Bingung Arah" (Fase Transisi)
        text: `Saya tahu ada potensi besar di dalam diri saya, tapi saat ini saya masih merasa di persimpangan jalan—mulai paham polanya, tapi masih bingung menentukan langkah nyata.`,
        score: 'NETRAL',
      },
      {
        // 🟢 POSITIF: Fokus pada "Keberdayaan & Sinkronisitas" (Trait & Gift)
        text: `Saya merasa sangat nyaman menjadi diri sendiri. Energi saya mengalir ${trait.toLowerCase()}, dan saya bisa mengarahkan karunia ${gift.toLowerCase()} ini untuk menciptakan peluang nyata.`,
        score: 'POSITIF',
      },
    ],
  };
}
 