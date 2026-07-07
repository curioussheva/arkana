import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as destinySchema from './destiny-schema';
import * as profileSchema from './profile-schema';

const schema = { ...destinySchema, ...profileSchema };

let sqliteInstance: SQLiteDatabase | null = null;
let drizzleInstance: ExpoSQLiteDatabase<typeof schema> | null = null;

// Bump this whenever a change to the tables below requires a one-time
// backfill/cleanup for users who already have the app installed.
const CURRENT_SCHEMA_VERSION = '3';
const SCHEMA_VERSION_KEY = 'schema_version';

async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS destiny_matrix_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'default',
      birth_date TEXT NOT NULL,
      points_json TEXT NOT NULL,
      version TEXT NOT NULL DEFAULT '1.0.0',
      calculated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      expires_at INTEGER NOT NULL DEFAULT (unixepoch() + 31536000)
    );

    CREATE INDEX IF NOT EXISTS idx_destiny_user_date ON destiny_matrix_results(user_id, birth_date);
    CREATE INDEX IF NOT EXISTS idx_destiny_calculated ON destiny_matrix_results(calculated_at);

    CREATE TABLE IF NOT EXISTS destiny_user_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'default',
      action_type TEXT NOT NULL,
      metadata_json TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_destiny_history_user_time ON destiny_user_history(user_id, created_at);

    CREATE TABLE IF NOT EXISTS destiny_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS destiny_schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await runMigrations(db);
}

async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM destiny_schema_meta WHERE key = ?',
    [SCHEMA_VERSION_KEY]
  );
  const fromVersion = row?.value ?? '0';

  if (fromVersion === CURRENT_SCHEMA_VERSION) {
    return;
  }

  // v1 -> v2: added destiny_profiles table (multiple saved profiles).
  // No backfill needed — CREATE TABLE IF NOT EXISTS above already
  // handles existing installs; this is purely additive.

  // v2 -> v3: DestinyMatrix.points expanded from 13 points (A-M) to 20
  // (A-T). Cached rows' points_json only has the old shape and will
  // crash the UI on read (missing N-T). Clearing the cache table is
  // safe — it's recomputable from birth_date, no user data is lost.
  if (fromVersion < '3') {
    await db.execAsync('DELETE FROM destiny_matrix_results;');
  }

  // Add future migration blocks here, e.g.:
  // if (fromVersion < '3') { ... }

  await db.runAsync(
    'INSERT OR REPLACE INTO destiny_schema_meta (key, value) VALUES (?, ?)',
    [SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION]
  );
}

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!sqliteInstance) {
    sqliteInstance = await openDatabaseAsync('destiny_matrix.db');
    await initDatabase(sqliteInstance);
  }
  return sqliteInstance;
}

export async function getDrizzleDb(): Promise<ExpoSQLiteDatabase<typeof schema>> {
  if (!drizzleInstance) {
    const sqlite = await getDatabase();
    drizzleInstance = drizzle(sqlite, { schema });
  }
  return drizzleInstance;
}

export { type SQLiteDatabase };
