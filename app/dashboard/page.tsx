'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AppGuard } from '@/components/AppGuard'
import { SwitchProfileButton } from '@/components/SwitchProfileButton'
import { SetPinModal } from '@/components/picker/SetPinModal'

interface Child {
  id: string
  name: string
  age: number
  avatar_emoji: string
  pin_hash: string | null
  pin_locked_until: string | null
}

interface Star {
  size: number
  left: number
  top: number
  duration: number
  delay: number
}

function Starfield() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 90 }, () => ({
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }))
    setStars(generated)
  }, [])

  return (
    <div className="space-bg">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.left}%`,
            top: `${s.top}%`,
            ['--duration' as string]: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

const AVATAR_OPTIONS = ['🧒', '👦', '👧', '🧑‍🚀', '👽', '🤖', '🦄', '🐱']

export default function DashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')
  const [newChildEmoji, setNewChildEmoji] = useState('🧒')
  const [pinModalChild, setPinModalChild] = useState<Child | null>(null)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }
        const { data } = await supabase
          .from('children')
          .select('id, name, age, avatar_emoji, pin_hash, pin_locked_until')
          .eq('parent_id', user.id)
        if (data) setChildren(data)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch children:', err)
        setLoading(false)
      }
    }
    fetchChildren()
  }, [router])

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAddError('Not signed in — please sign in again.')
        return
      }
      const { data, error } = await supabase
        .from('children')
        .insert([{
          parent_id: user.id,
          name: newChildName,
          age: parseInt(newChildAge),
          avatar_emoji: newChildEmoji,
        }])
        .select('id, name, age, avatar_emoji, pin_hash, pin_locked_until')
      if (error) {
        console.error('Failed to add child:', error)
        setAddError(error.message)
        return
      }
      if (data && data[0]) {
        setChildren([...children, data[0]])
        setNewChildName('')
        setNewChildAge('')
        setNewChildEmoji('🧒')
        setShowAddForm(false)
      }
    } catch (err) {
      console.error('Failed to add child:', err)
      setAddError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <>
        <Starfield />
        <div className="min-h-screen flex items-center justify-center text-on-background">
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cosmo.png"
              alt="Cosmo"
              className="w-24 h-24 mx-auto mb-4 rounded-full"
              style={{ animation: 'float-y 2s ease-in-out infinite' }}
            />
            <p className="font-display font-bold">Loading mission control…</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <AppGuard kind="parent">
    <>
      <Starfield />

      {/* Top App Bar */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 h-16 bg-surface-container/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <span
            className="font-display font-extrabold text-xl md:text-2xl text-primary-container"
            style={{ textShadow: '0 2px 0 #506e00' }}
          >
            Cosmo&apos;s Adventure
          </span>
        </div>
        <div className="flex gap-2">
          <SwitchProfileButton />
          <button
            onClick={handleLogout}
            className="h-10 px-4 rounded-full bg-surface-container-highest text-on-surface font-display font-bold text-sm"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative pt-24 pb-16 min-h-screen w-full px-6 max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="font-display font-bold uppercase tracking-widest text-secondary-container text-xs mb-2">
            Mission Control
          </p>
          <h1
            className="font-display font-extrabold text-4xl md:text-5xl text-on-background"
            style={{ letterSpacing: '-0.02em' }}
          >
            Your Explorers 🚀
          </h1>
          <p className="mt-3 text-on-surface-variant max-w-xl mx-auto">
            Pick an explorer to launch into their cosmic adventure, or add a new explorer to the crew.
          </p>
        </div>

        {children.some((c) => !c.pin_hash) && (
          <div className="glass-panel rounded-2xl border-2 border-tertiary-container/50 p-4 mb-4 text-on-background">
            Set a PIN for each child so they can play on their own.
          </div>
        )}

        {/* Cadet Grid */}
        {children.length === 0 && !showAddForm ? (
          <div className="bg-surface-container/60 backdrop-blur-md rounded-2xl p-10 text-center border border-white/10 shadow-xl">
            <div className="text-6xl mb-4">🛰️</div>
            <p className="font-display font-bold text-xl mb-2">No cadets aboard yet</p>
            <p className="text-on-surface-variant mb-6">Add your first space explorer to begin the journey.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="chunky-button bg-primary-container text-on-primary-container font-display font-bold px-6 py-3 rounded-lg border-2 border-white/20"
              style={{ ['--chunky-shadow' as string]: '#374e00' }}
            >
              + Add First Explorer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {children.map((child) => (
              <div
                key={child.id}
                className="group relative bg-surface-container/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl hover:border-secondary-container/60 transition-all"
              >
                {/* Glowing avatar */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-secondary-container/30 blur-xl group-hover:bg-secondary-container/50 transition" />
                  <div className="relative w-full h-full rounded-full bg-surface-container-highest border-2 border-white/20 flex items-center justify-center text-4xl">
                    {child.avatar_emoji}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-center text-on-background">
                  {child.name}
                </h3>
                <p className="text-center text-on-surface-variant text-sm mb-5">
                  Age {child.age} 
                </p>
                <button
                  onClick={() => router.push(`/adventure?childId=${child.id}`)}
                  className="chunky-button w-full bg-primary-container text-on-primary-container font-display font-bold px-4 py-3 rounded-lg border-2 border-white/20 flex items-center justify-center gap-2"
                  style={{ ['--chunky-shadow' as string]: '#374e00' }}
                >
                  🚀 Launch Adventure
                </button>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setPinModalChild(child)}
                    className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-display font-bold"
                  >
                    {child.pin_hash ? 'Change PIN' : 'Set PIN'}
                  </button>
                  {child.pin_locked_until &&
                    new Date(child.pin_locked_until).getTime() > Date.now() && (
                      <button
                        onClick={() => setPinModalChild(child)}
                        className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-display font-bold"
                      >
                        Reset PIN
                      </button>
                    )}
                </div>
              </div>
            ))}

            {/* Add card */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="rounded-2xl border-2 border-dashed border-white/20 hover:border-secondary-container/60 hover:bg-surface-container/30 transition-all p-6 flex flex-col items-center justify-center min-h-[260px] text-on-surface-variant hover:text-on-background"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container-highest border-2 border-white/10 flex items-center justify-center text-3xl mb-3">
                  +
                </div>
                <span className="font-display font-bold">Add Explorer</span>
              </button>
            )}
          </div>
        )}

        {/* Add child form */}
        {showAddForm && (
          <div className="mt-8 bg-surface-container/70 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-extrabold text-2xl">Recruit a New Cadet</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-9 h-9 rounded-full bg-surface-container-highest hover:bg-surface-bright text-on-surface-variant flex items-center justify-center text-lg"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddChild} className="space-y-5">
              <div>
                <label className="block font-display font-bold text-sm text-on-surface-variant mb-2">
                  Explorer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stella"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-white/10 rounded-lg focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/40 text-on-background placeholder:text-on-surface-variant/50"
                  required
                />
              </div>

              <div>
                <label className="block font-display font-bold text-sm text-on-surface-variant mb-2">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="5–8 recommended"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  min="3"
                  max="13"
                  className="w-full px-4 py-3 bg-surface-container-low border border-white/10 rounded-lg focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/40 text-on-background placeholder:text-on-surface-variant/50"
                  required
                />
              </div>

              <div>
                <label className="block font-display font-bold text-sm text-on-surface-variant mb-2">
                  Choose an Avatar
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setNewChildEmoji(emoji)}
                      className={`h-12 rounded-lg text-2xl flex items-center justify-center border-2 transition-all ${
                        newChildEmoji === emoji
                          ? 'bg-primary-container/20 border-primary-container'
                          : 'bg-surface-container-low border-white/10 hover:border-white/30'
                      }`}
                      aria-label={`Avatar ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {addError && (
                <p className="text-sm text-rose-400 font-display font-bold text-center">
                  {addError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-surface-container-highest text-on-surface font-display font-bold hover:bg-surface-bright transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="chunky-button flex-1 bg-primary-container text-on-primary-container font-display font-bold px-6 py-3 rounded-lg border-2 border-white/20"
                  style={{ ['--chunky-shadow' as string]: '#374e00' }}
                >
                  🚀 Add Explorer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* COPPA Notice */}
        <div className="mt-10 p-4 bg-surface-container/40 backdrop-blur-md border border-white/5 rounded-xl text-xs text-on-surface-variant">
          <strong className="text-on-background font-display">Privacy Notice:</strong> Cosmo is designed for children under 13. All data is collected under parental consent per COPPA regulations. We do not share personal information with third parties.
        </div>
      </main>
      {pinModalChild && (
        <SetPinModal
          childId={pinModalChild.id}
          childName={pinModalChild.name}
          onCancel={() => setPinModalChild(null)}
          onSuccess={async () => {
            setPinModalChild(null)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data } = await supabase
              .from('children')
              .select('id, name, age, avatar_emoji, pin_hash, pin_locked_until')
              .eq('parent_id', user.id)
            if (data) setChildren(data)
          }}
        />
      )}
    </>
    </AppGuard>
  )
}
