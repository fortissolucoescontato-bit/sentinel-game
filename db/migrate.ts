import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    console.log("🚀 Starting database migration...");

    try {
        // Create users table
        console.log("📝 Creating users table...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(100) NOT NULL UNIQUE,
        credits INTEGER NOT NULL DEFAULT 1000,
        tier VARCHAR(50) NOT NULL DEFAULT 'free',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
        console.log("✅ Users table created");

        // Create safes table
        console.log("📝 Creating safes table...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS safes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        secret_word VARCHAR(255) NOT NULL,
        system_prompt TEXT NOT NULL,
        defense_level INTEGER NOT NULL DEFAULT 1,
        is_cracked BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
        console.log("✅ Safes table created");

        // Create logs table
        console.log("📝 Creating logs table...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        attacker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        defender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        safe_id INTEGER REFERENCES safes(id) ON DELETE SET NULL,
        input_prompt TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        success BOOLEAN NOT NULL DEFAULT false,
        credits_spent INTEGER NOT NULL DEFAULT 10,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
        console.log("✅ Logs table created");

        console.log("\n✨ Migration completed successfully!");
        console.log("\n📊 Tables created:");
        console.log("   - users");
        console.log("   - safes");
        console.log("   - logs");

    } catch (error) {
        console.error("❌ Error during migration:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

migrate();
