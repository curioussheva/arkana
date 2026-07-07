import { eq, desc } from 'drizzle-orm';
import { getDrizzleDb } from './index';
import { destinyProfiles } from './profile-schema';
import type { DestinyProfile } from './profile-schema';

function generateProfileId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

class ProfileManager {
  private static instance: ProfileManager;

  private constructor() {}

  static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager();
    }
    return ProfileManager.instance;
  }

  async createProfile(name: string, birthDate: string): Promise<DestinyProfile> {
    const db = await getDrizzleDb();
    const id = generateProfileId();
    const createdAt = new Date();
    await db.insert(destinyProfiles).values({ id, name, birthDate, createdAt });
    return { id, name, birthDate, createdAt };
  }

  async listProfiles(): Promise<DestinyProfile[]> {
    const db = await getDrizzleDb();
    return db.select().from(destinyProfiles).orderBy(desc(destinyProfiles.createdAt));
  }

  async getProfile(id: string): Promise<DestinyProfile | null> {
    const db = await getDrizzleDb();
    const rows = await db.select().from(destinyProfiles).where(eq(destinyProfiles.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async renameProfile(id: string, name: string): Promise<void> {
    const db = await getDrizzleDb();
    await db.update(destinyProfiles).set({ name }).where(eq(destinyProfiles.id, id));
  }

  async deleteProfile(id: string): Promise<void> {
    const db = await getDrizzleDb();
    await db.delete(destinyProfiles).where(eq(destinyProfiles.id, id));
  }
}

export const profileManager = ProfileManager.getInstance();
