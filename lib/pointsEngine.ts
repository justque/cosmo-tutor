import { JOURNEY } from './journeyContent'

const DEFAULT_LOCATION_POINTS = 100

const locationPointsMap: Map<string, number> = new Map(
  JOURNEY.flatMap((topic) =>
    topic.locations.map((loc) => [loc.id, loc.points ?? DEFAULT_LOCATION_POINTS])
  )
)

export function computePoints(completedLocationIds: string[]): number {
  return completedLocationIds.reduce(
    (sum, id) => sum + (locationPointsMap.get(id) ?? 0),
    0
  )
}
