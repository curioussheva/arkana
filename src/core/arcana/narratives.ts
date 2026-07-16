// src/core/arcana/narratives.ts

import type { ArcanaDefinition, ArcanaNarrative } from "./types";

function join(values: string[], max = 3): string {
  return values.slice(0, max).join(", ");
}

export function createNarrative(
  arcana: ArcanaDefinition,
): ArcanaNarrative {
  return {
    overview:
      `${arcana.tarotName} (${arcana.matrixName}) melambangkan energi ${join(
        arcana.keywords,
      )}. Energi ini mengajak Anda mengenali potensi terbaik dalam diri sekaligus bertumbuh melalui setiap pengalaman hidup.`,

    personality:
      `Kekuatan utama Anda terlihat pada sifat ${join(
        arcana.positiveTraits,
      )}. Karakter ini membantu Anda menghadapi tantangan dan menjadi inspirasi bagi lingkungan sekitar.`,

    potential:
      `Bakat alami Anda berada pada bidang ${join(
        arcana.talents,
      )}. Jika dikembangkan secara konsisten, potensi ini dapat membawa keberhasilan yang stabil dan bermakna.`,

    challenge:
      `Hal yang perlu diperhatikan adalah kecenderungan ${join(
        arcana.shadowTraits,
      )}. Mengenali sisi bayangan bukan untuk disalahkan, melainkan sebagai kesempatan untuk bertumbuh menjadi pribadi yang lebih utuh.`,

    career:
      `Energi ini sangat mendukung pekerjaan seperti ${join(
        arcana.career,
      )}. Pilihlah bidang yang memberi ruang untuk mengekspresikan kemampuan terbaik Anda.`,

    finance:
  arcana.finance.length
    ? `${arcana.finance.join('. ')}.`
    : 'Kelola keuangan dengan disiplin dan perencanaan yang matang.',

    relationship:
      `Dalam hubungan, Anda cenderung ${join(
        arcana.relationship,
      )}. Hubungan yang sehat akan tumbuh ketika komunikasi dan saling menghargai menjadi prioritas.`,

    health:
      `Perhatikan terutama ${join(
        arcana.health,
      )}. Menjaga keseimbangan tubuh, pikiran, dan emosi akan membantu energi ini bekerja secara optimal.`,

    spirituality:
      `${arcana.spiritualLessons.join(
        ". ",
      )}. Pelajaran ini menjadi bagian penting dari perjalanan jiwa Anda.`,

    affirmation:
      arcana.affirmations[0] ??
      "Saya bertumbuh menjadi versi terbaik diri saya setiap hari.",
      
    advice:
  `Gunakan energi ${arcana.tarotName} dengan bijaksana. Kembangkan kekuatan Anda, hadapi sisi bayangan dengan kesadaran, dan jadikan setiap pengalaman sebagai sarana pertumbuhan.`,
  };
}

export function createShortNarrative(
  arcana: ArcanaDefinition,
): string {
  return `${arcana.tarotName} membawa energi ${join(
    arcana.keywords,
  )}. Potensi terbesarnya terletak pada ${join(
    arcana.positiveTraits,
  )}, sementara pelajaran utamanya adalah belajar mengelola ${join(
    arcana.shadowTraits,
  )}.`;
}

export function createDailyMessage(
  arcana: ArcanaDefinition,
): string {
  return `Hari ini Anda didorong untuk memanfaatkan kualitas ${join(
    arcana.positiveTraits,
    2,
  )}. Hindari kecenderungan ${join(
    arcana.shadowTraits,
    2,
  )}, dan ingatlah bahwa setiap pengalaman membawa pelajaran berharga.`;
}

export function createSpiritualMessage(
  arcana: ArcanaDefinition,
): string {
  return arcana.spiritualLessons.join(". ") + ".";
}

export function createCareerMessage(
  arcana: ArcanaDefinition,
): string {
  return `Karier berkembang ketika Anda memanfaatkan kemampuan dalam ${join(
    arcana.talents,
  )}. Bidang seperti ${join(
    arcana.career,
  )} sangat selaras dengan energi Arcana ini.`;
}

export function createRelationshipMessage(
  arcana: ArcanaDefinition,
): string {
  return `Dalam hubungan, energi ini menunjukkan kecenderungan ${join(
    arcana.relationship,
  )}. Hubungan yang harmonis tercipta melalui komunikasi yang jujur, rasa saling percaya, dan kedewasaan emosional.`;
}