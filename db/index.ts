import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Create the drizzle instance with schema
export const db = drizzle(pool, { schema });

// Export schema for convenience
export { schema };

// Type-safe database instance
export type Database = typeof db;
