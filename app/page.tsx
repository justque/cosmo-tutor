'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
    setStars(
      Array.from({ length: 110 }, () => ({
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      }))
    )
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

export default function Home() {
  const router = useRouter()
  const [cadetName, setCadetName] = useState<string>('Cadet')

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.replace('/picker')
    }
    check()
  }, [router])

  useEffect(() => {
    const loadCadetName = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('children')
        .select('name')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
      if (data && data[0]?.name) setCadetName(data[0].name)
    }
    loadCadetName()
  }, [])

  const handleGetStarted = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    router.push(user ? '/adventure' : '/auth/signup')
  }

  return (
    <>
      <Starfield />

      {/* Hero */}
      <main className="relative z-10 pt-16 pb-20 px-6 flex flex-col items-center text-center max-w-6xl mx-auto">
        <div
          className="text-[110px] md:text-[140px] leading-none mb-2"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(183,247,0,0.35))',
            animation: 'float-y 4s ease-in-out infinite',
          }}
        >
          🚀
        </div>

        <p className="font-display font-bold uppercase tracking-[0.25em] text-secondary-container text-xs mb-3">
          A science adventure for ages 5–8
        </p>

        <h1
          className="font-display font-extrabold text-5xl md:text-7xl leading-tight text-primary-container"
          style={{ textShadow: '0 4px 0 #506e00', letterSpacing: '-0.02em' }}
        >
          Cosmo&apos;s Science
          <br />
          Adventure
        </h1>

        <p className="mt-6 text-lg md:text-xl text-on-surface max-w-2xl">
          Blast off with Cosmo and explore the wonders of science — one mission at a time. Planets, animals, weather, the human body, and plants await your young space explorer.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={handleGetStarted}
            className="chunky-button bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-display font-extrabold text-lg border-2 border-white/20 flex items-center gap-3 hover:scale-105 transition-transform"
            style={{ ['--chunky-shadow' as string]: '#374e00' }}
          >
            🚀 Start the Adventure
          </button>
          <button
            onClick={() => router.push('/auth/login')}
            className="chunky-button bg-secondary-container text-on-secondary-container px-8 py-4 rounded-full font-display font-extrabold text-lg border-2 border-white/20 hover:scale-105 transition-transform"
            style={{ ['--chunky-shadow' as string]: '#004f54' }}
          >
            Parent Log In
          </button>
        </div>

        {/* Cosmo + speech bubble */}
        <div className="mt-20 flex flex-col md:flex-row items-center gap-6 md:gap-10 max-w-4xl w-full">
          <div
            className="flex-shrink-0"
            style={{ animation: 'float-y 3s ease-in-out infinite', filter: 'drop-shadow(0 8px 24px rgba(0,238,252,0.35))' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cosmo.png"
              alt="Cosmo"
              className="w-32 h-32 md:w-44 md:h-44 rounded-full"
            />
          </div>
          <div
            className="relative bg-surface-container/60 backdrop-blur-md rounded-3xl border-2 border-primary-container/30 shadow-2xl p-6 md:p-8 flex-1"
          >
            {/* Speech bubble tail */}
            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface-container/60 backdrop-blur-md rotate-45 border-l-2 border-b-2 border-primary-container/30" />
            <div className="md:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-surface-container/60 backdrop-blur-md rotate-45 border-l-2 border-t-2 border-primary-container/30" />
            <p className="font-display font-bold text-xl md:text-2xl text-on-background text-left">
              Hey there! I&apos;m <span className="text-primary-container">Cosmo</span>.
              Ready to explore the wonders of science with me?
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-primary-container/50 transition-colors text-left">
            <div className="w-14 h-14 bg-primary-container/20 rounded-full flex items-center justify-center mb-4 text-3xl">
              🎓
            </div>
            <span className="inline-block bg-primary-container text-on-primary-container text-xs font-display font-bold px-3 py-1 rounded-full mb-3">
              Learn
            </span>
            <h3 className="font-display font-bold text-xl text-on-background mb-2">
              5 Cosmic Topics
            </h3>
            <p className="text-on-surface-variant">
              Outer space, animals, weather, the human body, and plants — all guided by Cosmo.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-secondary-container/50 transition-colors text-left">
            <div className="w-14 h-14 bg-secondary-container/20 rounded-full flex items-center justify-center mb-4 text-3xl">
              🎮
            </div>
            <span className="inline-block bg-secondary-container text-on-secondary-container text-xs font-display font-bold px-3 py-1 rounded-full mb-3">
              Play
            </span>
            <h3 className="font-display font-bold text-xl text-on-background mb-2">
              Mini-Games &amp; Quizzes
            </h3>
            <p className="text-on-surface-variant">
              Matching, ordering, and building puzzles at every stop. Pass the checkpoint to unlock the next world.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-tertiary-container/50 transition-colors text-left">
            <div className="w-14 h-14 bg-tertiary-container/20 rounded-full flex items-center justify-center mb-4 text-3xl">
              💬
            </div>
            <span className="inline-block bg-tertiary-container text-on-tertiary-container text-xs font-display font-bold px-3 py-1 rounded-full mb-3">
              Ask
            </span>
            <h3 className="font-display font-bold text-xl text-on-background mb-2">
              Ask Cosmo Anything
            </h3>
            <p className="text-on-surface-variant">
              A friendly side-panel chat answers kid questions in 1–2 sentences — concise, safe, and curious.
            </p>
          </div>
        </div>

        {/* Trust / COPPA strip */}
        <div className="mt-16 max-w-2xl text-sm text-on-surface-variant bg-surface-container/40 backdrop-blur-md border border-white/5 rounded-xl px-5 py-4">
          <strong className="text-on-background font-display">Built for kids, designed for parents.</strong>{' '}
          Parental accounts only, COPPA-compliant, and no ads. You stay in control of every cadet&apos;s journey.
        </div>

        {/* Footer */}
        <footer className="mt-12 text-xs text-on-surface-variant/70">
          © {new Date().getFullYear()} Cosmo&apos;s Science Adventure
        </footer>
      </main>
    </>
  )
}
