import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is missing');
}

// Create the Neon serverless HTTP connection client
const sql = neon(process.env.DATABASE_URL);

// Pass the client and full schema to Drizzle for full type safety
export const db = drizzle(sql, { schema });