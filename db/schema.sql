-- ==========================================
-- Sentinel Game Schema
-- Run this to create the tables in Supabase
-- ==========================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 1000,
    style_points INTEGER NOT NULL DEFAULT 0,
    tier VARCHAR(50) NOT NULL DEFAULT 'free',
    unlocked_themes TEXT[] NOT NULL DEFAULT ARRAY['dracula']::TEXT[],
    current_theme VARCHAR(50) NOT NULL DEFAULT 'dracula',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Safes Table
CREATE TABLE IF NOT EXISTS safes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    secret_word VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    theme VARCHAR(50) NOT NULL DEFAULT 'dracula',
    defense_level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Logs Table
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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Unlocked Safes (Many-to-Many)
CREATE TABLE IF NOT EXISTS unlocked_safes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    safe_id INTEGER NOT NULL REFERENCES safes(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, safe_id) -- Prevent duplicate unlocks
);

-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE safes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_safes ENABLE ROW LEVEL SECURITY;

-- Note: The application mainly uses the Service Role Key for critical actions (RPCs),
-- but for read operations using the Anon Key, we need policies.

-- USERS: Public read (for leaderboards/profiles), Self update
CREATE POLICY "Public profiles are viewable by everyone" ON users
    FOR SELECT USING (true);

-- SAFES: Public read (for listing targets), Self update
CREATE POLICY "Safes are viewable by everyone" ON safes
    FOR SELECT USING (true);

-- LOGS: Users can see their own attacks or defense logs
CREATE POLICY "Users can see logs related to them" ON logs
    FOR SELECT USING (
        auth.uid()::text = (SELECT clerk_id FROM users WHERE id = attacker_id) OR
        auth.uid()::text = (SELECT clerk_id FROM users WHERE id = defender_id)
    );

-- UNLOCKED SAFES: Public read (to see who unlocked what)
CREATE POLICY "Unlocked safes are viewable by everyone" ON unlocked_safes
    FOR SELECT USING (true);
