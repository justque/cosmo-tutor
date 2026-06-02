'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Topic } from '@/lib/journeyContent'

interface Props {
  topic: Topic
  onStart: () => void
  isReview?: boolean
}

interface FloatingEmoji {
  emoji: string
  left: number
  top: number
  size: number
  delay: number
  duration: number
  drift: number
}

export function TopicIntro({ topic, onStart, isReview = false }: Props) {
  const [floaters, setFloaters] = useState<FloatingEmoji[]>([])
  const [typed, setTyped] = useState(isReview ? topic.intro.narration : '')

  useEffect(() => {
    const emojis = topic.intro.animationEmojis
    setFloaters(
      Array.from({ length: 14 }, (_, i) => ({
        emoji: emojis[i % emojis.length],
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 22 + 26,
        delay: Math.random() * 2,
        duration: Math.random() * 4 + 5,
        drift: (Math.random() - 0.5) * 80,
      }))
    )
  }, [topic.id, topic.intro.animationEmojis])

  // Typewriter narration (instant during review)
  useEffect(() => {
    if (isReview) {
      setTyped(topic.intro.narration)
      return
    }
    setTyped('')
    const full = topic.intro.narration
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(full.slice(0, i))
      if (i >= full.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [topic.id, topic.intro.narration, isReview])

  const typingDone = typed.length === topic.intro.narration.length

  return (
    <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden">
      {/* Floating themed emojis (ambient atmosphere) */}
      <div className="absolute inset-0 pointer-events-none">
        {floaters.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.5 }}
            animate={{
              opacity: [0, 0.7, 0.7, 0],
              y: [30, -f.drift, -f.drift - 40, -200],
              scale: [0.5, 1, 1, 0.7],
              rotate: [0, f.drift > 0 ? 15 : -15, 0],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              left: `${f.left}%`,
              top: `${f.top}%`,
              fontSize: `${f.size}px`,
            }}
          >
            {f.emoji}
          </motion.div>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-8 pb-12">
        {/* Big floating topic emoji */}
        <div
          className="float-hero text-[110px] md:text-[140px] leading-none mb-2"
          style={{ filter: 'drop-shadow(0 12px 24px rgba(183,247,0,0.35))' }}
        >
          {topic.emoji}
        </div>

        {/* Lime chunky title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display font-extrabold text-5xl md:text-7xl text-primary-container leading-tight"
          style={{ textShadow: '0 4px 0 #506e00', letterSpacing: '-0.02em' }}
        >
          {topic.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 font-display font-bold uppercase tracking-[0.25em] text-secondary-container text-xs"
        >
          {topic.intro.tagline}
        </motion.p>

        {/* Cosmo + Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full max-w-3xl"
        >
          <div className="cosmo-float flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cosmo.png"
              alt="Cosmo"
              className="w-32 h-32 md:w-44 md:h-44 rounded-full"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(0,238,252,0.4))' }}
            />
          </div>
          <div className="relative glass-panel p-6 md:p-7 rounded-3xl border-2 border-primary-container/30 shadow-2xl flex-1">
            {/* Speech bubble tail */}
            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 glass-panel rotate-45 border-l-2 border-b-2 border-primary-container/30" />
            <div className="md:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 glass-panel rotate-45 border-l-2 border-t-2 border-primary-container/30" />
            <p className="font-display font-bold text-lg md:text-xl text-on-background text-left leading-relaxed">
              {typed}
              {!typingDone && <span className="typewriter-caret" />}
            </p>
          </div>
        </motion.div>

        {/* Chunky CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="chunky-button mt-10 bg-primary-container text-on-primary-container px-10 py-5 rounded-full font-display font-extrabold text-xl md:text-2xl border-2 border-white/20 flex items-center gap-3"
          style={{ ['--chunky-shadow' as string]: '#374e00' }}
        >
          {isReview ? 'Replay Adventure 🔁' : 'Start Adventure 🚀'}
        </motion.button>

        {/* Mission preview grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-14 w-full grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {topic.locations.map((loc, i) => {
            const accents = [
              { chip: 'bg-primary-container text-on-primary-container', halo: 'bg-primary-container/20' },
              { chip: 'bg-secondary-container text-on-secondary-container', halo: 'bg-secondary-container/20' },
              { chip: 'bg-tertiary-container text-on-tertiary-container', halo: 'bg-tertiary-container/20' },
            ]
            const accent = accents[i % accents.length]
            return (
              <div
                key={loc.id}
                className="glass-panel p-6 rounded-2xl hover:border-primary-container/50 transition-colors text-left"
              >
                <div className={`w-14 h-14 ${accent.halo} rounded-full flex items-center justify-center mb-4 text-3xl`}>
                  {loc.emoji}
                </div>
                <span className={`inline-block ${accent.chip} text-[10px] font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2`}>
                  Mission {i + 1}
                </span>
                <h3 className="font-display font-bold text-xl text-on-background mb-2">{loc.name}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{loc.introNarration}</p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
