import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/schema.ts',
  out: './drizzle',
  driver: 'expo',
  dialect: 'sqlite'
});
