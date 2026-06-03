import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadActiveProfile,
  saveActiveProfile,
  clearActiveProfile,
  isParentVerified,
  type ActiveProfile,
} from '@/lib/activeProfile'

beforeEach(() => {
  localStorage.clear()
})

describe('activeProfile', () => {
  it('returns null when nothing is stored', () => {
    expect(loadActiveProfile()).toBeNull()
  })

  it('round-trips a kid profile', () => {
    const p: ActiveProfile = { kind: 'kid', childId: 'abc' }
    saveActiveProfile(p)
    expect(loadActiveProfile()).toEqual(p)
  })

  it('round-trips a parent profile', () => {
    const p: ActiveProfile = { kind: 'parent' }
    saveActiveProfile(p)
    expect(loadActiveProfile()).toEqual(p)
  })

  it('accepts a legacy parent profile that still carries verifiedUntil', () => {
    localStorage.setItem(
      'activeProfile',
      JSON.stringify({ kind: 'parent', verifiedUntil: 1234567 })
    )
    expect(loadActiveProfile()).toEqual({ kind: 'parent', verifiedUntil: 1234567 })
  })

  it('clear removes the value', () => {
    saveActiveProfile({ kind: 'kid', childId: 'abc' })
    clearActiveProfile()
    expect(loadActiveProfile()).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    localStorage.setItem('activeProfile', '{not-json')
    expect(loadActiveProfile()).toBeNull()
  })

  it('isParentVerified is true for any parent profile, false otherwise', () => {
    expect(isParentVerified(null)).toBe(false)
    expect(isParentVerified({ kind: 'kid', childId: 'a' })).toBe(false)
    expect(isParentVerified({ kind: 'parent' })).toBe(true)
    expect(isParentVerified({ kind: 'parent', verifiedUntil: 1 })).toBe(true)
  })
})
