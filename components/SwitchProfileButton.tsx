'use client'

import { useRouter } from 'next/navigation'
import { useActiveProfile } from '@/lib/useActiveProfile'

interface Props {
  className?: string
}

export function SwitchProfileButton({ className }: Props) {
  const router = useRouter()
  const { clear } = useActiveProfile()
  return (
    <button
      onClick={() => {
        clear()
        router.replace('/picker')
      }}
      className={
        className ??
        'h-10 px-4 rounded-full bg-surface-container-highest text-on-surface hover:scale-105 transition-transform active:translate-y-0.5 font-display font-bold text-sm'
      }
    >
    Switch profile
    </button>
  )
}
