import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { saveActiveProfile, clearActiveProfile } from '@/lib/activeProfile'

beforeEach(() => {
  localStorage.clear()
})

describe('useActiveProfile', () => {
  it('initially reads from localStorage', () => {
    saveActiveProfile({ kind: 'kid', childId: 'emma' })
    const { result } = renderHook(() => useActiveProfile())
    expect(result.current.profile).toEqual({ kind: 'kid', childId: 'emma' })
  })

  it('null when nothing stored', () => {
    const { result } = renderHook(() => useActiveProfile())
    expect(result.current.profile).toBeNull()
  })

  it('setProfile writes to localStorage and updates state', () => {
    const { result } = renderHook(() => useActiveProfile())
    act(() => {
      result.current.setProfile({ kind: 'kid', childId: 'noah' })
    })
    expect(result.current.profile).toEqual({ kind: 'kid', childId: 'noah' })
    expect(localStorage.getItem('activeProfile')).toContain('noah')
  })

  it('clear removes value and updates state', () => {
    saveActiveProfile({ kind: 'kid', childId: 'emma' })
    const { result } = renderHook(() => useActiveProfile())
    act(() => {
      result.current.clear()
    })
    expect(result.current.profile).toBeNull()
    expect(localStorage.getItem('activeProfile')).toBeNull()
  })

  it('reacts to storage events from other tabs', () => {
    const { result } = renderHook(() => useActiveProfile())
    act(() => {
      saveActiveProfile({ kind: 'parent', verifiedUntil: 9999 })
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'activeProfile',
          newValue: JSON.stringify({ kind: 'parent', verifiedUntil: 9999 }),
        })
      )
    })
    expect(result.current.profile).toEqual({ kind: 'parent', verifiedUntil: 9999 })
  })
})
