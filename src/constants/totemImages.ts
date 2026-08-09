// Berkas: src/constants/totemImages.ts
/* eslint-disable @typescript-eslint/no-require-imports */
import { ImageSourcePropType } from 'react-native';

export const TOTEM_IMAGES: Record<string, ImageSourcePropType> = {
  Angel: require('@assets/images/totems/angel.png'),
  Eagle: require('@assets/images/totems/eagle.png'),
  Lion: require('@assets/images/totems/lion.png'),
  Ox: require('@assets/images/totems/ox.png'),
};

export function getTotemImage(key: string): ImageSourcePropType {
  return TOTEM_IMAGES[key] ?? TOTEM_IMAGES.Angel;
}
