// src/core/destiny-matrix/advanced-analysis.ts

import type { DestinyMatrix } from './types';
import { findKarmicTail, KarmicTailDefinition } from './data/karmic-tails';

export interface ChakraData {
  name: 'Crown' | 'Third Eye' | 'Throat' | 'Heart' | 'Solar Plexus' | 'Sacral' | 'Root';
  physicalValue: number;  // Diambil dari baris material/horizontal tertentu
  energyValue: number;    // Diambil dari baris spiritual/vertikal tertentu
  totalValue: number;     // Hasil penjumlahan mod 22
  status: 'Balanced' | 'Overactive' | 'Blocked';
  description: string;
}

export interface AdvancedAnalysisResult {
  yinYang: {
    yinPercentage: number;
    yangPercentage: number;
    dominant: 'Yin' | 'Yang' | 'Balanced';
    archetype: string;
  };
  karmicTail: KarmicTailDefinition;
  chakras: ChakraData[];
}

// ─── HELPER: HITUNG RASIO YIN-YANG ───────────────────
function calculateYinYang(matrix: DestinyMatrix) {
  const values = Object.values(matrix.points).map(p => p.value);
  const totalPoints = values.length;
  
  if (totalPoints === 0) return { yinPercentage: 50, yangPercentage: 50, dominant: 'Balanced' as const, archetype: 'The Harmonizer' };

  // Angka Ganjil = Yang (Aktif/Maskulin), Angka Genap = Yin (Pasif/Feminin)
  const yangCount = values.filter(v => v % 2 !== 0).length;
  const yinCount = totalPoints - yangCount;

  const yangPercentage = Math.round((yangCount / totalPoints) * 100);
  const yinPercentage = 100 - yangPercentage;

  let dominant: 'Yin' | 'Yang' | 'Balanced' = 'Balanced';
  let archetype = 'The Balanced Harmonizer (Penyeimbang Adaptif)';

  if (yangPercentage > 55) {
    dominant = 'Yang';
    archetype = 'The Dynamic Doer (Inisiator & Pemimpin Aktif)';
  } else if (yinPercentage > 55) {
    dominant = 'Yin';
    archetype = 'The Intuitive Reflector (Pengamat Bijak & Empatis)';
  }

  return { yinPercentage, yangPercentage, dominant, archetype };
}

// ─── HELPER: PENENTU STATUS CHAKRA ───────────────────
function getChakraStatus(total: number, name: string): { status: ChakraData['status']; description: string } {
  // Logika pembacaan sederhana berbasis nilai akhir mod 22
  if ([4, 7, 11, 15, 16].includes(total)) {
    return { status: 'Overactive', description: `Energi ${name} cenderung meluap-luap, perlu grounding agar tidak memicu kecemasan.` };
  } else if ([9, 12, 13, 18, 22].includes(total)) {
    return { status: 'Blocked', description: `Aliran energi di ${name} agak tersumbat. Rentan merasa ragu atau kelelahan emosional.` };
  }
  return { status: 'Balanced', description: `Energi ${name} mengalir dalam ritme yang sehat dan harmonis.` };
}

// ─── UTAMA: HITUNG ADVANCED INSIGHT ──────────────────
export function analyzeAdvancedInsights(matrix: DestinyMatrix): AdvancedAnalysisResult {
  // 1. Hitung Yin-Yang
  const yinYang = calculateYinYang(matrix);

  // 2. Ambil Segitiga Karma (Titik C, C1, C2)
  // Asumsi titik tersimpan di matrix.points dengan key bersangkutan
  const c = matrix.points['C']?.value || 0;
  const c1 = matrix.points['C1']?.value || 0;
  const c2 = matrix.points['C2']?.value || 0;
  const karmicTail = findKarmicTail(c, c1, c2);

  // 3. Pemetaan 7 Chakra (Menggunakan titik representatif dari struktur data Anda)
  // Catatan: Sesuaikan key panggilannya jika struktur koordinat di aplikasi Anda berbeda
  const chakraSpecs: { name: ChakraData['name']; pKey: string; eKey: string }[] = [
    { name: 'Crown', pKey: 'A', eKey: 'B' },        // Contoh titik representasi
    { name: 'Third Eye', pKey: 'A1', eKey: 'B1' },
    { name: 'Throat', pKey: 'A2', eKey: 'B2' },
    { name: 'Heart', pKey: 'E', eKey: 'E1' },       // Pusat jantat/esensi
    { name: 'Solar Plexus', pKey: 'D1', eKey: 'C1' },
    { name: 'Sacral', pKey: 'D2', eKey: 'C2' },
    { name: 'Root', pKey: 'D', eKey: 'C' },         // Dasar/Materialitas vs Karma
  ];

  const chakras: ChakraData[] = chakraSpecs.map(spec => {
    const pVal = matrix.points[spec.pKey]?.value || 0;
    const eVal = matrix.points[spec.eKey]?.value || 0;
    
    // Rumus numerologi Destiny Matrix standar: (P + E) mod 22 (jika 0 maka jadi 22)
    let total = (pVal + eVal) % 22;
    if (total === 0) total = 22;

    const { status, description } = getChakraStatus(total, spec.name);

    return {
      name: spec.name,
      physicalValue: pVal,
      energyValue: eVal,
      totalValue: total,
      status,
      description,
    };
  });

  return {
    yinYang,
    karmicTail,
    chakras,
  };
}
