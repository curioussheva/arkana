// Berkas: src/core/destiny-matrix/utils/element.ts

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';

export interface ElementRelation {
  type: 'supports' | 'conflicts' | 'neutral';
  title: string;
  description: string;
}

// 1. HELPER PENENTU ELEMEN DOMINAN (Dengan Tie-Breaker Konsisten)
export function calculateDominantElement(
  pointsByElement: Record<string, any[]>,
  coreElement?: string
): ElementType {
  let maxCount = -1;
  let dominant: ElementType = (coreElement as ElementType) || 'Fire';

  const priorityOrder: ElementType[] = ['Fire', 'Earth', 'Water', 'Air'];

  Object.entries(pointsByElement).forEach(([el, list]) => {
    const count = list.length;
    const currentEl = el as ElementType;

    if (count > maxCount) {
      maxCount = count;
      dominant = currentEl;
    } else if (count === maxCount && count > 0) {
      // Prioritaskan Elemen Inti jika seri
      if (currentEl === coreElement) {
        dominant = currentEl;
      } else if (
        dominant !== coreElement &&
        priorityOrder.indexOf(currentEl) < priorityOrder.indexOf(dominant)
      ) {
        dominant = currentEl;
      }
    }
  });

  return dominant;
}

// 2. DIKSIONARI KARAKTERISTIK DASAR & SIKLUS ELEMEN
export const ELEMENT_BASE_DATA: Record<
  ElementType,
  {
    label: string;
    icon: string;
    color: string;
    keyword: string;
    supports: ElementType; // Elemen yang dikuatkan / memberi makan
    conflicts: ElementType; // Elemen yang berbenturan / memadamkan
    cycleAdvice: string;
  }
> = {
  Fire: {
    label: '🔥 Api',
    icon: '🔥',
    color: '#ef4444',
    keyword: 'Aksi & Gairah',
    supports: 'Earth', // Api membakar materi menjadi fondasi Bumi
    conflicts: 'Water', // Air memadamkan Api
    cycleAdvice:
      'Salurkan gairah Api untuk membangun fondasi nyata (Bumi). Waspadai emosi luap-luap yang bisa dipadamkan oleh ketidakpastian (Air).',
  },
  Earth: {
    label: '🌍 Bumi',
    icon: '🌍',
    color: '#22c55e',
    keyword: 'Stabilitas & Eksekusi',
    supports: 'Air', // Bumi menjadi wadah & saluran bagi Udara / pemikiran
    conflicts: 'Air', // Udara kencang mengikis Bumi yang tidak fleksibel
    cycleAdvice:
      'Gunakan kekokohan Bumi untuk memberi ruang bagi ide-ide jernih (Udara). Lindungi stabilitasmu dari kejenuhan rutinitas.',
  },
  Air: {
    label: '💨 Udara',
    icon: '💨',
    color: '#a855f7',
    keyword: 'Gagasan & Komunikasi',
    supports: 'Fire', // Udara memberi oksigen agar Api menyala
    conflicts: 'Earth', // Bumi yang kaku menghambat kebebasan Udara
    cycleAdvice:
      'Inspirasi dan gagasanku (Udara) adalah bahan bakar terbaik bagi keberanian bertindak (Api). Tetaplah membumi agar ide tak menguap.',
  },
  Water: {
    label: '💧 Air',
    icon: '💧',
    color: '#3b82f6',
    keyword: 'Intuisi & Kedalaman',
    supports: 'Air', // Air memberi kehidupan dan kelembutan pada ruang Udara
    conflicts: 'Fire', // Api yang terlalu panas menguapkan Air
    cycleAdvice:
      'Intuisi dan kepekaanmu (Air) memurnikan kejernihan berpikir. Jaga agar amarah/gejolak luar tidak mengeringkan kedamaian batinmu.',
  },
};

// 3. HELPER UNTUK MENGHITUNG DINAMIKA SIKLUS DUA ELEMEN
export function getElementRelation(
  dominant: ElementType,
  secondary?: ElementType
): ElementRelation | null {
  if (!secondary || dominant === secondary) {
    return {
      type: 'neutral',
      title: 'Murni & Terfokus',
      description: `Energi ${dominant} bekerja secara penuh tanpa friksi, fokus pada penguatan potensi murni.`,
    };
  }

  const domData = ELEMENT_BASE_DATA[dominant];

  if (domData.supports === secondary) {
    return {
      type: 'supports',
      title: '✨ Siklus Generatif (Saling Menguatkan)',
      description: `Energi ${dominant} memberi nutrisi dan daya dorong alami pada elemen ${secondary}. Aksimu berdampak nyata.`,
    };
  }

  if (domData.conflicts === secondary) {
    return {
      type: 'conflicts',
      title: '⚡ Siklus Dinamis (Friksi & Keseimbangan)',
      description: `Perpaduan ${dominant} dan ${secondary} menciptakan percikan internal. Perlu kesadaran agar tidak saling meniadakan.`,
    };
  }

  return {
    type: 'neutral',
    title: '☯️ Siklus Komplementer',
    description: `Perpaduan ${dominant} dan ${secondary} saling melengkapi spektrum jiwamu secara seimbang.`,
  };
}
