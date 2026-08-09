import { reduceToArcana } from '../utils';
import type { MainPoints, BridgePoints } from './types';

export function calculateBridgePoints(main: MainPoints): BridgePoints {
  const { A, B, C, D, E } = main;

  // 1. 4 Sudut Persegi Leluhur (Ancestral Square)
  const F = reduceToArcana(A + B); // Kiri-Atas (Ancestral Ayah Spiritual)
  const G = reduceToArcana(B + C); // Kanan-Atas (Ancestral Ibu Spiritual)
  const H = reduceToArcana(C + D); // Kanan-Bawah (Ancestral Ayah Material)
  const I = reduceToArcana(D + A); // Kiri-Bawah (Ancestral Ibu Material)

  // 2. 4 Titik Inner Cross (Jembatan Aksis Utama ke Pusat E)
  const J = reduceToArcana(A + E); // Inner Kiri   (Karakter A + Center E)  --> Dipeta ke A1
  const K = reduceToArcana(B + E); // Inner Atas   (Spiritual B + Center E) --> Dipeta ke B1
  const L = reduceToArcana(C + E); // Inner Kanan  (Materi C + Center E)    --> Dipeta ke C1
  const M = reduceToArcana(D + E); // Inner Bawah  (Karma D + Center E)     --> Dipeta ke D1

  return { F, G, H, I, J, K, L, M };
}
