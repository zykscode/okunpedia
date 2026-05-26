import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import * as schema from '@/models/Schema';

// Need a database for production? Check out https://get.neon.com/BMFYNtx
// Tested and compatible with Next.js Boilerplate
export const createDbConnection = () => {
  if (!Env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is missing. Please configure it in your environment settings (e.g. Vercel Project Settings).',
    );
  }

  let connectionString = Env.DATABASE_URL;
  if (connectionString.includes('sslmode=require') && !connectionString.includes('uselibpqcompat')) {
    connectionString = connectionString.replace('sslmode=require', 'sslmode=verify-full');
  }

  const pool = new Pool({
    connectionString,
  });

  pool.on('error', (error) => {
    logger.error(`Database pool error: ${error.message}`);
  });

  return drizzle({
    client: pool,
    schema,
  });
};
