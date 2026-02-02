-- ============================================================
-- SQL Script to Randomize User Themes and Safes
-- Run this in your Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  r RECORD;
  -- List of all available themes
  all_themes text[] := ARRAY['dracula', 'matrix', 'synthwave', 'amber', 'crimson'];
  
  -- Variables for logic
  new_unlocked text[];
  new_current text;
  theme_cursor text;
BEGIN
  -- Iterate over all users
  FOR r IN SELECT id, username FROM users LOOP
    
    -- 1. Generate Random Unlocked Themes
    -- Always include 'dracula', plus a random chance for others
    SELECT array_agg(t) INTO new_unlocked
    FROM unnest(all_themes) as t
    WHERE t = 'dracula' OR random() < 0.5; -- 50% chance to unlock other themes

    -- 2. Pick a Random Current Theme from the unlocked list
    new_current := new_unlocked[1 + floor(random() * array_length(new_unlocked, 1))::int];

    -- 3. Update the User
    UPDATE users 
    SET 
        unlocked_themes = new_unlocked,
        current_theme = new_current,
        updated_at = now()
    WHERE id = r.id;

    -- 4. Update the User's Safes
    -- Assign a random theme from their NEW unlocked list to each safe
    UPDATE safes
    SET theme = new_unlocked[1 + floor(random() * array_length(new_unlocked, 1))::int]
    WHERE user_id = r.id;

    RAISE NOTICE 'Updated User %: Unlocked %, Current %', r.username, new_unlocked, new_current;

  END LOOP;
END $$;
