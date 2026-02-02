-- Update get_available_safes to support Replayability of System Safes
-- FIXED v3: Explicitly casting ALL columns to ensure strict type matching (Text + Timestamps)
DROP FUNCTION IF EXISTS get_available_safes(bigint, integer);
DROP FUNCTION IF EXISTS get_available_safes(integer, integer);

create or replace function get_available_safes(p_user_id integer, p_limit integer)
returns table (
  id integer,
  user_id integer,
  secret_word text,
  system_prompt text,
  theme text,
  defense_level integer,
  created_at timestamptz,
  updated_at timestamptz,
  owner_id integer,
  owner_username text,
  owner_tier text,
  is_unlocked boolean
)
language plpgsql
as $$
begin
  return query
  select 
    s.id, 
    s.user_id, 
    s.secret_word::text,        -- Cast to text
    s.system_prompt::text,      -- Cast to text
    s.theme::text,              -- Cast to text
    s.defense_level, 
    s.created_at::timestamptz,  -- Cast to timestamptz (Fixes timestamp mismatch)
    s.updated_at::timestamptz,  -- Cast to timestamptz
    u.id as owner_id,
    u.username::text as owner_username, -- Cast to text
    u.tier::text as owner_tier,         -- Cast to text
    (exists (select 1 from unlocked_safes us where us.safe_id = s.id and us.user_id = p_user_id)) as is_unlocked
  from safes s
  join users u on s.user_id = u.id
  where 
    s.user_id <> p_user_id -- Not my own
    and (
        -- Show if NOT unlocked
        not exists (select 1 from unlocked_safes us where us.safe_id = s.id and us.user_id = p_user_id)
        OR
        -- OR Show if it IS unlocked BUT it's a System safe (Replay allowed)
        u.tier = 'system'
    )
  order by s.defense_level desc
  limit p_limit;
end;
$$;
