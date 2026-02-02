-- Upgrade V2: Game Modes & Enhanced Features

-- 1. Add mode column to Safes (default 'classic')
ALTER TABLE safes ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT 'classic';
-- Modes: 'classic' (Hidden password), 'injection' (Visible target phrase)

-- 2. Update create_safe_transaction to accept mode
DROP FUNCTION IF EXISTS create_safe_transaction(bigint, text, text, integer, integer, text);
CREATE OR REPLACE FUNCTION create_safe_transaction(
  p_user_id bigint,
  p_secret_word text,
  p_system_prompt text,
  p_defense_level integer,
  p_cost integer,
  p_theme text,
  p_mode text DEFAULT 'classic'
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_credits integer;
  v_safe_id bigint;
BEGIN
  SELECT credits INTO v_credits FROM users WHERE id = p_user_id;

  IF v_credits < p_cost THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Deduct
  UPDATE users 
  SET credits = credits - p_cost, updated_at = now()
  WHERE id = p_user_id;

  -- Insert Safe
  INSERT INTO safes (user_id, secret_word, system_prompt, defense_level, theme, mode, created_at, updated_at)
  VALUES (p_user_id, p_secret_word, p_system_prompt, p_defense_level, p_theme, p_mode, now(), now())
  RETURNING id INTO v_safe_id;

  RETURN json_build_object('success', true, 'safe_id', v_safe_id);
END;
$$;


-- 3. Update get_available_safes to return mode
DROP FUNCTION IF EXISTS get_available_safes(integer, integer);

CREATE OR REPLACE FUNCTION get_available_safes(p_user_id integer, p_limit integer)
RETURNS TABLE (
  id integer,
  user_id integer,
  secret_word text,
  system_prompt text,
  theme text,
  defense_level integer,
  mode text,  -- New column
  created_at timestamptz,
  updated_at timestamptz,
  owner_id integer,
  owner_username text,
  owner_tier text,
  is_unlocked boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id, 
    s.user_id, 
    s.secret_word::text,
    s.system_prompt::text,
    s.theme::text,
    s.defense_level, 
    s.mode::text, -- Cast to text
    s.created_at::timestamptz,
    s.updated_at::timestamptz,
    u.id AS owner_id,
    u.username::text AS owner_username,
    u.tier::text AS owner_tier,
    (EXISTS (SELECT 1 FROM unlocked_safes us WHERE us.safe_id = s.id AND us.user_id = p_user_id)) AS is_unlocked
  FROM safes s
  JOIN users u ON s.user_id = u.id
  WHERE 
    s.user_id <> p_user_id
    AND (
        NOT EXISTS (SELECT 1 FROM unlocked_safes us WHERE us.safe_id = s.id AND us.user_id = p_user_id)
        OR
        u.tier = 'system'
    )
  ORDER BY s.defense_level DESC
  LIMIT p_limit;
END;
$$;
