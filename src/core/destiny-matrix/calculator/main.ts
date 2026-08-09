import { reduceToArcana } from '../utils';
import { buildPoint } from '../builders';
import { calculateBridgePoints } from './bridge';
import { calculateMacroPoints } from './macro';
import { calculateDestinyLevels } from './destiny';
import type { DestinyMatrixPoints, DestinyPointKey, DestinyPoint } from '../types';
import type {
  MainPoints,
  InnerBridgePoints,
  ChannelPoints,
  CompanionPoints,
  TimelinePoints,
} from './types';
import { calculateSvadhisthana, calculateGreenZone } from './shared-formulas';

export function calculate37PointsMatrix(
  day: number,
  month: number,
  year: number
): DestinyMatrixPoints {
  // 1. Main Points (Kotak Diagonal / Personal)
  const A = reduceToArcana(day);
  const B = reduceToArcana(month);
  const yearSum = String(year)
    .split('')
    .reduce((acc, curr) => acc + parseInt(curr, 10), 0);
  const C = reduceToArcana(yearSum);
  const D = reduceToArcana(A + B + C);
  const E = reduceToArcana(A + B + C + D); // Pusat Utama / Comfort Zone

  const main: MainPoints = { A, B, C, D, E };

  // 2. Bridge Points (Sudut Silsilah & Inner Cross Vertikal)
  const bridge = calculateBridgePoints(main);
  const { F, G, H, I } = bridge; // 🛠️ Destruktur F, G, H, I dari bridge agar bisa dipanggil langsung!

  const greenZone = calculateGreenZone(bridge, main);

  // 3. Inner Bridge Points (A1, B1, C1, D1, F1, G1, H1, I1)
  const A1 = bridge.J;
  const B1 = bridge.K;
  const C1 = bridge.L;
  const D1 = bridge.M;

  const F1 = reduceToArcana(A1 + B1); // = reduce(J+K)
  const G1 = reduceToArcana(B1 + C1); // = reduce(K+L)
  const H1 = reduceToArcana(C1 + D1); // = reduce(L+M)
  const I1 = reduceToArcana(D1 + A1); // = reduce(M+J)

  const innerBridge: InnerBridgePoints = { A1, B1, C1, D1, F1, G1, H1, I1 };

  // 4. Saluran Rezeki & Cinta (Love & Money Channels - Kuadran 4)
  const LM_Center = reduceToArcana(C1 + D1);
  const Money = reduceToArcana(C1 + LM_Center);
  const Love = reduceToArcana(D1 + LM_Center);

  // SESUDAH — LM_Center=N, Money=P, Love=O (sudah tervalidasi terhadap diagram referensi)
  // 1. Hitung macro DULU
  const macro = calculateMacroPoints(main, bridge); // (sudah tanpa argumen ke-3 sesuai fix sebelumnya)

  // 2. BARU bangun channel dari macro
  const channel: ChannelPoints = {
    LM_Center: macro.N,
    Money: macro.P,
    Love: macro.O,
    N: macro.N,
    O: macro.O,
    P: macro.P,
  };

  // 6. Companion Points / Sub-Nodes
  const companion: CompanionPoints = {
    SubA: macro.Q,
    SubB: macro.R,
    SubC: macro.S,
    SubD: macro.T,
    SubF: reduceToArcana(F + F1),
    SubG: reduceToArcana(G + G1),
    SubH: reduceToArcana(H + H1),
    SubI: reduceToArcana(I + I1),
    Q: macro.Q,
    R: macro.R,
    S: macro.S,
    T: macro.T,
  };

  // 7. Timeline Points (Peta Umur Lingkaran Luar)
  // 7. Timeline Points (Peta Umur Lingkaran Luar Lengkap)
  const T20 = bridge.F; // 20
  const T10 = reduceToArcana(A + T20); // 12 + 20 = 32 -> 5
  const T15 = reduceToArcana(T10 + T20); // 5 + 20 = 25 -> 7

  const T30 = bridge.G; // 11
  const T25 = reduceToArcana(B + T30); // 8 + 11 = 19

  const T40 = bridge.H; // 8
  const T35 = reduceToArcana(C + T40); // 21 + 8 = 29 -> 11

  const T60 = bridge.I; // 17
  const T50 = reduceToArcana(D + T60); // 5 + 17 = 22
  const T45 = reduceToArcana(T40 + T50); // 8 + 22 = 30 -> 3
  const T55 = reduceToArcana(T50 + T60); // 22 + 17 = 39 -> 12

  const T70 = reduceToArcana(T60 + D); // 17 + 5 = 22
  const T65 = reduceToArcana(T60 + T70); // 17 + 22 = 39 -> 12
  const T75 = reduceToArcana(T60 + A); // 17 + 12 = 29 -> 11

  const timeline: TimelinePoints = {
    T10,
    T15,
    T20,
    T25,
    T30,
    T35,
    T40,
    T45,
    T50,
    T55,
    T60,
    T65,
    T70,
    T75,
  };

  // 8. 8 Level Takdir & 3 Pusat Kekuatan
  const destinyLevels = calculateDestinyLevels(main, bridge);

  // Pemetakan akhir ke Record objek DestinyMatrixPoints
  const rawMap: Record<string, { val: number; cat: DestinyPoint['category'] }> = {
    // Main
    A: { val: A, cat: 'main' },
    B: { val: B, cat: 'main' },
    C: { val: C, cat: 'main' },
    D: { val: D, cat: 'main' },
    E: { val: E, cat: 'main' },

    // Bridge (Ancestral & Inner)
    F: { val: bridge.F, cat: 'ancestral' },
    G: { val: bridge.G, cat: 'ancestral' },
    H: { val: bridge.H, cat: 'ancestral' },
    I: { val: bridge.I, cat: 'ancestral' },

    J: { val: bridge.J, cat: 'inner' },
    K: { val: bridge.K, cat: 'inner' },
    L: { val: bridge.L, cat: 'inner' },
    M: { val: bridge.M, cat: 'inner' },

    // Macro
    N: { val: macro.N, cat: 'channel' },
    O: { val: macro.O, cat: 'channel' },
    P: { val: macro.P, cat: 'channel' },

    Q: { val: macro.Q, cat: 'companion' },
    R: { val: macro.R, cat: 'companion' },
    S: { val: macro.S, cat: 'companion' },
    T: { val: macro.T, cat: 'companion' },

    // Inner Bridges & Sub-Nodes
    A1: { val: innerBridge.A1, cat: 'inner' },
    B1: { val: innerBridge.B1, cat: 'inner' },
    C1: { val: innerBridge.C1, cat: 'inner' },
    D1: { val: innerBridge.D1, cat: 'inner' },
    F1: { val: innerBridge.F1, cat: 'inner' },
    G1: { val: innerBridge.G1, cat: 'inner' },
    H1: { val: innerBridge.H1, cat: 'inner' },
    I1: { val: innerBridge.I1, cat: 'inner' },

    LM_Center: { val: channel.LM_Center, cat: 'channel' },
    Money: { val: channel.Money, cat: 'channel' },
    Love: { val: channel.Love, cat: 'channel' },

    SubA: { val: companion.SubA, cat: 'companion' },
    SubB: { val: companion.SubB, cat: 'companion' },
    SubC: { val: companion.SubC, cat: 'companion' },
    SubD: { val: companion.SubD, cat: 'companion' },
    SubF: { val: companion.SubF, cat: 'companion' },
    SubG: { val: companion.SubG, cat: 'companion' },
    SubH: { val: companion.SubH, cat: 'companion' },
    SubI: { val: companion.SubI, cat: 'companion' },

    // Timeline
    T10: { val: timeline.T10, cat: 'timeline' },
    T15: { val: timeline.T15, cat: 'timeline' },
    T20: { val: timeline.T20, cat: 'timeline' },
    T25: { val: timeline.T25, cat: 'timeline' },
    T30: { val: timeline.T30, cat: 'timeline' },
    T35: { val: timeline.T35, cat: 'timeline' },
    T40: { val: timeline.T40, cat: 'timeline' },
    T45: { val: timeline.T45, cat: 'timeline' },
    T50: { val: timeline.T50, cat: 'timeline' },
    T55: { val: timeline.T55, cat: 'timeline' },
    T60: { val: timeline.T60, cat: 'timeline' },
    T65: { val: timeline.T65, cat: 'timeline' },
    T70: { val: timeline.T70, cat: 'timeline' },
    T75: { val: timeline.T75, cat: 'timeline' },

    // Level Takdir & Pusat Kekuatan (Ladini standard)
    Heaven: { val: destinyLevels.heaven, cat: 'inner' },
    Earth: { val: destinyLevels.earth, cat: 'inner' },
    PersonalDestiny: { val: destinyLevels.personal, cat: 'inner' },
    FatherLine: { val: destinyLevels.fatherLine, cat: 'ancestral' },
    MotherLine: { val: destinyLevels.motherLine, cat: 'ancestral' },
    SocialDestiny: { val: destinyLevels.social, cat: 'ancestral' },
    SpiritualDestiny: { val: destinyLevels.spiritual, cat: 'inner' },
    GlobalMission: { val: destinyLevels.globalMission, cat: 'inner' },
    PersonalCenter: { val: destinyLevels.personalCenter, cat: 'main' },
    FamilyCenter: { val: destinyLevels.familyCenter, cat: 'ancestral' },
    UnifiedCenter: { val: destinyLevels.unifiedCenter, cat: 'main' },
    HeartDesirePhysical: { val: greenZone.physical, cat: 'inner' },
    HeartDesireSpiritual: { val: greenZone.spiritual, cat: 'inner' },
  };

  const points = {} as DestinyMatrixPoints;
  Object.keys(rawMap).forEach(k => {
    const entry = rawMap[k];
    if (entry !== undefined) {
      (points as any)[k] = buildPoint(k as DestinyPointKey, entry.val);
    }
  });

  return points;
}
