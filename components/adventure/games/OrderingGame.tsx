'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { OrderingGameData } from '@/lib/journeyContent'
import { evaluateOrdering } from '@/lib/gameEngine'

interface Props {
  game: OrderingGameData
  onCorrect: () => void
}

export function OrderingGame({ game, onCorrect }: Props) {
  const [order, setOrder] = useState<string[]>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const available = game.items.filter((item) => !order.includes(item.id))

  const addToOrder = (id: string) => {
    if (feedback?.correct) return
    setFeedback(null)
    setOrder((prev) => [...prev, id])
  }

  const reset = () => {
    setOrder([])
    setFeedback(null)
  }

  const check = () => {
    const result = evaluateOrdering(game, order)
    setFeedback(result)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  const allPlaced = order.length === game.items.length

  return (
    <div className="space-y-5">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>

      <div className="bg-slate-800/40 border-2 border-dashed border-slate-600 rounded-xl p-4 min-h-[120px]">
        <p className="text-xs text-gray-400 mb-2">Your order:</p>
        <div className="flex flex-wrap gap-2">
          {order.map((id, i) => {
            const item = game.items.find((it) => it.id === id)!
            return (
              <motion.div
                key={id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/30 border border-blue-400 rounded-lg text-white"
              >
                <span className="text-xs text-blue-200">{i + 1}.</span>
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {available.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Tap to add:</p>
          <div className="flex flex-wrap gap-2">
            {available.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToOrder(item.id)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-lg text-white"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          disabled={order.length === 0 || feedback?.correct}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white text-sm"
        >
          Reset
        </button>
        <button
          onClick={check}
          disabled={!allPlaced || feedback?.correct}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 rounded-lg text-white font-bold"
        >
          Check My Answer!
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
