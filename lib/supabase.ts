import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Browser client — stores session in cookies so that server route handlers
// (see lib/supabaseRouteSession.ts) can read the same session.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Service-role client for trusted server-side operations that need to bypass
// RLS. Do NOT use this in code paths reachable from the browser.
export const getSupabaseServerClient = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  )
}
