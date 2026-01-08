import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const isProduction = process.env.NODE_ENV === "production";

export const db = isProduction
  ? drizzleHttp(neon(process.env.DATABASE_URL), { schema })
  : drizzlePostgres(postgres(process.env.DATABASE_URL), { schema });

export type Database = typeof db;
