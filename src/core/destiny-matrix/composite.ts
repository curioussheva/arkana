// src/core/destiny-matrix/composite.ts

import type { DestinyMatrix, DestinyPointKey } from './types';
import { getCompositeInterpretation, CompositeRelationDefinition } from './data/composite-meanings';

export interface CompositeMatrixResult {
  compositePoints: Record<string, number>; // Menyimpan seluruh titik hasil (A+B) mod 22
  interpretation: CompositeRelationDefinition;
  overallScore: number;
}

// Helper: Rumus dasar Penjumlahan Modulo 22 Destiny Matrix
function addDestinyPoints(val1: number, val2: number): number {
  let res = (val1 + val2) % 22;
  return res === 0 ? 22 : res;
}

export function calculateCompositeMatrix(matrix1: DestinyMatrix, matrix2: DestinyMatrix): CompositeMatrixResult {
  const compositePoints: Record<string, number> = {};
  
  // 1. Ambil seluruh key koordinat yang tersedia (A, B, C, D, E, dst)
  const allKeys = Object.keys(matrix1.points) as DestinyPointKey[];

  allKeys.forEach((key) => {
    const p1 = matrix1.points[key]?.value || 0;
    const p2 = matrix2.points[key]?.value || 0;
    
    // Gabungkan dengan rumus khusus
    compositePoints[key] = addDestinyPoints(p1, p2);
  });

  // 2. Ekstrak nilai titik pusat E Komposit sebagai inti takdir hubungan
  const centerCompositeValue = compositePoints['E'] || 22;
  const interpretation = getCompositeInterpretation(centerCompositeValue);

  // 3. Kalkulasi Skor Kecocokan Komposit Sederhana berdasarkan kecocokan elemen & harmoni titik pusat
  // Anda bisa menyesuaikan algoritma ini dengan logic bisnis Anda sendiri
  let baseScore = 70; 
  if (matrix1.points['E']?.value === matrix2.points['E']?.value) baseScore += 20; // Soulmate indicator
  if ([3, 6, 10, 17, 19, 21].includes(centerCompositeValue)) baseScore += 10;   // Arketipe harmoni asmara
  if ([13, 15, 16, 22].includes(centerCompositeValue)) baseScore -= 10;          // Arketipe transformasi/gesekan tinggi

  const overallScore = Math.min(Math.max(baseScore, 30), 100); // Batasi skor minimal 30%, maksimal 100%

  return {
    compositePoints,
    interpretation,
    overallScore,
  };
}
