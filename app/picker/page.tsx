'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { ProfileTile } from '@/components/picker/ProfileTile'
import { PinPad } from '@/components/picker/PinPad'
import { ParentPasswordModal } from '@/components/picker/ParentPasswordModal'
import { SetPinModal } from '@/components/picker/SetPinModal'

interface Child {
  id: string
  name: string
  age: number | null
  avatar_emoji: string
  pin_hash: string | null
}

type Modal =
  | { kind: 'kid-pin'; child: Child; shake: boolean; lockedUntil: number | null }
  | { kind: 'parent-password' }
  | { kind: 'set-pin'; child: Child }
  | { kind: 'set-pin-needs-parent'; child: Child }
  | null

const PARENT_VERIFY_TTL_MS = 30 * 60 * 1000

export default function PickerPage() {
  const router = useRouter()
  const { setProfile } = useActiveProfile()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/login')
        return
      }
      const { data } = await supabase
        .from('children')
        .select('id, name, age, avatar_emoji, pin_hash')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true })
      setChildren(data ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  const onPickChild = (child: Child) => {
    if (!child.pin_hash) {
      setModal({ kind: 'set-pin-needs-parent', child })
      return
    }
    setModal({ kind: 'kid-pin', child, shake: false, lockedUntil: null })
  }

  const onPinEntered = async (pin: string) => {
    if (modal?.kind !== 'kid-pin') return
    const child = modal.child
    const res = await fetch('/api/child-pin/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ childId: child.id, pin }),
    })
    const json = await res.json()
    if (json.ok) {
      setProfile({ kind: 'kid', childId: child.id })
      router.replace(`/adventure?childId=${child.id}`)
    } else if (json.lockedUntil) {
      setModal({
        kind: 'kid-pin',
        child,
        shake: false,
        lockedUntil: new Date(json.lockedUntil).getTime(),
      })
    } else {
      setModal({ kind: 'kid-pin', child, shake: true, lockedUntil: null })
      setTimeout(() => {
        setModal((m) => (m?.kind === 'kid-pin' ? { ...m, shake: false } : m))
      }, 600)
    }
  }

  const onParentVerified = () => {
    setProfile({
      kind: 'parent',
      verifiedUntil: Date.now() + PARENT_VERIFY_TTL_MS,
    })
    if (modal?.kind === 'set-pin-needs-parent') {
      const c = modal.child
      setModal({ kind: 'set-pin', child: c })
    } else {
      router.replace('/dashboard')
    }
  }

  const onPinSet = async () => {
    if (modal?.kind !== 'set-pin') return
    const childId = modal.child.id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('children')
      .select('id, name, age, avatar_emoji, pin_hash')
      .eq('parent_id', user.id)
    setChildren(data ?? [])
    const updated = data?.find((c) => c.id === childId)
    if (updated) {
      setModal({ kind: 'kid-pin', child: updated, shake: false, lockedUntil: null })
    } else {
      setModal(null)
    }
  }

  const onSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-on-background">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-extrabold text-3xl md:text-4xl text-primary-container"
          style={{ textShadow: '0 3px 0 #506e00' }}
        >
          Who's playing?
        </motion.h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {children.map((c) => (
            <ProfileTile
              key={c.id}
              emoji={c.avatar_emoji}
              name={c.name}
              subtitle={c.pin_hash ? 'Tap to play' : undefined}
              badge={c.pin_hash ? undefined : 'PIN needed'}
              onClick={() => onPickChild(c)}
            />
          ))}
          <ProfileTile
            emoji="🧑‍🚀"
            name="Parent"
            subtitle="Dashboard"
            onClick={() => setModal({ kind: 'parent-password' })}
          />
        </div>

        <button
          onClick={onSignOut}
          className="text-on-surface-variant text-xs underline-offset-4 underline"
        >
          Sign out of family
        </button>
      </div>

      {modal?.kind === 'kid-pin' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl border-2 border-white/15 p-6 max-w-sm w-full space-y-4">
            <h2 className="font-display font-extrabold text-on-background text-xl text-center">
              {modal.child.name}'s PIN
            </h2>
            <PinPad
              key={String(modal.shake) + String(modal.lockedUntil)}
              onComplete={onPinEntered}
              shake={modal.shake}
              lockedUntil={modal.lockedUntil}
            />
            <div className="text-center">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-display font-bold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {modal?.kind === 'parent-password' && (
        <ParentPasswordModal
          onCancel={() => setModal(null)}
          onSuccess={onParentVerified}
        />
      )}

      {modal?.kind === 'set-pin-needs-parent' && (
        <ParentPasswordModal
          onCancel={() => setModal(null)}
          onSuccess={onParentVerified}
        />
      )}

      {modal?.kind === 'set-pin' && (
        <SetPinModal
          childId={modal.child.id}
          childName={modal.child.name}
          onCancel={() => setModal(null)}
          onSuccess={onPinSet}
        />
      )}
    </div>
  )
}
