'use client'

import type { GameData } from '@/lib/journeyContent'
import { QuestionGame } from './games/QuestionGame'
import { OrderingGame } from './games/OrderingGame'
import { MatchingGame } from './games/MatchingGame'
import { BuildingGame } from './games/BuildingGame'

interface Props {
  game: GameData
  onCorrect: () => void
}

export function MiniGame({ game, onCorrect }: Props) {
  switch (game.type) {
    case 'question':
      return <QuestionGame game={game} onCorrect={onCorrect} />
    case 'ordering':
      return <OrderingGame game={game} onCorrect={onCorrect} />
    case 'matching':
      return <MatchingGame game={game} onCorrect={onCorrect} />
    case 'building':
      return <BuildingGame game={game} onCorrect={onCorrect} />
  }
}
