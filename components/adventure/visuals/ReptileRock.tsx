'use client'

import { motion } from 'framer-motion'

export function ReptileRock() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-yellow-700/50">
      {/* Desert sky → sand */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #fef3c7 0%, #fcd34d 30%, #d97706 60%, #92400e 100%)',
        }}
      />

      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-8 right-12 rounded-full"
        style={{
          width: 70,
          height: 70,
          background:
            'radial-gradient(circle, #fff7ed 0%, #fde047 50%, #f59e0b 100%)',
          boxShadow: '0 0 60px rgba(251,191,36,0.95)',
        }}
      />

      {/* Heat shimmer */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-1/3 left-0 right-0 h-12"
        style={{
          background: 'linear-gradient(to top, rgba(254,243,199,0.4), transparent)',
          filter: 'blur(4px)',
        }}
      />

      {/* Cacti */}
      <div className="absolute" style={{ left: '10%', bottom: '20%', fontSize: 60 }}>
        🌵
      </div>
      <div className="absolute" style={{ right: '15%', bottom: '23%', fontSize: 50 }}>
        🌵
      </div>

      {/* Big basking rock */}
      <div
        className="absolute"
        style={{
          left: '32%',
          bottom: '12%',
          width: 220,
          height: 80,
          borderRadius: '50% 50% 20% 20% / 80% 80% 20% 20%',
          background:
            'radial-gradient(circle at 40% 30%, #fde68a, #b45309 70%, #78350f 100%)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        }}
      />

      {/* Lizard basking — slight tail wiggle */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute text-5xl"
        style={{ left: '40%', bottom: '24%' }}
      >
        🦎
      </motion.div>

      {/* Snake slithering across */}
      <motion.div
        animate={{ x: ['-10%', '110%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute text-4xl"
        style={{ bottom: '6%' }}
      >
        <motion.span
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block"
        >
          🐍
        </motion.span>
      </motion.div>

      {/* Turtle in corner */}
      <motion.div
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute text-4xl"
        style={{ left: '6%', bottom: '8%' }}
      >
        🐢
      </motion.div>

      {/* Sand ripples */}
      <svg
        viewBox="0 0 100 20"
        className="absolute bottom-0 left-0 right-0 w-full"
        preserveAspectRatio="none"
        style={{ height: '18%' }}
      >
        <path d="M 0 10 Q 25 4 50 10 T 100 10 L 100 20 L 0 20 Z" fill="#78350f" opacity={0.9} />
      </svg>

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-amber-50/80 font-display font-bold">
        Reptiles · Cold-blooded · Scaly skin · Eggs
      </span>
    </div>
  )
}
