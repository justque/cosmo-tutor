'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { VisualPanel } from './VisualPanel'
import { LessonStep as LessonStepType, CheckpointDef } from '@/lib/lessons'

interface LessonStepProps {
  step: LessonStepType
  stepNumber: number
  totalSteps: number
  onCheckpointSubmit: (selectedOptionIndex: number) => void
  isSubmitting?: boolean
}

export function LessonStep({
  step,
  stepNumber,
  totalSteps,
  onCheckpointSubmit,
  isSubmitting = false,
}: LessonStepProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Typing animation effect
  useEffect(() => {
    if (!isTyping) {
      setDisplayText(step.prompt)
      return
    }

    // Show first 50 chars immediately, then rest after 1000ms
    if (displayText.length < 50) {
      // Initial burst to 50 chars
      setDisplayText(step.prompt.slice(0, 50))
      const timer = setTimeout(() => {
        setIsTyping(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setDisplayText(step.prompt)
      setIsTyping(false)
    }
  }, [step.prompt])

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption === null && !isSubmitting) {
      setSelectedOption(optionIndex)
      onCheckpointSubmit(optionIndex)
    }
  }

  const isButtonDisabled = selectedOption !== null || isSubmitting

  const optionLetters = ['A', 'B', 'C', 'D']
  const { question, options } = step.checkpoint

  // Stagger animation for children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      } as any,
    },
  } as any

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  } as any

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
    >
      {/* Progress Indicator */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-6 text-blue-300 font-semibold"
      >
        Step {stepNumber + 1} of {totalSteps}
      </motion.div>

      {/* Cosmo's Explanation */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500 shadow-lg"
      >
        <div className="flex gap-3 items-start">
          <div className="text-3xl flex-shrink-0">🤖</div>
          <div className="flex-1">
            <p className="text-white text-base leading-relaxed">
              {displayText}
              {isTyping && <span className="animate-pulse">▋</span>}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Visual Placeholder */}
      {step.expectedVisual && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <VisualPanel visual={step.expectedVisual} />
        </motion.div>
      )}

      {/* Checkpoint Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Question */}
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-lg bg-gradient-to-r from-indigo-700 to-purple-700 border border-indigo-500"
        >
          <p className="text-white font-semibold text-lg">{question}</p>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              onClick={() => handleOptionClick(index)}
              disabled={isButtonDisabled}
              whileHover={isButtonDisabled ? undefined : { scale: 1.02 }}
              whileTap={isButtonDisabled ? undefined : { scale: 0.98 }}
              className={`p-4 rounded-lg font-semibold text-left transition-all duration-200 text-base ${
                selectedOption === index
                  ? 'bg-green-500 text-white border-2 border-green-400 shadow-lg'
                  : isButtonDisabled
                    ? 'bg-gray-500 text-gray-200 cursor-not-allowed opacity-60'
                    : 'bg-gray-700 text-white hover:bg-gray-600 border-2 border-gray-600 hover:border-blue-400 cursor-pointer'
              }`}
            >
              <span className="font-bold mr-2">{optionLetters[index]}.</span>
              {option}
            </motion.button>
          ))}
        </div>

        {/* Submission Status */}
        {isSubmitting && (
          <motion.div
            variants={itemVariants}
            className="text-center p-3 rounded-lg bg-blue-600 text-white font-semibold"
          >
            Checking your answer...
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
