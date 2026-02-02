import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function updateSchema() {
    console.log("🚀 Updating database schema...");

    try {
        // Add style_points to users
        console.log("📝 Adding style_points to users table...");
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS style_points INTEGER NOT NULL DEFAULT 0;
    `);
        console.log("✅ Users table updated");

        // Add style_score to logs
        console.log("📝 Adding style_score to logs table...");
        await pool.query(`
      ALTER TABLE logs 
      ADD COLUMN IF NOT EXISTS style_score INTEGER NOT NULL DEFAULT 0;
    `);
        console.log("✅ Logs table updated");

        console.log("\n✨ Schema update completed successfully!");

    } catch (error) {
        console.error("❌ Error during update:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

updateSchema();
