// src/core/arcana/query.ts

import type { ArcanaDefinition } from './types';
import { ARCANA_DATABASE } from './database';

/**
 * Normalisasi nomor Arcana menjadi 0–21.
 */
export function normalizeArcanaNumber(value: number): number {
  return ((Math.trunc(value) % 22) + 22) % 22;
}

/**
 * Mengambil Arcana berdasarkan nomor.
 */
export function getArcanaById(id: number): ArcanaDefinition | undefined {
  const normalized = normalizeArcanaNumber(id);
  return ARCANA_DATABASE.find(arcana => arcana.id === normalized);
}

/**
 * Alias untuk kompatibilitas.
 */
export const getArcana = getArcanaById;

/**
 * Mengambil Arcana berdasarkan nama Tarot.
 */
export function getArcanaByTarotName(tarotName: string): ArcanaDefinition | undefined {
  const keyword = tarotName.trim().toLowerCase();

  return ARCANA_DATABASE.find(arcana => arcana.tarotName.toLowerCase() === keyword);
}

/**
 * Mengambil Arcana berdasarkan nama Matrix.
 */
export function getArcanaByMatrixName(matrixName: string): ArcanaDefinition | undefined {
  const keyword = matrixName.trim().toLowerCase();

  return ARCANA_DATABASE.find(arcana => arcana.matrixName.toLowerCase() === keyword);
}

/**
 * Mengambil semua Arcana berdasarkan elemen.
 */
export function getArcanaByElement(element: string): ArcanaDefinition[] {
  const keyword = element.trim().toLowerCase();

  return ARCANA_DATABASE.filter(arcana => arcana.element.toLowerCase() === keyword);
}

/**
 * Mengambil semua Arcana berdasarkan chakra.
 */
export function getArcanaByChakra(chakra: string): ArcanaDefinition[] {
  const keyword = chakra.trim().toLowerCase();

  return ARCANA_DATABASE.filter(arcana => arcana.chakra?.toLowerCase() === keyword);
}

/**
 * Mengambil semua Arcana berdasarkan planet.
 */
export function getArcanaByPlanet(planet: string): ArcanaDefinition[] {
  const keyword = planet.trim().toLowerCase();

  return ARCANA_DATABASE.filter(arcana => arcana.planet?.toLowerCase() === keyword);
}

/**
 * Mengambil semua Arcana berdasarkan zodiac.
 */
export function getArcanaByZodiac(zodiac: string): ArcanaDefinition[] {
  const keyword = zodiac.trim().toLowerCase();

  return ARCANA_DATABASE.filter(arcana => arcana.zodiac?.toLowerCase() === keyword);
}

/**
 * Mengecek apakah Arcana tersedia.
 */
export function hasArcana(id: number): boolean {
  return getArcanaById(id) !== undefined;
}

/**
 * Total Arcana dalam database.
 */
export function getArcanaCount(): number {
  return ARCANA_DATABASE.length;
}

/**
 * Mengambil seluruh database.
 */
export function getAllArcana(): readonly ArcanaDefinition[] {
  return ARCANA_DATABASE;
}

export function getArcanaByNumber(value: number): ArcanaDefinition {
  return getArcanaById(value) ?? ARCANA_DATABASE[0];
}
