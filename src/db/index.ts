import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as destinySchema from './destiny-schema';

const schema = { ...destinySchema };

let sqliteInstance: SQLiteDatabase | null = null;
let drizzleInstance: ExpoSQLiteDatabase<typeof schema> | null = null;

// Bump this whenever a change to the tables below requires a one-time
// backfill/cleanup for users who already have the app installed.
const CURRENT_SCHEMA_VERSION = '1';
const SCHEMA_VERSION_KEY = 'schema_version';

async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  // NOTE: this branch (destiny-matrix) only initializes Destiny Matrix
  // tables. The classical numerology tables (matrix_results, ai_insights,
  // arkana_readings, user_preferences) live on the pythagorean-klasik
  // branch — see schema.ts there if you need to reference or restore them.
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

  // Add future migration blocks here, e.g.:
  // if (fromVersion < '2') { ... }

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
