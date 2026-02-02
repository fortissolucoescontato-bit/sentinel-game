-- ==========================================
-- Supabase RPC Migrations for Sentinel Game
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. register_attack
-- Handles the entire attack logic atomically: 
-- checks balance, deducts cost, awards prizes, logs the attack, and unlocks the safe if successful.
create or replace function register_attack(
  p_attacker_id bigint,
  p_defender_id bigint,
  p_safe_id bigint,
  p_success boolean,
  p_credits_spent integer,
  p_reward integer,
  p_style_points_awarded integer,
  p_input_prompt text,
  p_ai_response text,
  p_style_score integer
)
returns json
language plpgsql
as $$
declare
  v_attacker_credits integer;
  v_attacker_style_points integer;
  v_new_credits integer;
  v_new_style_points integer;
begin
  -- 1. Get current attacker stats
  select credits, style_points into v_attacker_credits, v_attacker_style_points
  from users
  where id = p_attacker_id;

  if not found then
    raise exception 'Attacker not found';
  end if;

  -- 2. Check balance
  if v_attacker_credits < p_credits_spent then
    raise exception 'Insufficient credits';
  end if;

  -- 3. Calculate new values
  v_new_credits := v_attacker_credits - p_credits_spent;
  v_new_style_points := v_attacker_style_points;

  if p_success then
    v_new_credits := v_new_credits + p_reward;
    v_new_style_points := v_new_style_points + p_style_points_awarded;
  end if;

  -- 4. Update attacker
  update users
  set 
    credits = v_new_credits,
    style_points = v_new_style_points,
    updated_at = now()
  where id = p_attacker_id;

  -- 5. Unlock safe if successful and not already unlocked
  if p_success then
    insert into unlocked_safes (user_id, safe_id, unlocked_at)
    values (p_attacker_id, p_safe_id, now())
    on conflict (user_id, safe_id) do nothing;
  end if;

  -- 6. Log the attack
  insert into logs (
    attacker_id, 
    defender_id, 
    safe_id, 
    input_prompt, 
    ai_response, 
    success, 
    credits_spent, 
    style_score, 
    created_at
  )
  values (
    p_attacker_id,
    p_defender_id,
    p_safe_id,
    p_input_prompt,
    p_ai_response,
    p_success,
    p_credits_spent,
    p_style_score,
    now()
  );

  return json_build_object(
    'success', true,
    'new_credits', v_new_credits,
    'new_style_points', v_new_style_points
  );
end;
$$;


-- 2. buy_theme
-- Atomically checks ownership and balance, then deducts funds and appends the theme.
create or replace function buy_theme(
  p_user_id bigint,
  p_theme_id text,
  p_cost_credits integer,
  p_cost_style_points integer
)
returns json
language plpgsql
as $$
declare
  v_credits integer;
  v_style_points integer;
  v_unlocked_themes text[];
begin
  select credits, style_points, unlocked_themes 
  into v_credits, v_style_points, v_unlocked_themes
  from users
  where id = p_user_id;

  if not found then
    raise exception 'User not found';
  end if;

  -- Check ownership
  if p_theme_id = any(v_unlocked_themes) then
    raise exception 'Theme already owned';
  end if;

  -- Check balance
  if v_credits < p_cost_credits then
    raise exception 'Insufficient credits';
  end if;
  if v_style_points < p_cost_style_points then
    raise exception 'Insufficient style points';
  end if;

  -- Update
  update users
  set
    credits = v_credits - p_cost_credits,
    style_points = v_style_points - p_cost_style_points,
    unlocked_themes = array_append(unlocked_themes, p_theme_id),
    updated_at = now()
  where id = p_user_id;

  return json_build_object('success', true);
end;
$$;


-- 3. create_safe_transaction
-- Deducts credits and creates the safe atomically.
create or replace function create_safe_transaction(
  p_user_id bigint,
  p_secret_word text,
  p_system_prompt text,
  p_defense_level integer,
  p_cost integer,
  p_theme text
)
returns json
language plpgsql
as $$
declare
  v_credits integer;
  v_safe_id bigint;
begin
  select credits into v_credits from users where id = p_user_id;

  if v_credits < p_cost then
    raise exception 'Insufficient credits';
  end if;

  -- Deduct
  update users 
  set credits = credits - p_cost, updated_at = now()
  where id = p_user_id;

  -- Insert Safe
  insert into safes (user_id, secret_word, system_prompt, defense_level, theme, created_at, updated_at)
  values (p_user_id, p_secret_word, p_system_prompt, p_defense_level, p_theme, now(), now())
  returning id into v_safe_id;

  return json_build_object('success', true, 'safe_id', v_safe_id);
end;
$$;


-- 4. get_top_defenders
-- Efficient server-side aggregation for the leaderboard.
create or replace function get_top_defenders(p_limit integer)
returns table (
  id bigint,
  username text,
  tier text,
  blocks bigint
)
language plpgsql
as $$
begin
  return query
  select 
    u.id,
    u.username,
    u.tier,
    count(l.id) as blocks
  from logs l
  join users u on l.defender_id = u.id
  where l.success = false
  group by u.id, u.username, u.tier
  order by blocks desc
  limit p_limit;
end;
$$;


-- 5. get_available_safes
-- Returns safes that are NOT owned by the user AND NOT already unlocked by the user.
create or replace function get_available_safes(p_user_id bigint, p_limit integer)
returns setof safes
language plpgsql
as $$
begin
  return query
  select s.*
  from safes s
  where s.user_id <> p_user_id
  and not exists (
    select 1 from unlocked_safes us 
    where us.safe_id = s.id 
    and us.user_id = p_user_id
  )
  order by s.defense_level desc
  limit p_limit;
end;
$$;

-- 6. get_user_rank
-- Calculates the user's rank based on credits (wealth).
create or replace function get_user_rank(p_user_id bigint)
returns bigint
language plpgsql
as $$
declare
  v_user_credits integer;
  v_rank bigint;
begin
  -- Get user credits
  select credits into v_user_credits from users where id = p_user_id;

  if not found then
    return 0;
  end if;

  -- Count users with more credits
  select count(*) + 1 into v_rank
  from users
  where credits > v_user_credits;

  return v_rank;
end;
$$;
