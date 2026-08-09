/* eslint-disable @typescript-eslint/no-require-imports */
import { ImageSourcePropType } from 'react-native';

export const ARCANA_CARD_IMAGES: Record<string, ImageSourcePropType> = {
  'The Fool': require('../../assets/images/cards/the_fool.jpg'),
  'The Magician': require('../../assets/images/cards/the_magician.jpg'),
  'The High Priestess': require('../../assets/images/cards/the_high_priestess.jpg'),
  'The Empress': require('../../assets/images/cards/the_empress.jpg'),
  'The Emperor': require('../../assets/images/cards/the_emperor.jpg'),
  'The Hierophant': require('../../assets/images/cards/the_hierophant.jpg'),
  'The Lovers': require('../../assets/images/cards/the_lovers.jpg'),
  'The Chariot': require('../../assets/images/cards/the_chariot.jpg'),
  Strength: require('../../assets/images/cards/the_strength.jpg'),
  'The Hermit': require('../../assets/images/cards/the_hermit.jpg'),
  'Wheel of Fortune': require('../../assets/images/cards/the_wheel_of_fortune.jpg'),
  Justice: require('../../assets/images/cards/the_justice.jpg'),
  'The Hanged Man': require('../../assets/images/cards/the_hanged_man.jpg'),
  Death: require('../../assets/images/cards/the_death.jpg'),
  Temperance: require('../../assets/images/cards/the_temperance.jpg'),
  'The Devil': require('../../assets/images/cards/the_devil.jpg'),
  'The Tower': require('../../assets/images/cards/the_tower.jpg'),
  'The Star': require('../../assets/images/cards/the_star.jpg'),
  'The Moon': require('../../assets/images/cards/the_moon.jpg'),
  'The Sun': require('../../assets/images/cards/the_sun.jpg'),
  Judgement: require('../../assets/images/cards/the_judgement.jpg'),
  'The World': require('../../assets/images/cards/the_world.jpg'),
};

// Urutan Major Arcana standar (id 0-21) mengikuti urutan insersi di atas
const ARCANA_ID_ORDER: string[] = Object.keys(ARCANA_CARD_IMAGES);

export function getArcanaImage(cardNameOrId: string | number): ImageSourcePropType | undefined {
  if (typeof cardNameOrId === 'number') {
    const name = ARCANA_ID_ORDER[cardNameOrId];
    return name ? ARCANA_CARD_IMAGES[name] : undefined;
  }
  return ARCANA_CARD_IMAGES[cardNameOrId] ?? undefined;
}
