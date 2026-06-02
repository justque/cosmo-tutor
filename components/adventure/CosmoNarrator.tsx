'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  text: string
  onComplete?: () => void
  speed?: number
  instant?: boolean
}

export function CosmoNarrator({ text, onComplete, speed = 16, instant = false }: Props) {
  const [displayed, setDisplayed] = useState(instant ? text : '')
  const [done, setDone] = useState(instant)

  useEffect(() => {
    if (instant) {
      setDisplayed(text)
      setDone(true)
      onComplete?.()
      return
    }
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onComplete, instant])

  const skip = () => {
    setDisplayed(text)
    setDone(true)
    onComplete?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4"
    >
      <div className="cosmo-float flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cosmo.png" alt="Cosmo" className="w-20 h-20 rounded-full" />
      </div>
      <div
        onClick={!done ? skip : undefined}
        role={!done ? 'button' : undefined}
        tabIndex={!done ? 0 : undefined}
        title={!done ? 'Tap to skip' : undefined}
        className={`relative glass-panel rounded-2xl border-2 border-primary-container/30 shadow-xl px-6 py-4 flex-1 ${
          !done ? 'cursor-pointer' : ''
        }`}
      >
        <div className="absolute -left-3 top-6 w-6 h-6 glass-panel rotate-45 border-l-2 border-b-2 border-primary-container/30" />
        <p className="font-display font-bold text-base md:text-lg text-on-background leading-relaxed">
          {displayed}
          {!done && <span className="typewriter-caret" />}
        </p>
      </div>
    </motion.div>
  )
}
