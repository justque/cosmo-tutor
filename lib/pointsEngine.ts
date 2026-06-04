import { JOURNEY } from './journeyContent'

const locationPointsMap: Map<string, number> = new Map(
  JOURNEY.flatMap((topic) =>
    topic.locations.map((loc) => [loc.id, loc.points ?? 100])
  )
)

export function computePoints(completedLocationIds: string[]): number {
  return completedLocationIds.reduce(
    (sum, id) => sum + (locationPointsMap.get(id) ?? 0),
    0
  )
}
