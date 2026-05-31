'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Checkpoint, QuestionGameData } from '@/lib/journeyContent'
import { CosmoNarrator } from './CosmoNarrator'
import { evaluateCheckpoint } from '@/lib/gameEngine'

interface Props {
  checkpoint: Checkpoint
  onPassed: (score: number, total: number) => void
  onRetry: (score: number, total: number) => void
}

type Phase = 'intro' | 'questions' | 'result'

function CheckpointQuestion({
  question,
  onAnswer,
}: {
  question: QuestionGameData
  onAnswer: (selectedIndex: number) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)

  const handlePick = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    setTimeout(() => onAnswer(i), 1200)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{question.instruction}</p>
      <h3 className="text-2xl font-bold text-white">{question.question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {question.options.map((option, i) => {
          const isSelected = selected === i
          const isRevealed = selected !== null
          const isCorrect = i === question.correctIndex
          return (
            <motion.button
              key={i}
              whileHover={{ scale: isRevealed ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePick(i)}
              disabled={isRevealed}
              className={`p-4 rounded-xl border-2 text-lg font-medium text-left transition ${
                isRevealed && isCorrect
                  ? 'bg-green-500/30 border-green-400 text-white'
                  : isRevealed && isSelected && !isCorrect
                  ? 'bg-red-500/30 border-red-400 text-white'
                  : 'bg-slate-800/60 border-slate-600 text-gray-100 hover:border-blue-400'
              }`}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export function CheckpointAssessment({ checkpoint, onPassed, onRetry }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const handleAnswered = (selectedIndex: number) => {
    const next = [...answers, selectedIndex]
    setAnswers(next)
    if (questionIndex + 1 < checkpoint.questions.length) {
      setTimeout(() => setQuestionIndex(questionIndex + 1), 300)
    } else {
      setTimeout(() => setPhase('result'), 300)
    }
  }

  const restart = () => {
    setAnswers([])
    setQuestionIndex(0)
    setPhase('questions')
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{checkpoint.title}</h2>
        </div>
        <CosmoNarrator text={checkpoint.introNarration} />
        <div className="text-center">
          <button
            onClick={() => setPhase('questions')}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white font-bold text-lg shadow-lg"
          >
            I&apos;m ready!
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'questions') {
    const current = checkpoint.questions[questionIndex]
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center text-sm text-gray-400">
          Question {questionIndex + 1} of {checkpoint.questions.length}
        </div>
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <CheckpointQuestion
            key={questionIndex}
            question={current}
            onAnswer={handleAnswered}
          />
        </div>
      </div>
    )
  }

  const result = evaluateCheckpoint(checkpoint.questions, answers, checkpoint.passingScore)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto space-y-6 text-center"
    >
      <div className="text-7xl">{result.passed ? '🏆' : '💪'}</div>
      <h2 className="text-3xl font-bold text-white">
        You got {result.score} out of {result.total}!
      </h2>
      <CosmoNarrator
        text={result.passed ? checkpoint.successNarration : checkpoint.retryNarration}
      />
      <div className="flex justify-center gap-3 flex-wrap">
        {result.passed ? (
          <button
            onClick={() => onPassed(result.score, result.total)}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-bold text-lg"
          >
            Continue Adventure!
          </button>
        ) : (
          <>
            <button
              onClick={restart}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-bold"
            >
              Try Again
            </button>
            <button
              onClick={() => onRetry(result.score, result.total)}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >
              Review locations
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
