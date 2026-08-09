import type { ArcanaDefinition } from '../../arcana/types';
import type { DestinyMatrix, DestinyPoint } from '../types';

const ELEMENT_OPENINGS: Record<ArcanaDefinition['element'], string[]> = {
  Fire: [
    'Elemen api dalam dirimu sedang menyala terang, mendorong keberanian untuk mengambil aksi nyata.',
    'Ada semangat membara yang mengalir di setiap langkahmu saat ini—saatnya melangkah maju.',
    'Energi api yang kuat memberikan dorongan besar bagimu untuk memimpin dan mulai berkreasi.',
  ],
  Water: [
    'Kedalaman emosimu bukanlah sebuah kelemahan, melainkan sumber kebijaksanaan terbesarmu.',
    'Intuisimu mengalir jernih seperti air, membimbing langkahmu dengan sangat lembut.',
    'Kepekaan hatimu adalah radar alami yang akan menuntunmu ke arah yang tepat.',
  ],
  Air: [
    'Pikiran yang tajam dan ide-ide cemerlang adalah anugerah terbesarmu saat ini.',
    'Kemampuanmu dalam berkomunikasi dan bertukar gagasan adalah kunci kekuatanmu.',
    'Energi udara membawa inspirasi segar dan koneksi baru ke dalam hidupmu.',
  ],
  Earth: [
    'Kestabilan dan ketekunan yang kamu miliki adalah fondasi utama dari kesuksesanmu.',
    'Layaknya bumi yang kokoh, kamu adalah sosok yang sangat diandalkan oleh orang-orang di sekitarmu.',
    'Kesabaranmu dalam berproses perlahan akan membuahkan hasil yang nyata dan bertahan lama.',
  ],
};

type NarrativeTemplate = (
  essence: string,
  personality: string,
  direction: string,
  opening: string,
  yearlyCard: string
) => string;

const TEMPLATES: NarrativeTemplate[] = [
  (essence, personality, direction, opening, yearlyCard) =>
    `${opening}\n\n` +
    `Perjalanan spiritual dan kedamaian batinmu bermuara pada energi **${essence}** yang menjadi jangkar inti jiwamu. ` +
    `Ketika karakter luarmu yang dipengaruhi oleh **${personality}** mampu berjalan selaras, kamu akan dituntun dengan sangat alami menuju pencapaian tertinggi hidupmu di sektor **${direction}**. ` +
    `Khusus untuk tahun ini, energi dari **${yearlyCard}** hadir sebagai tema utama yang akan menguji sekaligus membuka peluang pertumbuhan barumu.`,

  (essence, personality, direction, opening, yearlyCard) =>
    `${opening}\n\n` +
    `Kekuatan terbesarmu akan memancar penuh ketika esensi batin **${essence}** berpadu harmonis dengan karakter **${personality}** yang kamu tunjukkan ke dunia. ` +
    `Kombinasi indah inilah yang menjadi kompas utama untuk mengarahkan hidupmu menuju kelimpahan **${direction}**. ` +
    `Sambutlah tahun ini dengan kesadaran penuh, karena energi **${yearlyCard}** siap membawa perubahan penting dalam transisi hidupmu.`,

  (essence, personality, direction, opening, yearlyCard) =>
    `${opening}\n\n` +
    `Melalui inti jiwa **${essence}**, kamu diajarkan untuk mengenali jati dirimu yang paling autentik, sementara energi **${personality}** membentuk caramu untuk hadir dan bersinar di mata publik. ` +
    `Jalur **${direction}** merupakan arah evolusi jiwa yang sedang kamu tuju. ` +
    `Tetaplah peka terhadap tanda-tanda alam, sebab energi **${yearlyCard}** akan memberikan pelajaran hidup yang sangat berharga sepanjang tahun ini.`,
];

function random<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Helper internal untuk memformat nama kartu secara konsisten: Tarot Name ("Matrix Name")
 * Bebas dari warning ESLint 'any'
 */
function formatCardName(point: DestinyPoint | undefined, fallback: string): string {
  const arcana = point?.arcana;
  if (!arcana) return fallback;

  const tarot = arcana.tarotName;
  const matrix = arcana.matrixName;

  if (tarot && matrix) {
    return `${tarot} ("${matrix}")`;
  }
  return tarot || matrix || fallback;
}

/**
 * Membuat narasi utama Insight.
 */
export function buildNarrative(
  dominantElement: ArcanaDefinition['element'],
  coreEssenceCard: string,
  personalityCard: string,
  lifeDirectionCard: string,
  yearlyCard: string
): string {
  const opening = random(ELEMENT_OPENINGS[dominantElement]);
  const template = random(TEMPLATES);

  return template(coreEssenceCard, personalityCard, lifeDirectionCard, opening, yearlyCard);
}

/**
 * Membuat narasi utama Insight langsung dari objek DestinyMatrix.
 * 💡 KOREKSI: Menggunakan helper formatCardName agar nama Tarot tampil lebih dulu dan rapi.
 */
export function generateNarrative(
  matrix: DestinyMatrix & { yearlyArcana?: { tarotName: string; matrixName?: string } }
): string {
  if (!matrix || !matrix.points) return 'Data matriks tidak valid.';

  const dominantElement = matrix.points.E?.arcana?.element || 'Earth';

  // Format nama kartu secara dinamis & konsisten
  const coreEssenceCard = formatCardName(matrix.points.E, 'Arcana Pusat');
  const personalityCard = formatCardName(matrix.points.A, 'Arcana Karakter');
  const lifeDirectionCard = formatCardName(matrix.points.C, 'Arcana Takdir');

  // Format tahunan secara aman
  const yearlyTarot = matrix.yearlyArcana?.tarotName;
  const yearlyMatrix = matrix.yearlyArcana?.matrixName;
  const yearlyCard =
    yearlyTarot && yearlyMatrix
      ? `${yearlyTarot} ("${yearlyMatrix}")`
      : yearlyTarot || 'Arcana Tahunan';

  return buildNarrative(
    dominantElement,
    coreEssenceCard,
    personalityCard,
    lifeDirectionCard,
    yearlyCard
  );
}
