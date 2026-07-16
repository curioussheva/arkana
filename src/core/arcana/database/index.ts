// src/core/arcana/database/index.ts

import type { ArcanaDefinition } from "../types";

import { ARCANA_00 } from "./00";
import { ARCANA_01 } from "./01";
import { ARCANA_02 } from "./02";
import { ARCANA_03 } from "./03";
import { ARCANA_04 } from "./04";
import { ARCANA_05 } from "./05";
import { ARCANA_06 } from "./06";
import { ARCANA_07 } from "./07";
import { ARCANA_08 } from "./08";
import { ARCANA_09 } from "./09";
import { ARCANA_10 } from "./10";
import { ARCANA_11 } from "./11";
import { ARCANA_12 } from "./12";
import { ARCANA_13 } from "./13";
import { ARCANA_14 } from "./14";
import { ARCANA_15 } from "./15";
import { ARCANA_16 } from "./16";
import { ARCANA_17 } from "./17";
import { ARCANA_18 } from "./18";
import { ARCANA_19 } from "./19";
import { ARCANA_20 } from "./20";
import { ARCANA_21 } from "./21";

// ==========================================================
// Individual Exports
// ==========================================================

export {
  ARCANA_00 as arcana00,
  ARCANA_01 as arcana01,
  ARCANA_02 as arcana02,
  ARCANA_03 as arcana03,
  ARCANA_04 as arcana04,
  ARCANA_05 as arcana05,
  ARCANA_06 as arcana06,
  ARCANA_07 as arcana07,
  ARCANA_08 as arcana08,
  ARCANA_09 as arcana09,
  ARCANA_10 as arcana10,
  ARCANA_11 as arcana11,
  ARCANA_12 as arcana12,
  ARCANA_13 as arcana13,
  ARCANA_14 as arcana14,
  ARCANA_15 as arcana15,
  ARCANA_16 as arcana16,
  ARCANA_17 as arcana17,
  ARCANA_18 as arcana18,
  ARCANA_19 as arcana19,
  ARCANA_20 as arcana20,
  ARCANA_21 as arcana21,
};

// ==========================================================
// Complete Database
// ==========================================================

export const ARCANA_DATABASE: readonly ArcanaDefinition[] = [
  ARCANA_00,
  ARCANA_01,
  ARCANA_02,
  ARCANA_03,
  ARCANA_04,
  ARCANA_05,
  ARCANA_06,
  ARCANA_07,
  ARCANA_08,
  ARCANA_09,
  ARCANA_10,
  ARCANA_11,
  ARCANA_12,
  ARCANA_13,
  ARCANA_14,
  ARCANA_15,
  ARCANA_16,
  ARCANA_17,
  ARCANA_18,
  ARCANA_19,
  ARCANA_20,
  ARCANA_21,
];

// ==========================================================
// Lookup Maps
// ==========================================================

export const ARCANA_BY_ID = new Map<number, ArcanaDefinition>(
  ARCANA_DATABASE.map((arcana) => [arcana.id, arcana]),
);

export const ARCANA_BY_TAROT_NAME = new Map<string, ArcanaDefinition>(
  ARCANA_DATABASE.map((arcana) => [
    arcana.tarotName.toLowerCase(),
    arcana,
  ]),
);

export const ARCANA_BY_MATRIX_NAME = new Map<string, ArcanaDefinition>(
  ARCANA_DATABASE.map((arcana) => [
    arcana.matrixName.toLowerCase(),
    arcana,
  ]),
);


// ==========================================================
// Default Export
// ==========================================================

export default ARCANA_DATABASE;