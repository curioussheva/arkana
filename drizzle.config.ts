import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
  dbCredentials: {
    url: 'file:numerology.db',
  },
  verbose: true,
  strict: true,
});
