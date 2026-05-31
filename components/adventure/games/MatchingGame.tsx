'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MatchingGameData } from '@/lib/journeyContent'
import { evaluateMatching } from '@/lib/gameEngine'

interface Props {
  game: MatchingGameData
  onCorrect: () => void
}

export function MatchingGame({ game, onCorrect }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matches, setMatches] = useState<Array<{ id: string; left: string; right: string }>>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const [rightOrder] = useState(() => {
    const arr = game.pairs.map((p) => p.right)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })

  const matchedLefts = new Set(matches.map((m) => m.left))
  const matchedRights = new Set(matches.map((m) => m.right))

  const handleLeftClick = (left: string) => {
    if (feedback?.correct || matchedLefts.has(left)) return
    setSelectedLeft(left)
  }

  const handleRightClick = (right: string) => {
    if (feedback?.correct || matchedRights.has(right) || !selectedLeft) return
    const id = `${selectedLeft}-${right}`
    setMatches((prev) => [...prev, { id, left: selectedLeft, right }])
    setSelectedLeft(null)
  }

  const reset = () => {
    setMatches([])
    setSelectedLeft(null)
    setFeedback(null)
  }

  const check = () => {
    const result = evaluateMatching(game, matches)
    setFeedback(result)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  const allMatched = matches.length === game.pairs.length

  return (
    <div className="space-y-5">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {game.pairs.map((p) => {
            const isMatched = matchedLefts.has(p.left)
            const isSelected = selectedLeft === p.left
            return (
              <motion.button
                key={p.left}
                whileHover={{ scale: isMatched ? 1 : 1.02 }}
                onClick={() => handleLeftClick(p.left)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-left transition ${
                  isMatched
                    ? 'bg-green-500/20 border-green-400 text-green-100'
                    : isSelected
                    ? 'bg-blue-500/40 border-blue-300 text-white'
                    : 'bg-slate-700 border-slate-500 text-white hover:border-blue-400'
                }`}
              >
                {p.left}
              </motion.button>
            )
          })}
        </div>
        <div className="space-y-2">
          {rightOrder.map((right) => {
            const isMatched = matchedRights.has(right)
            return (
              <motion.button
                key={right}
                whileHover={{ scale: isMatched ? 1 : 1.02 }}
                onClick={() => handleRightClick(right)}
                disabled={isMatched || !selectedLeft}
                className={`w-full p-3 rounded-lg border-2 text-left transition ${
                  isMatched
                    ? 'bg-green-500/20 border-green-400 text-green-100'
                    : selectedLeft
                    ? 'bg-purple-500/30 border-purple-400 text-white hover:bg-purple-500/50'
                    : 'bg-slate-700 border-slate-500 text-white opacity-60'
                }`}
              >
                {right}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          disabled={matches.length === 0 || feedback?.correct}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white text-sm"
        >
          Reset
        </button>
        <button
          onClick={check}
          disabled={!allMatched || feedback?.correct}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 rounded-lg text-white font-bold"
        >
          Check Matches!
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
