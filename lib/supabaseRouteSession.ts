import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Returns a Supabase client bound to the current request's session cookie.
// Use this in API route handlers when you need RLS to apply as the signed-in
// parent (NOT the service role).
export async function getRouteSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Read-only cookie store in some contexts; safe to ignore.
          }
        },
      },
    }
  )
}
