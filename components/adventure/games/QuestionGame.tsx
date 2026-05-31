'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { QuestionGameData } from '@/lib/journeyContent'
import { evaluateQuestion } from '@/lib/gameEngine'

interface Props {
  game: QuestionGameData
  onCorrect: () => void
  onAnswered?: (selectedIndex: number, correct: boolean) => void
}

export function QuestionGame({ game, onCorrect, onAnswered }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string; hint?: string } | null>(null)

  const handleSelect = (i: number) => {
    if (feedback?.correct) return
    setSelected(i)
    const result = evaluateQuestion(game, i)
    setFeedback(result)
    onAnswered?.(i, result.correct)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>
      <h3 className="text-2xl font-bold text-white">{game.question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {game.options.map((option, i) => {
          const isSelected = selected === i
          const isCorrect = feedback?.correct && isSelected
          const isWrong = feedback && !feedback.correct && isSelected
          return (
            <motion.button
              key={i}
              whileHover={{ scale: feedback?.correct ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              disabled={!!feedback?.correct}
              className={`p-4 rounded-xl border-2 text-lg font-medium text-left transition ${
                isCorrect
                  ? 'bg-green-500/30 border-green-400 text-white'
                  : isWrong
                  ? 'bg-red-500/30 border-red-400 text-white'
                  : 'bg-slate-800/60 border-slate-600 text-gray-100 hover:border-blue-400'
              }`}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-center font-medium ${
            feedback.correct ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
          }`}
        >
          {feedback.message}
          {feedback.hint && <p className="text-sm mt-1 opacity-90">{feedback.hint}</p>}
        </motion.div>
      )}
    </div>
  )
}
