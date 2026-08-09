// Berkas: src/core/destiny-matrix/compatibility.ts

import type { DestinyMatrix } from './types';
import type { ArcanaDefinition } from '../arcana/types';
import { countElements } from './insight';

export interface CompatibilityDetail {
  category: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface CompatibilityResult {
  totalScore: number;
  level: 'Sangat Harmonis' | 'Harmonis' | 'Cukup' | 'Tantangan' | 'Kontras';
  narrative: string;
  details: CompatibilityDetail[];
  sharedArcanas: string[];
  dominantElements: {
    person1: ArcanaDefinition['element'];
    person2: ArcanaDefinition['element'];
  };
}

// ─── Helper: Dapatkan elemen dominan ─────────────────
function getDominantElement(matrix: DestinyMatrix): ArcanaDefinition['element'] {
  const counts = countElements(matrix);
  const entries = Object.entries(counts) as [ArcanaDefinition['element'], number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] || 'Fire';
}

// ─── Hitung jumlah nilai ganjil di 20 titik core ──────
function countOddValues(matrix: DestinyMatrix): number {
  const valid20 = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
  ];
  return valid20.filter(key => {
    const val = matrix.points[key as keyof typeof matrix.points]?.value ?? 0;
    return val % 2 !== 0;
  }).length;
}

// ─── Daftar pasangan arcana yang serasi ──
const COMPLEMENTARY_ARCANA: Record<number, number[]> = {
  6: [3, 17], // The Lovers ↔ Empress, The Star
  3: [6, 19], // Empress ↔ Lovers, The Sun
  17: [6, 8], // The Star ↔ Lovers, Strength
  19: [3, 1], // The Sun ↔ Empress, Magician
  1: [19, 7], // Magician ↔ Sun, Chariot
  2: [10, 18], // High Priestess ↔ Wheel, Moon
  8: [11, 14], // Strength ↔ Justice, Temperance
};

function getArcanaBonus(arcana1: number, arcana2: number): number {
  const complements = COMPLEMENTARY_ARCANA[arcana1];
  if (complements && complements.includes(arcana2)) {
    return 15;
  }
  return 0;
}

// ─── Kalkulasi utama (Murni 20 Titik Core A-T) ─────────────────────────────────
export function calculateCompatibility(
  matrix1: DestinyMatrix,
  matrix2: DestinyMatrix
): CompatibilityResult {
  const dom1 = getDominantElement(matrix1);
  const dom2 = getDominantElement(matrix2);

  // --- Dimensi 1: Kesamaan arcana di Titik Inti Utama (A-E) ---
  const coreKeys = ['A', 'B', 'C', 'D', 'E'] as const;
  const sharedCore = coreKeys.filter(key => {
    const p1 = matrix1.points[key];
    const p2 = matrix2.points[key];
    const id1 = p1?.arcana?.id ?? p1?.value;
    const id2 = p2?.arcana?.id ?? p2?.value;
    return id1 !== undefined && id1 === id2;
  });
  const coreScore = sharedCore.length * 15; // max 75

  // --- Dimensi 2: Kesamaan di Titik Tambahan (F-M) ---
  const secondaryKeys = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'] as const;
  const sharedSecondary = secondaryKeys.filter(key => {
    const p1 = matrix1.points[key];
    const p2 = matrix2.points[key];
    const id1 = p1?.arcana?.id ?? p1?.value;
    const id2 = p2?.arcana?.id ?? p2?.value;
    return id1 !== undefined && id1 === id2;
  });
  const secondaryScore = sharedSecondary.length * 8; // max 64

  // --- Dimensi 3: Kesamaan di Titik Ekstensi Core (N-T) 🎯 HANYA N sampai T ---
  const extKeys = ['N', 'O', 'P', 'Q', 'R', 'S', 'T'] as const;
  const sharedExt = extKeys.filter(key => {
    const p1 = matrix1.points[key as keyof typeof matrix1.points];
    const p2 = matrix2.points[key as keyof typeof matrix2.points];
    const id1 = p1?.arcana?.id ?? p1?.value;
    const id2 = p2?.arcana?.id ?? p2?.value;
    return id1 !== undefined && id1 === id2;
  });
  const extScore = sharedExt.length * 5; // max 35

  // --- Dimensi 4: Keselarasan elemen ---
  let elementScore = 0;
  let elementDesc = '';
  if (dom1 === dom2) {
    elementScore = 25;
    elementDesc = `Elemen dominan yang sama (${dom1}) menciptakan pemahaman naluriah yang kuat.`;
  } else if (
    (dom1 === 'Fire' && dom2 === 'Air') ||
    (dom1 === 'Air' && dom2 === 'Fire') ||
    (dom1 === 'Water' && dom2 === 'Earth') ||
    (dom1 === 'Earth' && dom2 === 'Water')
  ) {
    elementScore = 15;
    elementDesc = `Elemen ${dom1} dan ${dom2} saling melengkapi secara alami, menyeimbangkan kekuatan satu sama lain.`;
  } else {
    elementScore = 5;
    elementDesc = `Perbedaan elemen (${dom1} vs ${dom2}) bisa menjadi sumber gesekan, tetapi juga pelajaran berharga.`;
  }

  // --- Dimensi 5: Bonus Arcana khusus (titik E) ---
  const e1Raw = matrix1.points.E?.arcana?.id ?? matrix1.points.E?.value ?? 0;
  const e2Raw = matrix2.points.E?.arcana?.id ?? matrix2.points.E?.value ?? 0;
  const e1 = e1Raw === 0 ? 22 : e1Raw;
  const e2 = e2Raw === 0 ? 22 : e2Raw;

  const arcanaBonus = getArcanaBonus(e1, e2);
  const cardName1 = matrix1.points.E?.arcana?.tarotName || `Arcana #${e1}`;
  const cardName2 = matrix2.points.E?.arcana?.tarotName || `Arcana #${e2}`;

  const arcanaDesc =
    arcanaBonus > 0
      ? `Kartu esensi jiwa ${cardName1} dan ${cardName2} secara tradisional memiliki ikatan khusus.`
      : '';

  // --- Dimensi 6: Keseimbangan Yin-Yang (ganjil/genap) ---
  const odd1 = countOddValues(matrix1);
  const odd2 = countOddValues(matrix2);
  const balanceScore = Math.abs(odd1 - odd2) < 4 ? 10 : 0;
  const balanceDesc =
    balanceScore > 0
      ? 'Keseimbangan energi yin-yang kalian harmonis, menciptakan ritme yang nyaman.'
      : 'Terdapat perbedaan ritme energi yang cukup mencolok; perlu adaptasi lebih.';

  // --- Hitung total skor (Disesuaikan dengan bobot 20 titik core) ---
  const totalRaw =
    coreScore + secondaryScore + extScore + elementScore + arcanaBonus + balanceScore;
  const totalScore = Math.min(100, Math.round((totalRaw / 224) * 100)); // Pembagi tepat disesuaikan dengan bobot max 20 titik

  // --- Tentukan level ---
  let level: CompatibilityResult['level'];
  if (totalScore >= 80) level = 'Sangat Harmonis';
  else if (totalScore >= 65) level = 'Harmonis';
  else if (totalScore >= 45) level = 'Cukup';
  else if (totalScore >= 30) level = 'Tantangan';
  else level = 'Kontras';

  // --- Gabungkan nama arcana yang sama dari titik core untuk chip display ---
  const allSharedKeys = [...sharedCore, ...sharedSecondary, ...sharedExt];
  const allSharedNames = allSharedKeys
    .map(key => {
      const pt = matrix1.points[key as keyof typeof matrix1.points];
      return pt?.arcana?.tarotName || pt?.arcana?.matrixName || `Arcana #${pt?.value}`;
    })
    .filter((card): card is string => !!card);

  // --- Bangun narasi ---
  const narrative = buildNarrative(
    level,
    dom1,
    dom2,
    elementDesc,
    sharedCore.length,
    arcanaDesc,
    balanceDesc,
    cardName1,
    cardName2
  );

  return {
    totalScore,
    level,
    narrative,
    details: [
      {
        category: 'Titik Inti (A-E)',
        score: coreScore,
        maxScore: 75,
        description: `${sharedCore.length} dari 5 titik inti memiliki arcana yang sama.`,
      },
      {
        category: 'Titik Tambahan (F-M)',
        score: secondaryScore,
        maxScore: 64,
        description: `${sharedSecondary.length} dari 8 titik tambahan selaras.`,
      },
      {
        category: 'Titik Ekstensi (N-T)',
        score: extScore,
        maxScore: 35,
        description: `${sharedExt.length} dari 7 titik ekstensi selaras.`,
      },
      {
        category: 'Keselarasan Elemen',
        score: elementScore,
        maxScore: 25,
        description: elementDesc,
      },
      {
        category: 'Bonus Arcana Spesial',
        score: arcanaBonus,
        maxScore: 15,
        description: arcanaDesc || 'Tidak ada bonus arcana khusus.',
      },
      {
        category: 'Keseimbangan Yin-Yang',
        score: balanceScore,
        maxScore: 10,
        description: balanceDesc,
      },
    ],
    sharedArcanas: [...new Set(allSharedNames)],
    dominantElements: { person1: dom1, person2: dom2 },
  };
}

function buildNarrative(
  level: string,
  dom1: string,
  dom2: string,
  elementDesc: string,
  coreCount: number,
  arcanaDesc: string,
  balanceDesc: string,
  essence1: string,
  essence2: string
): string {
  const base = `${elementDesc} `;
  let core = '';
  if (coreCount >= 3) {
    core = `Kalian memiliki ${coreCount} titik inti yang sama, menandakan fondasi hubungan yang kokoh dan saling memahami secara mendalam. `;
  } else if (coreCount >= 1) {
    core = `Terdapat ${coreCount} titik inti yang sama, cukup untuk menciptakan benang merah dalam hubungan. `;
  } else {
    core = `Tidak ada titik inti yang sama; kalian datang dari cetakan energi yang berbeda, namun bisa saling melengkapi. `;
  }

  const essencePart = `Esensi jiwa kalian (${essence1} dan ${essence2}) ${arcanaDesc ? 'memiliki ikatan khusus. ' : 'membawa getaran yang unik masing-masing.'}`;

  let levelAdvice = '';
  switch (level) {
    case 'Sangat Harmonis':
      levelAdvice =
        'Hubungan ini hampir tanpa gesekan berarti. Manfaatkan keselarasan ini untuk tumbuh bersama.';
      break;
    case 'Harmonis':
      levelAdvice = 'Hubungan ini nyaman dan saling mendukung. Perbedaan kecil justru memperkaya.';
      break;
    case 'Cukup':
      levelAdvice =
        'Ada cukup banyak kesamaan, namun perlu komunikasi untuk menjembatani perbedaan.';
      break;
    case 'Tantangan':
      levelAdvice =
        'Hubungan ini penuh pelajaran. Butuh kesabaran dan kemauan untuk memahami sudut pandang berbeda.';
      break;
    case 'Kontras':
      levelAdvice =
        'Energi kalian sangat bertolak belakang. Jika dijalani dengan sadar, bisa menjadi transformatif, tapi tidak mudah.';
      break;
  }

  return `${base}${core}${essencePart} ${balanceDesc} ${levelAdvice}`;
}
