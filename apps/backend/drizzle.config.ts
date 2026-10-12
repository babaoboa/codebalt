import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// match Bun's env loading: .env.local wins over .env
config({ path: ['.env.local', '.env'] });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
