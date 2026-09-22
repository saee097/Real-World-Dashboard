import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./db-postgres-schema";

const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> | undefined };

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({ connectionString: url });
}

let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export const db =
  globalForDb.db ??
  drizzle(getPool(), {
    schema,
  });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
