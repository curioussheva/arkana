// src/core/destiny-matrix/daily-resonance.ts
import { getRandomDailyCard } from './daily-card';
import type { DailyElementSummary, DailyResonance, TotemKey } from './types';

export type ElementKey = 'Fire' | 'Water' | 'Air' | 'Earth';

interface ElementInfo {
  icon: string;
  color: string;
  totemKey: TotemKey;
  full: Omit<DailyResonance, 'icon' | 'color' | 'cardName' | 'cardId' | 'totemKey'>;
  short: Pick<DailyElementSummary, 'name' | 'totem' | 'gem'>;
}

// 🐾 PEMETAAN TOTEM TETRAMORPH (selaras dengan TotemSanctuarySection)
// Air → Angel · Water → Eagle · Fire → Lion · Earth → Ox
const ELEMENT_DATA: Record<ElementKey, ElementInfo> = {
  Fire: {
    icon: '🔥',
    color: '#ef4444',
    totemKey: 'Lion',
    full: {
      element: 'Api (Fire)',
      totem: 'Singa (Kepemimpinan & Kejelasan Visi)',
      gemstone: '🔮 Ruby / Carnelian (Vitalitas & Keberanian)',
      luckyColor: 'Merah Marun & Emas',
      direction: 'Selatan',
      doAction: 'Eksekusi ide bertindak cepat, ambil keputusan tegas.',
      dontAction: 'Impulsif, marah berlebihan, memaksakan kehendak.',
    },
    short: { name: 'Api', totem: '🦁 Singa', gem: '🔮 Ruby' },
  },
  Water: {
    icon: '💧',
    color: '#3b82f6',
    totemKey: 'Eagle',
    full: {
      element: 'Air (Water)',
      totem: 'Burung Elang (Intuisi & Pemulihan Emosi)',
      gemstone: '💎 Aquamarine / Moonstone (Ketenangan Batin)',
      luckyColor: 'Biru Samudra & Perak',
      direction: 'Utara',
      doAction: 'Dengarkan kata hati, luapkan perasaan lewat karya/jurnal.',
      dontAction: 'Terjebak nostalgia berlebih, bersikap terlalu defensif.',
    },
    short: { name: 'Air', totem: '🦅 Elang', gem: '💎 Aquamarine' },
  },
  Air: {
    icon: '🌬️',
    color: '#06b6d4',
    totemKey: 'Angel',
    full: {
      element: 'Udara (Air)',
      totem: 'Malaikat (Kebijaksanaan & Logika Tajam)',
      gemstone: '💎 Lapis Lazuli / Amethyst (Fokus & Ide Efektif)',
      luckyColor: 'Kuning Kunyit & Hijau Mint',
      direction: 'Timur',
      doAction: 'Negosiasi, membaca, menyusun rencana jangka panjang.',
      dontAction: 'Terlalu banyak berpikir tanpa tindakan nyata (overthinking).',
    },
    short: { name: 'Udara', totem: '👼 Malaikat', gem: '💎 Lapis Lazuli' },
  },
  Earth: {
    icon: '🌍',
    color: '#10b981',
    totemKey: 'Ox',
    full: {
      element: 'Bumi (Earth)',
      totem: 'Lembu (Kekuatan Fisik & Grounding Stabil)',
      gemstone: '💎 Jade Hijau / Black Tourmaline (Proteksi Aset)',
      luckyColor: 'Cokelat Kayu & Hijau Olif',
      direction: 'Barat',
      doAction: 'Gali potensi finansial, rapikan jadwal harian, nikmati alam.',
      dontAction: 'Kaku terhadap perubahan, menunda tugas penting (mager).',
    },
    short: { name: 'Bumi', totem: '🐂 Lembu', gem: '💎 Jade' },
  },
};

const FALLBACK = { cardName: 'The Magician', cardId: 1, element: 'Fire' as ElementKey };

function resolveDailyCard(): { cardName: string; cardId: number; element: ElementKey } {
  try {
    const card = getRandomDailyCard();
    if (!card) return FALLBACK;
    const elem = (card.element as ElementKey) || 'Fire';
    return {
      cardName: card.tarotName,
      cardId: card.id === 0 ? 22 : card.id,
      element: elem,
    };
  } catch {
    return FALLBACK;
  }
}

/** Versi lengkap — dipakai di CoreEssenceDetailModal */
export function getDailyResonance(): DailyResonance {
  const { cardName, cardId, element } = resolveDailyCard();
  const data = ELEMENT_DATA[element];
  return {
    ...data.full,
    icon: data.icon,
    color: data.color,
    cardName,
    cardId,
    totemKey: data.totemKey,
  };
}

/** Versi ringkas — dipakai di CoreEssenceGridCard */
export function getDailyElementSummary(): DailyElementSummary {
  const { cardName, cardId, element } = resolveDailyCard();
  const data = ELEMENT_DATA[element];
  return {
    icon: data.icon,
    color: data.color,
    cardName,
    cardId,
    totemKey: data.totemKey,
    ...data.short,
  };
}
