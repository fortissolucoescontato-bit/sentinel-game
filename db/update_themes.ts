import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function updateSchemaThemes() {
    console.log("🚀 Updating database schema for Themes...");

    try {
        // Add current_theme
        console.log("📝 Adding current_theme column...");
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS current_theme VARCHAR(50) NOT NULL DEFAULT 'dracula';
    `);

        // Add unlocked_themes (Postgres Array)
        console.log("📝 Adding unlocked_themes column...");
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS unlocked_themes TEXT[] NOT NULL DEFAULT ARRAY['dracula'];
    `);

        console.log("✅ Users table updated with Theme columns");
        console.log("\n✨ Schema update completed successfully!");

    } catch (error) {
        console.error("❌ Error during update:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

updateSchemaThemes();
