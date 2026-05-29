'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/auth/signup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-50"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6 animate-bounce">🤖</div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Meet Cosmo
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            Your robot astronaut science tutor! 🚀
          </p>

          <p className="text-lg text-gray-400 mb-12 leading-relaxed">
            Explore the wonders of science with fun explanations, cool animations,
            and amazing discoveries. Ask Cosmo anything and learn like never before!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Start Learning Now ✨
            </button>

            <button
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white rounded-lg font-bold text-lg transition-all"
              onClick={() => router.push('/auth/login')}
            >
              Parent Login
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-lg mb-2">Learn Science</h3>
              <p className="text-gray-400 text-sm">
                Ask about space, animals, weather, your body, and more!
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="font-bold text-lg mb-2">Speak & Listen</h3>
              <p className="text-gray-400 text-sm">
                Use voice input and hear Cosmo's answers out loud!
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2">Track Progress</h3>
              <p className="text-gray-400 text-sm">
                Parents can see what their kids are learning!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
