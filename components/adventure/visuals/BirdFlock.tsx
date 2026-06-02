'use client'

import { motion } from 'framer-motion'

export function BirdFlock() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-sky-700/50">
      {/* Sunset sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #fed7aa 0%, #fb923c 30%, #ef4444 60%, #7c2d12 100%)',
        }}
      />

      {/* Sun on horizon */}
      <div
        className="absolute"
        style={{
          left: '70%',
          top: '40%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, #fff7ed 0%, #fde047 40%, #f97316 100%)',
          boxShadow: '0 0 80px rgba(251,146,60,0.7)',
        }}
      />

      {/* Mountains silhouette */}
      <svg
        viewBox="0 0 100 30"
        className="absolute bottom-0 left-0 right-0 w-full"
        preserveAspectRatio="none"
        style={{ height: '25%' }}
      >
        <path
          d="M 0 30 L 0 18 L 15 8 L 28 15 L 45 4 L 62 14 L 78 6 L 100 16 L 100 30 Z"
          fill="#451a03"
        />
      </svg>

      {/* V-formation flying across */}
      <motion.div
        animate={{ x: ['-25%', '110%'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-0"
      >
        {/* Lead bird */}
        <BirdSilhouette x={0} y={0} delay={0} />
        {/* Left wing */}
        <BirdSilhouette x={-30} y={20} delay={0.1} />
        <BirdSilhouette x={-60} y={40} delay={0.2} />
        <BirdSilhouette x={-90} y={60} delay={0.3} />
        {/* Right wing */}
        <BirdSilhouette x={30} y={20} delay={0.1} />
        <BirdSilhouette x={60} y={40} delay={0.2} />
        <BirdSilhouette x={90} y={60} delay={0.3} />
      </motion.div>

      {/* A solo bird soaring higher */}
      <motion.div
        animate={{ x: ['110%', '-15%'], y: [0, 30, 0] }}
        transition={{
          x: { duration: 22, repeat: Infinity, ease: 'linear' },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-12 right-0"
      >
        <BirdSilhouette x={0} y={0} delay={0} size={20} />
      </motion.div>

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-amber-100/80 font-display font-bold">
        Birds · Feathers, beaks, hatched from eggs
      </span>
    </div>
  )
}

function BirdSilhouette({
  x,
  y,
  delay,
  size = 30,
}: {
  x: number
  y: number
  delay: number
  size?: number
}) {
  return (
    <motion.svg
      viewBox="0 0 100 60"
      width={size}
      height={size * 0.6}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))',
      }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.4, repeat: Infinity, delay }}
    >
      <path
        d="M 5 30 Q 25 5 50 30 Q 75 5 95 30"
        stroke="#1c1917"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </motion.svg>
  )
}
