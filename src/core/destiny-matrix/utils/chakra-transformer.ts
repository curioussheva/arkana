import type { ArcanaDefinition } from '@core/arcana/types';

export type ChakraStatusType = 'Balanced' | 'Overactive' | 'Blocked';

export interface ChakraImpact {
  chakraName: string;
  status: ChakraStatusType;
  reason: string;
}

export function getChakraImpactFromDailyCard(card: ArcanaDefinition): ChakraImpact {
  // 🔮 INTERSEPTOR RESONANSI: Jika menarik Wheel of Fortune (#10)
  if (card.id === 10 || card.id === 0) {
    return {
      chakraName: 'Solar Plexus',
      status: 'Overactive',
      reason: 'Pulsasi energi Roda Takdir memompa api kehendakmu secara agresif hari ini!',
    };
  }

  // Pemetaan bawaan berdasarkan Elemen Arkana Harian
  switch (card.element) {
    case 'Fire':
      return {
        chakraName: 'Solar Plexus',
        status: 'Overactive',
        reason: 'Elemen Api dari kartu hari ini membakar ambisi dan vitalitas tindakanmu.',
      };
    case 'Water':
      return {
        chakraName: 'Sacral',
        status: 'Balanced',
        reason: 'Aliran elemen Air membawa harmoni, kreativitas, dan keseimbangan emosional.',
      };
    case 'Air':
      return {
        chakraName: 'Throat',
        status: 'Balanced',
        reason: 'Kekuatan Udara membuka jalur komunikasi dan ekspresi kebenaran batinmu.',
      };
    case 'Earth':
      return {
        chakraName: 'Root',
        status: 'Blocked',
        reason:
          'Kepadatan elemen Bumi memicu resistensi atau rasa mager yang menuntut grounding ekstra.',
      };
    default:
      return {
        chakraName: 'Heart',
        status: 'Balanced',
        reason: 'Energi netral menyelaraskan detak kasih sayang di pusat dada.',
      };
  }
}
