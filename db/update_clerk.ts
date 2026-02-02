import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function updateSchemaClerk() {
    console.log("🚀 Updating database schema for Clerk...");

    try {
        // Add clerk_id to users
        console.log("📝 Adding clerk_id to users table...");
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255) UNIQUE;
    `);
        console.log("✅ Users table updated with clerk_id");

        console.log("\n✨ Schema update completed successfully!");

    } catch (error) {
        console.error("❌ Error during update:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

updateSchemaClerk();
