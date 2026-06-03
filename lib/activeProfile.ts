export type ActiveProfile =
  | { kind: 'kid'; childId: string }
  | { kind: 'parent'; verifiedUntil?: number }

const KEY = 'activeProfile'

export function loadActiveProfile(): ActiveProfile | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as ActiveProfile
    if (parsed.kind === 'kid' && typeof parsed.childId === 'string') return parsed
    if (parsed.kind === 'parent') return parsed
    return null
  } catch {
    return null
  }
}

export function saveActiveProfile(p: ActiveProfile): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(p))
}

export function clearActiveProfile(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY)
}

// The parent's Supabase session is already the auth source of truth; we no
// longer require a separate re-verify password gate. A parent profile is
// considered "verified" only if it has a non-expired verifiedUntil timestamp.
export function isParentVerified(p: ActiveProfile | null): boolean {
  return p?.kind === 'parent' && (p.verifiedUntil ?? 0) > Date.now()
}
