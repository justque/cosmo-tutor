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
    const p: ActiveProfile = { kind: 'parent', verifiedUntil: 1234567 }
    saveActiveProfile(p)
    expect(loadActiveProfile()).toEqual(p)
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

  it('isParentVerified is true only for unexpired parent profile', () => {
    expect(isParentVerified(null, 1000)).toBe(false)
    expect(isParentVerified({ kind: 'kid', childId: 'a' }, 1000)).toBe(false)
    expect(
      isParentVerified({ kind: 'parent', verifiedUntil: 2000 }, 1000)
    ).toBe(true)
    expect(
      isParentVerified({ kind: 'parent', verifiedUntil: 500 }, 1000)
    ).toBe(false)
  })
})
