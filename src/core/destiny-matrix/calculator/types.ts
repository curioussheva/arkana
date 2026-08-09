export interface MainPoints {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
}

export interface BridgePoints {
  F: number;
  G: number;
  H: number;
  I: number;
  J: number;
  K: number;
  L: number;
  M: number;
}

export interface MacroPoints {
  N: number;
  O: number;
  P: number;
  Q: number;
  R: number;
  S: number;
  T: number;
}

export interface InnerBridgePoints {
  A1: number;
  B1: number;
  C1: number;
  D1: number;
  F1: number;
  G1: number;
  H1: number;
  I1: number;
}

export interface ChannelPoints {
  LM_Center: number;
  Money: number;
  Love: number;
  N: number;
  O: number;
  P: number;
}

export interface CompanionPoints {
  SubA: number;
  SubB: number;
  SubC: number;
  SubD: number;
  SubF: number;
  SubG: number;
  SubH: number;
  SubI: number;
  Q: number;
  R: number;
  S: number;
  T: number;
}

export interface TimelinePoints {
  T10: number;
  T15: number; // 💡 Tambahkan ini
  T20: number;
  T25: number;
  T30: number;
  T35: number;
  T40: number;
  T45: number; // 💡 Tambahkan ini
  T50: number;
  T55: number; // 💡 Tambahkan ini
  T60: number;
  T65: number; // 💡 Tambahkan ini
  T70: number; // 💡 Tambahkan ini
  T75: number;
}

export interface ChakraPoints {
  sahasrara: number;
  ajna: number;
  vishudha: number;
  anahata: number;
  manipura: number;
  svadhisthana: number;
  muladhara: number;
}

export interface HealthMap {
  heavenLine: ChakraPoints;
  earthLine: ChakraPoints;
  totalHealthKeys: ChakraPoints;
}

export interface DestinyLevels {
  heaven: number; // Level 1: Takdir Surgawi
  earth: number; // Level 2: Takdir Duniawi
  personal: number; // Level 3: Personal Integral (heaven + earth)
  fatherLine: number; // Level 4: Garis Ayah (F + H)
  motherLine: number; // Level 5: Garis Ibu (G + I)
  social: number; // Level 6: Social / Family Integral (father + mother)
  spiritual: number; // Level 7: Divine Personal (personal + social)
  globalMission: number; // Level 8: Global Divine Mission (social + spiritual)

  // Pusat Kekuatan
  personalCenter: number; // Pusat Kekuatan Pribadi (E)
  familyCenter: number; // Pusat Kekuatan Keluarga (F + G + H + I)
  unifiedCenter: number; // Pusat Kekuatan Gabungan (Personal + Family)
}
