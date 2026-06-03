'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait a moment for Supabase to process the OAuth callback
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          router.push('/picker')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cosmo.png" alt="Cosmo" className="w-20 h-20 mx-auto mb-4 rounded-full animate-bounce" />
        <p>Setting up your account...</p>
      </div>
    </div>
  )
}
