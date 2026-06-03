'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { isParentVerified } from '@/lib/activeProfile'

interface Props {
  kind: 'kid' | 'parent'
  childId?: string
  children: React.ReactNode
}

export function AppGuard({ kind, childId, children }: Props) {
  const router = useRouter()
  const { profile } = useActiveProfile()

  useEffect(() => {
    if (kind === 'kid') {
      if (profile?.kind !== 'kid' || (childId && profile.childId !== childId)) {
        router.replace('/picker')
      }
    } else {
      if (!isParentVerified(profile)) {
        router.replace('/picker')
      }
    }
  }, [profile, kind, childId, router])

  if (kind === 'kid') {
    const ok = profile?.kind === 'kid' && (!childId || profile.childId === childId)
    if (!ok) return null
  } else {
    if (!isParentVerified(profile)) return null
  }
  return <>{children}</>
}
