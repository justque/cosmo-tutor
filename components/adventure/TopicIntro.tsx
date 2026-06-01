'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Topic } from '@/lib/journeyContent'
import { CosmoNarrator } from './CosmoNarrator'

interface Props {
  topic: Topic
  onStart: () => void
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

export function TopicIntro({ topic, onStart }: Props) {
  const [floaters, setFloaters] = useState<FloatingEmoji[]>([])

  useEffect(() => {
    const generated: FloatingEmoji[] = []
    const emojis = topic.intro.animationEmojis
    for (let i = 0; i < 18; i++) {
      generated.push({
        emoji: emojis[i % emojis.length],
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 24 + 28,
        delay: Math.random() * 2,
        duration: Math.random() * 4 + 5,
        drift: (Math.random() - 0.5) * 80,
      })
    }
    setFloaters(generated)
  }, [topic.id, topic.intro.animationEmojis])

  return (
    <div className="relative max-w-3xl mx-auto min-h-[500px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 border border-slate-700 backdrop-blur">
      {/* Floating animated emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {floaters.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.5 }}
            animate={{
              opacity: [0, 0.85, 0.85, 0],
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="text-9xl drop-shadow-2xl"
        >
          {topic.emoji}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
        >
          {topic.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-blue-200 font-bold italic text-center"
        >
          {topic.intro.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full"
        >
          <CosmoNarrator text={topic.intro.narration} />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-10 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 rounded-full text-white font-extrabold text-xl shadow-2xl"
        >
          Let&apos;s Go! 🚀
        </motion.button>
      </div>
    </div>
  )
}
