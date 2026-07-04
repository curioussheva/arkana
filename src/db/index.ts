import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

let sqliteInstance: SQLiteDatabase | null = null;
let drizzleInstance: ExpoSQLiteDatabase<typeof schema> | null = null;

// Bump this whenever a change to the tables below requires a one-time
// backfill/cleanup for users who already have the app installed (e.g.
// when arkana_readings was added, old cached rows had no matching entry).
const CURRENT_SCHEMA_VERSION = '2';
const SCHEMA_VERSION_KEY = 'schema_version';

async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS matrix_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'default',
      birth_date TEXT NOT NULL,
      name TEXT NOT NULL,
      life_path INTEGER NOT NULL,
      destiny INTEGER NOT NULL,
      soul_urge INTEGER NOT NULL,
      personality INTEGER NOT NULL,
      expression INTEGER NOT NULL,
      birthday INTEGER NOT NULL,
      maturity INTEGER NOT NULL,
      personal_year INTEGER NOT NULL,
      personal_month INTEGER NOT NULL,
      personal_day INTEGER NOT NULL,
      challenge_json TEXT NOT NULL,
      pinnacle_json TEXT NOT NULL,
      energy_grid_json TEXT NOT NULL,
      arkana_card TEXT NOT NULL,
      arkana_number INTEGER NOT NULL,
      calculated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      expires_at INTEGER NOT NULL DEFAULT (unixepoch() + 2592000)
    );

    CREATE INDEX IF NOT EXISTS idx_matrix_user_date ON matrix_results(user_id, birth_date);
    CREATE INDEX IF NOT EXISTS idx_matrix_calculated ON matrix_results(calculated_at);

    CREATE TABLE IF NOT EXISTS ai_insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matrix_id INTEGER NOT NULL REFERENCES matrix_results(id) ON DELETE CASCADE,
      narrative TEXT NOT NULL,
      recommendations_json TEXT NOT NULL,
      confidence REAL NOT NULL,
      model_version TEXT NOT NULL DEFAULT '1.0.0',
      generated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_insight_matrix ON ai_insights(matrix_id);

    CREATE TABLE IF NOT EXISTS arkana_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matrix_id INTEGER NOT NULL REFERENCES matrix_results(id) ON DELETE CASCADE,
      card_name TEXT NOT NULL,
      card_number INTEGER NOT NULL,
      element TEXT NOT NULL,
      upright_meaning TEXT NOT NULL,
      reversed_meaning TEXT,
      keywords_json TEXT NOT NULL,
      drawn_at INTEGER NOT NULL DEFAULT (unixepoch()),
      is_reversed INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_arkana_matrix ON arkana_readings(matrix_id);

    CREATE TABLE IF NOT EXISTS user_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'default',
      action_type TEXT NOT NULL,
      metadata_json TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_history_user_time ON user_history(user_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_history_action ON user_history(user_id, action_type);

    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'default' UNIQUE,
      theme TEXT NOT NULL DEFAULT 'system',
      language TEXT NOT NULL DEFAULT 'id',
      notifications_enabled INTEGER NOT NULL DEFAULT 1,
      daily_reminder_time TEXT DEFAULT '08:00',
      ai_model_version TEXT DEFAULT '1.0.0',
      cache_duration_days INTEGER NOT NULL DEFAULT 30,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await runMigrations(db);
}

/**
 * One-time migration/backfill logic, gated by a version stamp stored in
 * schema_meta. Add a new `if (fromVersion < 'N')` block whenever a schema
 * change needs to backfill or clean up data for existing installs —
 * don't just bump CURRENT_SCHEMA_VERSION without a migration step, or
 * old users get silently stuck on stale data.
 */
async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM schema_meta WHERE key = ?',
    [SCHEMA_VERSION_KEY]
  );
  const fromVersion = row?.value ?? '0';

  if (fromVersion === CURRENT_SCHEMA_VERSION) {
    return; // already up to date
  }

  // v0/v1 -> v2: arkana_readings table was added after matrix_results
  // already existed for some installs. Any matrix_results row without a
  // matching arkana_readings row is "legacy" — cache-manager.ts already
  // has a safe fallback for this (element defaults to 'Fire', etc.), so
  // no destructive backfill is required. We just clear the *expired*
  // cache to force fresh recalculation (which will populate
  // arkana_readings correctly going forward) instead of leaving stale
  // incomplete rows around indefinitely.
  if (fromVersion < '2') {
    await db.execAsync(`
      DELETE FROM matrix_results
      WHERE id NOT IN (SELECT matrix_id FROM arkana_readings)
        AND expires_at < unixepoch();
    `);
  }

  // Add future migration blocks here, e.g.:
  // if (fromVersion < '3') { ... }

  await db.runAsync(
    'INSERT OR REPLACE INTO schema_meta (key, value) VALUES (?, ?)',
    [SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION]
  );
}

/**
 * Returns the raw expo-sqlite handle. Use only for cases that don't need
 * the Drizzle query builder (e.g. one-off PRAGMA calls). Most app code
 * should use getDrizzleDb() instead.
 */
export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!sqliteInstance) {
    sqliteInstance = await openDatabaseAsync('numerology.db');
    await initDatabase(sqliteInstance);
  }
  return sqliteInstance;
}

/**
 * Returns the Drizzle-wrapped database instance for query-builder access
 * (db.select().from(...), db.insert(...), etc). This is what cache-manager
 * and other data-access code should use.
 */
export async function getDrizzleDb(): Promise<ExpoSQLiteDatabase<typeof schema>> {
  if (!drizzleInstance) {
    const sqlite = await getDatabase();
    drizzleInstance = drizzle(sqlite, { schema });
  }
  return drizzleInstance;
}

export { type SQLiteDatabase };
 