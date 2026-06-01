'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Location, VisualKey } from '@/lib/journeyContent'
import { CosmoNarrator } from './CosmoNarrator'
import { MiniGame } from './MiniGame'
import { SolarSystem } from './visuals/SolarSystem'

function LocationVisual({ visual }: { visual: VisualKey }) {
  switch (visual) {
    case 'solar-system':
      return <SolarSystem />
  }
}

interface Props {
  location: Location
  topicEmoji: string
  topicName: string
  locationIndex: number
  totalLocations: number
  onComplete: () => void
}

type Phase = 'intro' | 'funfact' | 'game'

export function LocationView({
  location,
  topicEmoji,
  topicName,
  locationIndex,
  totalLocations,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<Phase>('intro')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>
          {topicEmoji} {topicName} — Stop {locationIndex + 1} of {totalLocations}
        </span>
        <span className="text-2xl">{location.emoji}</span>
      </div>

      <motion.h2
        key={location.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white text-center"
      >
        {location.name} {location.emoji}
      </motion.h2>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <CosmoNarrator text={location.introNarration} />
            {location.visual && <LocationVisual visual={location.visual} />}
            <div className="text-center">
              <button
                onClick={() => setPhase('funfact')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-bold"
              >
                Cool, tell me more!
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'funfact' && (
          <motion.div
            key="funfact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/40 rounded-2xl p-6 text-center">
              <p className="text-sm text-yellow-300 uppercase tracking-wider mb-2">Fun Fact!</p>
              <p className="text-xl text-white">{location.funFact}</p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setPhase('game')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-bold"
              >
                Let&apos;s play!
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6"
          >
            <MiniGame game={location.game} onCorrect={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
