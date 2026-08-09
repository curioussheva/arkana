// src/core/arcana/service.ts

import type { ArcanaDefinition } from './types';

import {
  ARCANA_DATABASE,
  ARCANA_BY_ID,
  ARCANA_BY_TAROT_NAME,
  ARCANA_BY_MATRIX_NAME,
} from './database';

import { getArcanaById, getArcanaByTarotName, getArcanaByMatrixName } from './query';

export class ArcanaService {
  static all(): readonly ArcanaDefinition[] {
    return ARCANA_DATABASE;
  }

  static count(): number {
    return ARCANA_DATABASE.length;
  }

  static exists(id: number): boolean {
    return ARCANA_BY_ID.has(id);
  }

  static get(id: number): ArcanaDefinition {
    const arcana = getArcanaById(id);

    if (!arcana) {
      throw new Error(`Arcana ${id} tidak ditemukan.`);
    }

    return arcana;
  }

  static byTarotName(name: string): ArcanaDefinition {
    const arcana = getArcanaByTarotName(name);

    if (!arcana) {
      throw new Error(`Tarot "${name}" tidak ditemukan.`);
    }

    return arcana;
  }

  static byMatrixName(name: string): ArcanaDefinition {
    const arcana = getArcanaByMatrixName(name);

    if (!arcana) {
      throw new Error(`Matrix Arcana "${name}" tidak ditemukan.`);
    }

    return arcana;
  }

  static random(): ArcanaDefinition {
    const index = Math.floor(Math.random() * ARCANA_DATABASE.length);

    return ARCANA_DATABASE[index]!;
  }

  static listByElement(element: string): ArcanaDefinition[] {
    const target = element.toLowerCase();

    return ARCANA_DATABASE.filter(arcana => arcana.element.toLowerCase() === target);
  }

  static listByPlanet(planet: string): ArcanaDefinition[] {
    const target = planet.toLowerCase();

    return ARCANA_DATABASE.filter(arcana => arcana.planet?.toLowerCase() === target);
  }

  static listByZodiac(zodiac: string): ArcanaDefinition[] {
    const target = zodiac.toLowerCase();

    return ARCANA_DATABASE.filter(arcana => arcana.zodiac?.toLowerCase() === target);
  }

  static listByChakra(chakra: string): ArcanaDefinition[] {
    const target = chakra.toLowerCase();

    return ARCANA_DATABASE.filter(arcana => arcana.chakra?.toLowerCase() === target);
  }

  static getMapById(): ReadonlyMap<number, ArcanaDefinition> {
    return ARCANA_BY_ID;
  }

  static getMapByTarotName(): ReadonlyMap<string, ArcanaDefinition> {
    return ARCANA_BY_TAROT_NAME;
  }

  static getMapByMatrixName(): ReadonlyMap<string, ArcanaDefinition> {
    return ARCANA_BY_MATRIX_NAME;
  }
}

export const arcanaService = ArcanaService;
