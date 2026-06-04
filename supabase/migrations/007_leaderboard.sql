-- Leaderboard RPC: returns top-20 children by completion count.
-- SECURITY DEFINER bypasses RLS so children can see each other's scores.
-- Only exposes: child id, first name, completed location ids.
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE(child_id uuid, child_name text, completed_location_ids text[])
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.name,
    COALESCE(jp.completed_location_ids, '{}')
  FROM children c
  LEFT JOIN journey_progress jp ON jp.child_id = c.id
  ORDER BY COALESCE(array_length(jp.completed_location_ids, 1), 0) DESC
  LIMIT 20;
$$;
