'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  loadActiveProfile,
  saveActiveProfile,
  clearActiveProfile,
  type ActiveProfile,
} from './activeProfile'

export function useActiveProfile() {
  const [profile, setProfileState] = useState<ActiveProfile | null>(() =>
    loadActiveProfile()
  )

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'activeProfile') return
      setProfileState(loadActiveProfile())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setProfile = useCallback((p: ActiveProfile) => {
    saveActiveProfile(p)
    setProfileState(p)
  }, [])

  const clear = useCallback(() => {
    clearActiveProfile()
    setProfileState(null)
  }, [])

  return { profile, setProfile, clear }
}
