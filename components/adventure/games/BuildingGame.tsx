'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { BuildingGameData } from '@/lib/journeyContent'
import { evaluateBuilding } from '@/lib/gameEngine'

interface Props {
  game: BuildingGameData
  onCorrect: () => void
}

export function BuildingGame({ game, onCorrect }: Props) {
  const [placements, setPlacements] = useState<Array<{ id: string; slot: number }>>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const slotCount = game.pieces.length
  const slotMap = new Map(placements.map((p) => [p.slot, p.id]))
  const placedIds = new Set(placements.map((p) => p.id))
  const available = game.pieces.filter((p) => !placedIds.has(p.id))

  const handlePlace = (slot: number, pieceId: string) => {
    if (feedback?.correct) return
    setPlacements((prev) => [...prev.filter((p) => p.slot !== slot), { id: pieceId, slot }])
  }

  const reset = () => {
    setPlacements([])
    setFeedback(null)
  }

  const check = () => {
    const result = evaluateBuilding(game, placements)
    setFeedback(result)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  const allPlaced = placements.length === slotCount

  return (
    <div className="space-y-5">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>
      <p className="text-xl text-white font-bold">{game.target}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: slotCount }).map((_, slot) => {
          const placedId = slotMap.get(slot)
          const piece = placedId ? game.pieces.find((p) => p.id === placedId) : null
          return (
            <div
              key={slot}
              className="aspect-square bg-slate-800/60 border-2 border-dashed border-slate-500 rounded-xl flex flex-col items-center justify-center p-2"
            >
              <div className="text-xs text-gray-400 mb-1">Spot {slot + 1}</div>
              {piece ? (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setPlacements((prev) => prev.filter((p) => p.slot !== slot))}
                  className="text-4xl"
                >
                  {piece.emoji}
                  <div className="text-xs text-white mt-1">{piece.label}</div>
                </motion.button>
              ) : (
                <select
                  value=""
                  onChange={(e) => handlePlace(slot, e.target.value)}
                  className="text-xs bg-slate-700 text-white rounded px-2 py-1"
                >
                  <option value="">Pick...</option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {p.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          disabled={placements.length === 0 || feedback?.correct}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white text-sm"
        >
          Reset
        </button>
        <button
          onClick={check}
          disabled={!allPlaced || feedback?.correct}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 rounded-lg text-white font-bold"
        >
          Check!
        </button>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-3 rounded-lg text-center font-medium ${
            feedback.correct ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
          }`}
        >
          {feedback.message}
        </motion.div>
      )}
    </div>
  )
}
