'use client'

import { useState } from 'react'

interface Props {
  videoId: string
  title: string
}

export function YouTubeEmbed({ videoId, title }: Props) {
  const [loaded, setLoaded] = useState(false)
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-700 shadow-2xl bg-slate-900" style={{ aspectRatio: '16 / 9' }}>
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 w-full h-full flex items-center justify-center"
          aria-label={`Play video: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-red-600/95 group-hover:bg-red-500 flex items-center justify-center shadow-2xl transition transform group-hover:scale-110">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white font-bold text-lg drop-shadow-lg px-4 text-center">{title}</p>
          </div>
        </button>
      )}
    </div>
  )
}
