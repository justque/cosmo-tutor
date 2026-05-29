'use client'

import { useEffect, useState } from 'react'

interface VisualPanelProps {
  visual: {
    type: 'animation' | 'image'
    subject: string
  }
}

export function VisualPanel({ visual }: VisualPanelProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (visual.type === 'image') {
      // Fetch from Unsplash
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              visual.subject
            )}&per_page=1`,
            {
              headers: {
                Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`,
              },
            }
          )
          const data = await response.json()
          if (data.results?.[0]) {
            setImageUrl(data.results[0].urls.regular)
          }
          setLoading(false)
        } catch (error) {
          console.error('Failed to fetch image:', error)
          setLoading(false)
        }
      }
      fetchImage()
    } else {
      // For animations, we'll use a simple colored placeholder with emoji
      setLoading(false)
    }
  }, [visual])

  if (loading) {
    return (
      <div className="w-full h-32 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-2">✨</div>
          <div className="text-sm">Loading visual...</div>
        </div>
      </div>
    )
  }

  if (visual.type === 'image' && imageUrl) {
    return (
      <div className="w-full rounded-lg overflow-hidden mb-4">
        <img src={imageUrl} alt={visual.subject} className="w-full h-48 object-cover" />
      </div>
    )
  }

  // Placeholder for animations
  return (
    <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
      <div className="text-white text-center">
        <div className="text-4xl mb-2">🚀</div>
        <div className="text-sm font-semibold">{visual.subject}</div>
      </div>
    </div>
  )
}
