/* eslint-disable @typescript-eslint/no-require-imports */

// Ganti jalurnya menggunakan mundur 2 tingkat saja (../../)
export const ARKANA_CARD_IMAGES: Record<string, number> = {
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

export function getArkanaImage(cardName: string): number | null {
  return ARKANA_CARD_IMAGES[cardName] ?? null;
}
 