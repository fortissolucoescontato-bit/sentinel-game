-- Enable UUID extension if needed (though we are using serial IDs here based on drizzle schema)
-- users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 1000,
    style_points INTEGER NOT NULL DEFAULT 0,
    tier VARCHAR(50) NOT NULL DEFAULT 'free',
    unlocked_themes TEXT[] NOT NULL DEFAULT ARRAY['dracula']::text[],
    current_theme VARCHAR(50) NOT NULL DEFAULT 'dracula',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- safes table
CREATE TABLE IF NOT EXISTS safes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    secret_word VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    theme VARCHAR(50) NOT NULL DEFAULT 'dracula',
    defense_level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- logs table
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    attacker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    defender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    safe_id INTEGER REFERENCES safes(id) ON DELETE SET NULL,
    input_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    credits_spent INTEGER NOT NULL DEFAULT 10,
    style_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- unlocked_safes table
CREATE TABLE IF NOT EXISTS unlocked_safes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    safe_id INTEGER NOT NULL REFERENCES safes(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP NOT NULL DEFAULT NOW()
);
