import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables from .env
config({ path: '.env' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env.local');
}

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});