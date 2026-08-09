import { reduceToArcana } from '../utils';
import type { MainPoints, BridgePoints, DestinyLevels } from './types';

export function calculateDestinyLevels(main: MainPoints, bridge: BridgePoints): DestinyLevels {
  const { A, B, C, D, E } = main;
  const { F, G, H, I } = bridge;

  // 1. Takdir Langit (Level 1) = B + D
  const heaven = reduceToArcana(B + D);

  // 2. Takdir Bumi (Level 2) = A + C
  const earth = reduceToArcana(A + C);

  // 3. Takdir Personal Integral (Level 3) = Heaven + Earth
  const personal = reduceToArcana(heaven + earth);

  // 4. Garis Ayah (Level 4) = F + H
  const fatherLine = reduceToArcana(F + H);

  // 5. Garis Ibu (Level 5) = G + I
  const motherLine = reduceToArcana(G + I);

  // 6. Takdir Sosial / Rekonsiliasi Keluarga (Level 6) = Father + Mother
  const social = reduceToArcana(fatherLine + motherLine);

  // 7. Takdir Ilahi Pribadi (Level 7) = Personal + Social
  const spiritual = reduceToArcana(personal + social);

  // 8. Misi Ilahi Global (Level 8) = Social + Spiritual
  const globalMission = reduceToArcana(social + spiritual);

  // 3 Pusat Kekuatan (Centers of Power)
  const personalCenter = E; // Center Pribadi (E)
  const familyCenter = reduceToArcana(F + G + H + I); // Center Keluarga (F+G+H+I)
  const unifiedCenter = reduceToArcana(personalCenter + familyCenter); // Center Gabungan

  return {
    heaven,
    earth,
    personal,
    fatherLine,
    motherLine,
    social,
    spiritual,
    globalMission,
    personalCenter,
    familyCenter,
    unifiedCenter,
  };
}
