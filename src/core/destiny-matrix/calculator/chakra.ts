import { reduceToArcana } from '../utils';
import type { MainPoints, HealthMap, ChakraPoints } from './types';

export function calculateHealthMap(main: MainPoints): HealthMap {
  const { A, B, C, D, E } = main;

  // 1. Garis Surga (Garis Vertikal: B, E, D)
  const sahasraraHeaven = B;
  const muladharaHeaven = D;
  const manipuraHeaven = E;
  const vishudhaHeaven = reduceToArcana(sahasraraHeaven + manipuraHeaven);
  const ajnaHeaven = reduceToArcana(sahasraraHeaven + vishudhaHeaven);
  const anahataHeaven = reduceToArcana(vishudhaHeaven + manipuraHeaven);
  const svadhisthanaHeaven = reduceToArcana(manipuraHeaven + muladharaHeaven);

  const heavenLine: ChakraPoints = {
    sahasrara: sahasraraHeaven,
    ajna: ajnaHeaven,
    vishudha: vishudhaHeaven,
    anahata: anahataHeaven,
    manipura: manipuraHeaven,
    svadhisthana: svadhisthanaHeaven,
    muladhara: muladharaHeaven,
  };

  // 2. Garis Bumi (Garis Horizontal: A, E, C)
  const sahasraraEarth = A;
  const muladharaEarth = C;
  const manipuraEarth = E;
  const vishudhaEarth = reduceToArcana(sahasraraEarth + manipuraEarth);
  const ajnaEarth = reduceToArcana(sahasraraEarth + vishudhaEarth);
  const anahataEarth = reduceToArcana(vishudhaEarth + manipuraEarth);
  const svadhisthanaEarth = reduceToArcana(manipuraEarth + muladharaEarth);

  const earthLine: ChakraPoints = {
    sahasrara: sahasraraEarth,
    ajna: ajnaEarth,
    vishudha: vishudhaEarth,
    anahata: anahataEarth,
    manipura: manipuraEarth,
    svadhisthana: svadhisthanaEarth,
    muladhara: muladharaEarth,
  };

  // 3. Kunci Kesehatan Total (Surga + Bumi di Setiap Chakra)
  const totalHealthKeys: ChakraPoints = {
    sahasrara: reduceToArcana(heavenLine.sahasrara + earthLine.sahasrara),
    ajna: reduceToArcana(heavenLine.ajna + earthLine.ajna),
    vishudha: reduceToArcana(heavenLine.vishudha + earthLine.vishudha),
    anahata: reduceToArcana(heavenLine.anahata + earthLine.anahata),
    manipura: reduceToArcana(heavenLine.manipura + earthLine.manipura),
    svadhisthana: reduceToArcana(heavenLine.svadhisthana + earthLine.svadhisthana),
    muladhara: reduceToArcana(heavenLine.muladhara + earthLine.muladhara),
  };

  return { heavenLine, earthLine, totalHealthKeys };
}
