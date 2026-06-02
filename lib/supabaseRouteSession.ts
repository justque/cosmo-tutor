import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Returns a Supabase client bound to the current request's session cookie.
// Use this in API route handlers when you need RLS to apply as the signed-in
// parent (NOT the service role).
export function getRouteSupabase() {
  return createRouteHandlerClient({ cookies })
}
