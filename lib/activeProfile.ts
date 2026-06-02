export type ActiveProfile =
  | { kind: 'kid'; childId: string }
  | { kind: 'parent'; verifiedUntil: number }

const KEY = 'activeProfile'

export function loadActiveProfile(): ActiveProfile | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as ActiveProfile
    if (parsed.kind === 'kid' && typeof parsed.childId === 'string') return parsed
    if (parsed.kind === 'parent' && typeof parsed.verifiedUntil === 'number') return parsed
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

export function isParentVerified(p: ActiveProfile | null, now: number): boolean {
  return p?.kind === 'parent' && p.verifiedUntil > now
}
