import type {
  MatchingGameData,
  OrderingGameData,
  BuildingGameData,
  QuestionGameData,
} from './journeyContent'

export interface GameResult {
  correct: boolean
  message: string
  hint?: string
}

export function evaluateQuestion(
  game: QuestionGameData,
  selectedIndex: number
): GameResult {
  const correct = selectedIndex === game.correctIndex
  return {
    correct,
    message: correct ? game.celebrationMessage : 'Not quite! Try again!',
    hint: correct ? undefined : game.hintOnWrong,
  }
}

export function evaluateMatching(
  game: MatchingGameData,
  userPairs: Array<{ id: string; left: string; right: string }>
): GameResult {
  const allCorrect = game.pairs.every((expected) =>
    userPairs.some(
      (u) => u.left === expected.left && u.right === expected.right
    )
  )
  return {
    correct: allCorrect,
    message: allCorrect ? game.celebrationMessage : 'Some matches are mixed up. Try again!',
  }
}

export function evaluateOrdering(
  game: OrderingGameData,
  userOrder: string[]
): GameResult {
  const correct =
    userOrder.length === game.correctOrder.length &&
    userOrder.every((id, i) => id === game.correctOrder[i])
  return {
    correct,
    message: correct ? game.celebrationMessage : 'Order is not quite right. Try again!',
  }
}

export function evaluateBuilding(
  game: BuildingGameData,
  placements: Array<{ id: string; slot: number }>
): GameResult {
  const correct = game.pieces.every((piece) =>
    placements.some((p) => p.id === piece.id && p.slot === piece.slot)
  )
  return {
    correct,
    message: correct ? game.celebrationMessage : 'Some pieces are in the wrong spot!',
  }
}

export function evaluateCheckpoint(
  questions: QuestionGameData[],
  answers: number[],
  passingScore: number
): { score: number; total: number; passed: boolean } {
  const score = answers.reduce(
    (sum, ans, i) => (ans === questions[i].correctIndex ? sum + 1 : sum),
    0
  )
  return { score, total: questions.length, passed: score >= passingScore }
}
