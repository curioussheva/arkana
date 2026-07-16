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

// ─── Helper: dapatkan elemen dominan ─────────────────
function getDominantElement(matrix: DestinyMatrix): ArcanaDefinition['element'] {
  const counts = countElements(matrix);
  const entries = Object.entries(counts) as [ArcanaDefinition['element'], number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] || 'Fire';
}

// ─── Hitung jumlah nilai ganjil di semua titik ──────
function countOddValues(matrix: DestinyMatrix): number {
  return Object.values(matrix.points).filter(p => p.value % 2 !== 0).length;
}

// ─── Daftar pasangan arcana yang serasi secara tradisional ──
const COMPLEMENTARY_ARCANA: Record<number, number[]> = {
  6: [3, 17],   // The Lovers ↔ Empress, The Star
  3: [6, 19],   // Empress ↔ Lovers, The Sun
  17: [6, 8],   // The Star ↔ Lovers, Strength
  19: [3, 1],   // The Sun ↔ Empress, Magician
  1: [19, 7],   // Magician ↔ Sun, Chariot
  2: [10, 18],  // High Priestess ↔ Wheel, Moon
  8: [11, 14],  // Strength ↔ Justice, Temperance
};

function getArcanaBonus(arcana1: number, arcana2: number): number {
  const complements = COMPLEMENTARY_ARCANA[arcana1];
  if (complements && complements.includes(arcana2)) {
    return 15;
  }
  return 0;
}

// ─── Kalkulasi utama ─────────────────────────────────
export function calculateCompatibility(
  matrix1: DestinyMatrix,
  matrix2: DestinyMatrix
): CompatibilityResult {
  const dom1 = getDominantElement(matrix1);
  const dom2 = getDominantElement(matrix2);
  
  // --- Dimensi 1: Kesamaan arcana di titik inti (A-E) ---
  const coreKeys = ['A', 'B', 'C', 'D', 'E'] as const;
  const sharedCore = coreKeys.filter(key => {
    const p1 = matrix1.points[key];
    const p2 = matrix2.points[key];
    // DIPERBAIKI: Mengubah p1.arcana.card menjadi p1.arcana.tarotName sesuai schema ArcanaDefinition baru
    return p1 && p2 && p1.arcana?.tarotName === p2.arcana?.tarotName;
  });
  const coreScore = sharedCore.length * 15; // max 75

  // --- Dimensi 2: Kesamaan di titik tambahan (F-M) ---
  const secondaryKeys = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'] as const;
  const sharedSecondary = secondaryKeys.filter(key => {
    const p1 = matrix1.points[key];
    const p2 = matrix2.points[key];
    // DIPERBAIKI: Mengubah p1.arcana.card menjadi p1.arcana.tarotName
    return p1 && p2 && p1.arcana?.tarotName === p2.arcana?.tarotName;
  });
  const secondaryScore = sharedSecondary.length * 8; // max 64

  // --- Dimensi 3: Kesamaan di titik ekstensi (N-T, A1-E2) ---
  const extKeys = ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3', 'E1', 'E2'] as const;
  const sharedExt = extKeys.filter(key => {
    const p1 = matrix1.points[key];
    const p2 = matrix2.points[key];
    // DIPERBAIKI: Mengubah p1.arcana.card menjadi p1.arcana.tarotName
    return p1 && p2 && p1.arcana?.tarotName === p2.arcana?.tarotName;
  });
  const extScore = sharedExt.length * 5; // max 105 (tapi biar gak dominan)

  // --- Dimensi 4: Keselarasan elemen ---
  let elementScore = 0;
  let elementDesc = '';
  if (dom1 === dom2) {
    elementScore = 25;
    elementDesc = `Elemen dominan yang sama (${dom1}) menciptakan pemahaman naluriah yang kuat.`;
  } else if (
    (dom1 === 'Fire' && dom2 === 'Air') || (dom1 === 'Air' && dom2 === 'Fire') ||
    (dom1 === 'Water' && dom2 === 'Earth') || (dom1 === 'Earth' && dom2 === 'Water')
  ) {
    elementScore = 15;
    elementDesc = `Elemen ${dom1} dan ${dom2} saling melengkapi secara alami, menyeimbangkan kekuatan satu sama lain.`;
  } else {
    elementScore = 5;
    elementDesc = `Perbedaan elemen (${dom1} vs ${dom2}) bisa menjadi sumber gesekan, tetapi juga pelajaran berharga.`;
  }

  // --- Dimensi 5: Bonus Arcana spesial (titik E) ---
  // DIPERBAIKI: Mengubah .arcana.number menjadi .arcana.id sesuai spesifikasi ArcanaDefinition Anda
  const e1 = matrix1.points.E.arcana.id;
  const e2 = matrix2.points.E.arcana.id;
  const arcanaBonus = getArcanaBonus(e1, e2);
  const arcanaDesc = arcanaBonus > 0 
    ? `Kartu esensi jiwa ${matrix1.points.E.arcana.tarotName} dan ${matrix2.points.E.arcana.tarotName} secara tradisional memiliki ikatan khusus.`
    : '';

  // --- Dimensi 6: Keseimbangan Yin-Yang (ganjil/genap) ---
  const odd1 = countOddValues(matrix1);
  const odd2 = countOddValues(matrix2);
  const balanceScore = Math.abs(odd1 - odd2) < 5 ? 10 : 0; // jika selisih ganjil < 5, dianggap seimbang
  const balanceDesc = balanceScore > 0 
    ? 'Keseimbangan energi yin-yang kalian harmonis, menciptakan ritme yang nyaman.'
    : 'Terdapat perbedaan ritme energi yang cukup mencolok; perlu adaptasi lebih.';

  // --- Hitung total skor ---
  const totalRaw = coreScore + secondaryScore + extScore + elementScore + arcanaBonus + balanceScore;
  const totalScore = Math.min(100, Math.round(totalRaw * 0.7)); // skala kan ke 100

  // --- Tentukan level ---
  let level: CompatibilityResult['level'];
  if (totalScore >= 85) level = 'Sangat Harmonis';
  else if (totalScore >= 70) level = 'Harmonis';
  else if (totalScore >= 50) level = 'Cukup';
  else if (totalScore >= 30) level = 'Tantangan';
  else level = 'Kontras';

  // --- Gabungkan arcana yang sama dari semua titik untuk referensi ---
  const allShared = [...sharedCore, ...sharedSecondary, ...sharedExt]
    .map(key => matrix1.points[key]?.arcana?.tarotName) // DIPERBAIKI: .card menjadi .tarotName
    .filter((card): card is string => !!card);

  // --- Bangun narasi deskriptif ---
  const narrative = buildNarrative(
    level,
    dom1,
    dom2,
    elementDesc,
    sharedCore.length,
    arcanaDesc,
    balanceDesc,
    matrix1.points.E.arcana.tarotName, // DIPERBAIKI: .card menjadi .tarotName
    matrix2.points.E.arcana.tarotName  // DIPERBAIKI: .card menjadi .tarotName
  );

  return {
    totalScore,
    level,
    narrative,
    details: [
      { category: 'Titik Inti (A-E)', score: coreScore, maxScore: 75, description: `${sharedCore.length} dari 5 titik inti memiliki arcana yang sama.` },
      { category: 'Titik Tambahan (F-M)', score: secondaryScore, maxScore: 64, description: `${sharedSecondary.length} dari 8 titik tambahan selaras.` },
      { category: 'Titik Ekstensi (N-T, A1-E2)', score: extScore, maxScore: 105, description: `${sharedExt.length} dari 21 titik ekstensi selaras.` },
      { category: 'Keselarasan Elemen', score: elementScore, maxScore: 25, description: elementDesc },
      { category: 'Bonus Arcana Spesial', score: arcanaBonus, maxScore: 15, description: arcanaDesc || 'Tidak ada bonus arcana khusus.' },
      { category: 'Keseimbangan Yin-Yang', score: balanceScore, maxScore: 10, description: balanceDesc },
    ],
    sharedArcanas: [...new Set(allShared)], // unik
    dominantElements: { person1: dom1, person2: dom2 },
  };
}

// ─── Narasi deskriptif ───────────────────────────────
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
      levelAdvice = 'Hubungan ini hampir tanpa gesekan berarti. Manfaatkan keselarasan ini untuk tumbuh bersama.';
      break;
    case 'Harmonis':
      levelAdvice = 'Hubungan ini nyaman dan saling mendukung. Perbedaan kecil justru memperkaya.';
      break;
    case 'Cukup':
      levelAdvice = 'Ada cukup banyak kesamaan, namun perlu komunikasi untuk menjembatani perbedaan.';
      break;
    case 'Tantangan':
      levelAdvice = 'Hubungan ini penuh pelajaran. Butuh kesabaran dan kemauan untuk memahami sudut pandang berbeda.';
      break;
    case 'Kontras':
      levelAdvice = 'Energi kalian sangat bertolak belakang. Jika dijalani dengan sadar, bisa menjadi transformatif, tapi tidak mudah.';
      break;
  }

  return `${base}${core}${essencePart} ${balanceDesc} ${levelAdvice}`;
}
 