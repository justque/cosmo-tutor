'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Location, VisualKey, GameData } from '@/lib/journeyContent'
import { CosmoNarrator } from './CosmoNarrator'
import { MiniGame } from './MiniGame'
import { SolarSystem } from './visuals/SolarSystem'
import { SunFlare } from './visuals/SunFlare'
import { MoonPhases } from './visuals/MoonPhases'
import { Constellations } from './visuals/Constellations'
import { RocketLaunch } from './visuals/RocketLaunch'
import { MarsRover } from './visuals/MarsRover'
import { CometSwoop } from './visuals/CometSwoop'
import { BlackHole } from './visuals/BlackHole'
import { SaturnRings } from './visuals/SaturnRings'
import { JupiterMoons } from './visuals/JupiterMoons'
import { SpaceStation } from './visuals/SpaceStation'
import { MammalParade } from './visuals/MammalParade'
import { HabitatZones } from './visuals/HabitatZones'
import { BirdFlock } from './visuals/BirdFlock'
import { BugGarden } from './visuals/BugGarden'
import { OceanReef } from './visuals/OceanReef'
import { ReptileRock } from './visuals/ReptileRock'
import { FrogPond } from './visuals/FrogPond'
import { DinoWalk } from './visuals/DinoWalk'
import { YouTubeEmbed } from './YouTubeEmbed'

function LocationVisual({ visual }: { visual: VisualKey }) {
  switch (visual) {
    case 'solar-system':
      return <SolarSystem />
    case 'sun-flare':
      return <SunFlare />
    case 'moon-phases':
      return <MoonPhases />
    case 'constellations':
      return <Constellations />
    case 'rocket-launch':
      return <RocketLaunch />
    case 'mars-rover':
      return <MarsRover />
    case 'comet-swoop':
      return <CometSwoop />
    case 'black-hole':
      return <BlackHole />
    case 'saturn-rings':
      return <SaturnRings />
    case 'jupiter-moons':
      return <JupiterMoons />
    case 'space-station':
      return <SpaceStation />
    case 'mammal-parade':
      return <MammalParade />
    case 'habitat-zones':
      return <HabitatZones />
    case 'bird-flock':
      return <BirdFlock />
    case 'bug-garden':
      return <BugGarden />
    case 'ocean-reef':
      return <OceanReef />
    case 'reptile-rock':
      return <ReptileRock />
    case 'frog-pond':
      return <FrogPond />
    case 'dino-walk':
      return <DinoWalk />
  }
}

interface Props {
  location: Location
  onComplete: () => void
  onBack?: () => void
  isReview?: boolean
}

const MORE_LABELS = [
  'Cool, tell me more!',
  'Awesome, what else?',
  'Wow, keep going!',
  'That\'s amazing! More!',
  'So cool! What\'s next?',
  'Tell me more, Cosmo!',
  'I want to know more!',
  'Ooh, what else is there?',
]

function GameReview({ game }: { game: GameData }) {
  if (game.type === 'question') {
    return (
      <div className="text-left space-y-3">
        <p className="font-display font-bold text-base text-on-background">{game.question}</p>
        <ul className="space-y-2">
          {game.options.map((opt, i) => (
            <li
              key={i}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${
                i === game.correctIndex
                  ? 'bg-primary-container/20 border-primary-container text-primary-container'
                  : 'bg-surface-container/40 border-white/10 text-on-surface-variant'
              }`}
            >
              {i === game.correctIndex && <span className="mr-2">✓</span>}
              {opt}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (game.type === 'matching') {
    return (
      <div className="text-left space-y-2">
        <p className="font-display font-bold text-sm text-on-surface-variant uppercase tracking-wide mb-3">
          Correct matches
        </p>
        {game.pairs.map((pair) => (
          <div key={pair.id} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary-container/10 border border-primary-container/30">
            <span className="font-semibold text-on-background">{pair.left}</span>
            <span className="text-on-surface-variant">→</span>
            <span className="font-semibold text-primary-container">{pair.right}</span>
          </div>
        ))}
      </div>
    )
  }

  if (game.type === 'ordering') {
    const ordered = [...game.items].sort(
      (a, b) => game.correctOrder.indexOf(a.id) - game.correctOrder.indexOf(b.id)
    )
    return (
      <div className="text-left space-y-2">
        <p className="font-display font-bold text-sm text-on-surface-variant uppercase tracking-wide mb-3">
          Correct order
        </p>
        {ordered.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary-container/10 border border-primary-container/30">
            <span className="text-primary-container font-bold">{i + 1}.</span>
            <span className="text-xl">{item.emoji}</span>
            <span className="font-semibold text-on-background">{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  if (game.type === 'building') {
    const ordered = [...game.pieces].sort((a, b) => a.slot - b.slot)
    return (
      <div className="text-left space-y-2">
        <p className="font-display font-bold text-sm text-on-surface-variant uppercase tracking-wide mb-3">
          {game.target}
        </p>
        {ordered.map((piece) => (
          <div key={piece.id} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary-container/10 border border-primary-container/30">
            <span className="text-xl">{piece.emoji}</span>
            <span className="font-semibold text-on-background">{piece.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

type Phase = 'intro' | 'funfact' | 'game'

export function LocationView({ location, onComplete, onBack, isReview = false }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const moreLabel = useMemo(
    () => MORE_LABELS[Math.floor(Math.random() * MORE_LABELS.length)],
    // Pick once per location mount — location.id as dep keeps it stable within a location.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.id]
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
            <CosmoNarrator text={location.introNarration} instant={isReview} />
            {location.video && (
              <YouTubeEmbed videoId={location.video.youtubeId} title={location.video.title} />
            )}
            {location.visual && <LocationVisual visual={location.visual} />}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2.5 bg-slate-700/60 hover:bg-slate-700 rounded-lg text-slate-300 font-bold text-sm"
              >
                ← Back
              </button>
              <button
                onClick={() => setPhase('funfact')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-bold"
              >
                {moreLabel}
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
            <div className="glass-panel rounded-2xl p-6 md:p-7 border-2 border-tertiary-container/40 shadow-2xl flex gap-5 items-start">
              <div className="w-14 h-14 flex-shrink-0 rounded-full bg-tertiary-container/25 flex items-center justify-center text-3xl">
                💡
              </div>
              <div className="flex-1 text-left">
                <span className="inline-block bg-tertiary-container text-on-tertiary-container text-[10px] font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Fun Fact
                </span>
                <p className="font-display font-bold text-lg md:text-xl text-on-background leading-relaxed">
                  {location.funFact}
                </p>
              </div>
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
            {isReview ? (
              <div className="space-y-5">
                <div className="text-center">
                  <div
                    className="text-6xl text-primary-container inline-block"
                    style={{ filter: 'drop-shadow(0 0 18px rgba(183,247,0,0.7))' }}
                  >
                    ✓
                  </div>
                  <p className="font-display font-extrabold text-2xl text-on-background mt-2">
                    You aced this mission!
                  </p>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Your answer is saved. Keep reviewing or tap the next mission.
                  </p>
                </div>
                <GameReview game={location.game} />
                <button
                  onClick={onComplete}
                  className="chunky-button bg-primary-container text-on-primary-container font-display font-extrabold px-7 py-3 rounded-full border-2 border-white/20"
                  style={{ ['--chunky-shadow' as string]: '#374e00' }}
                >
                  Next →
                </button>
              </div>
            ) : (
              <MiniGame game={location.game} onCorrect={onComplete} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
