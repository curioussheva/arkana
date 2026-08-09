// src/core/arcana/formatter.ts

import type { ArcanaDefinition } from './types';

function sentence(values: string[]): string {
  return values.join(', ');
}

function bullet(values: string[]): string {
  return values.map(v => `• ${v}`).join('\n');
}

export const ArcanaFormatter = {
  title(arcana: ArcanaDefinition): string {
    return `${arcana.id}. ${arcana.tarotName}`;
  },

  subtitle(arcana: ArcanaDefinition): string {
    return arcana.matrixName;
  },

  keywords(arcana: ArcanaDefinition): string {
    return sentence(arcana.keywords);
  },

  talents(arcana: ArcanaDefinition): string {
    return sentence(arcana.talents);
  },

  gifts(arcana: ArcanaDefinition): string {
    return sentence(arcana.gifts);
  },

  strengths(arcana: ArcanaDefinition): string {
    return sentence(arcana.positiveTraits);
  },

  shadows(arcana: ArcanaDefinition): string {
    return sentence(arcana.shadowTraits);
  },

  affirmations(arcana: ArcanaDefinition): string {
    return bullet(arcana.affirmations);
  },

  career(arcana: ArcanaDefinition): string {
    return bullet(arcana.career);
  },

  finance(arcana: ArcanaDefinition): string {
    return bullet(arcana.finance);
  },

  relationship(arcana: ArcanaDefinition): string {
    return bullet(arcana.relationship);
  },

  health(arcana: ArcanaDefinition): string {
    return bullet(arcana.health);
  },

  spiritualLessons(arcana: ArcanaDefinition): string {
    return bullet(arcana.spiritualLessons);
  },

  karmicLessons(arcana: ArcanaDefinition): string {
    return bullet(arcana.karmicLessons);
  },

  colors(arcana: ArcanaDefinition): string {
    return sentence(arcana.colors);
  },

  symbols(arcana: ArcanaDefinition): string {
    return sentence(arcana.symbols);
  },

  element(arcana: ArcanaDefinition): string {
    return arcana.element;
  },

  planet(arcana: ArcanaDefinition): string {
    return arcana.planet ?? '-';
  },

  zodiac(arcana: ArcanaDefinition): string {
    return arcana.zodiac ?? '-';
  },

  chakra(arcana: ArcanaDefinition): string {
    return arcana.chakra ?? '-';
  },
};
