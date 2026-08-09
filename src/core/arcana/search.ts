// src/core/arcana/search.ts

import type { ArcanaDefinition } from './types';
import { ARCANA_DATABASE } from './database';

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function contains(source: string, keyword: string): boolean {
  return normalize(source).includes(normalize(keyword));
}

function containsAny(values: readonly string[], keyword: string): boolean {
  return values.some(value => contains(value, keyword));
}

export function searchArcana(keyword: string): readonly ArcanaDefinition[] {
  const query = normalize(keyword);

  if (!query) {
    return ARCANA_DATABASE;
  }

  return ARCANA_DATABASE.filter(arcana => {
    return (
      contains(arcana.tarotName, query) ||
      contains(arcana.matrixName, query) ||
      contains(arcana.shortName, query) ||
      contains(arcana.archetype, query) ||
      contains(arcana.element, query) ||
      contains(arcana.polarity, query) ||
      contains(arcana.planet ?? '', query) ||
      contains(arcana.zodiac ?? '', query) ||
      contains(arcana.chakra ?? '', query) ||
      contains(arcana.summary, query) ||
      contains(arcana.uprightMeaning, query) ||
      contains(arcana.reversedMeaning, query) ||
      containsAny(arcana.keywords, query) ||
      containsAny(arcana.colors, query) ||
      containsAny(arcana.symbols, query) ||
      containsAny(arcana.animals, query) ||
      containsAny(arcana.crystals, query) ||
      containsAny(arcana.positiveTraits, query) ||
      containsAny(arcana.shadowTraits, query) ||
      containsAny(arcana.strengths, query) ||
      containsAny(arcana.weaknesses, query) ||
      containsAny(arcana.gifts, query) ||
      containsAny(arcana.fears, query) ||
      containsAny(arcana.talents, query) ||
      containsAny(arcana.lifeMission, query) ||
      containsAny(arcana.karmicLessons, query) ||
      containsAny(arcana.spiritualLessons, query) ||
      containsAny(arcana.career, query) ||
      containsAny(arcana.finance, query) ||
      containsAny(arcana.relationship, query) ||
      containsAny(arcana.family, query) ||
      containsAny(arcana.friendship, query) ||
      containsAny(arcana.health, query) ||
      containsAny(arcana.advice, query) ||
      containsAny(arcana.affirmations, query) ||
      containsAny(arcana.meditation, query) ||
      containsAny(arcana.dailyPractice, query) ||
      contains(arcana.narrative.overview, query) ||
      contains(arcana.narrative.personality, query) ||
      contains(arcana.narrative.career, query) ||
      contains(arcana.narrative.relationship, query) ||
      contains(arcana.narrative.spirituality, query) ||
      contains(arcana.narrative.challenge, query) ||
      contains(arcana.narrative.advice, query)
    );
  });
}

export function searchArcanaByKeywords(keywords: readonly string[]): ArcanaDefinition[] {
  const result = new Map<number, ArcanaDefinition>();

  for (const keyword of keywords) {
    for (const arcana of searchArcana(keyword)) {
      result.set(arcana.id, arcana);
    }
  }

  return [...result.values()];
}

export function searchArcanaByElement(element: string): ArcanaDefinition[] {
  const target = normalize(element);

  return ARCANA_DATABASE.filter(arcana => normalize(arcana.element) === target);
}

export function searchArcanaByPlanet(planet: string): ArcanaDefinition[] {
  const target = normalize(planet);

  return ARCANA_DATABASE.filter(arcana => normalize(arcana.planet ?? '') === target);
}

export function searchArcanaByZodiac(zodiac: string): ArcanaDefinition[] {
  const target = normalize(zodiac);

  return ARCANA_DATABASE.filter(arcana => normalize(arcana.zodiac ?? '') === target);
}

export function searchArcanaByChakra(chakra: string): ArcanaDefinition[] {
  const target = normalize(chakra);

  return ARCANA_DATABASE.filter(arcana => normalize(arcana.chakra ?? '') === target);
}
