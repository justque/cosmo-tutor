import { supabase } from './supabase'

export interface JourneyProgress {
  childId: string
  currentTopicId: string
  currentLocationIndex: number
  completedLocationIds: string[]
  completedTopicIds: string[]
}

export async function loadProgress(childId: string): Promise<JourneyProgress> {
  const { data } = await supabase
    .from('journey_progress')
    .select('*')
    .eq('child_id', childId)
    .maybeSingle()

  if (!data) {
    return {
      childId,
      currentTopicId: 'space',
      currentLocationIndex: 0,
      completedLocationIds: [],
      completedTopicIds: [],
    }
  }
  return {
    childId,
    currentTopicId: data.current_topic_id,
    currentLocationIndex: data.current_location_index,
    completedLocationIds: data.completed_location_ids ?? [],
    completedTopicIds: data.completed_topic_ids ?? [],
  }
}

export function saveProgress(progress: JourneyProgress): void {
  void supabase
    .from('journey_progress')
    .upsert(
      {
        child_id: progress.childId,
        current_topic_id: progress.currentTopicId,
        current_location_index: progress.currentLocationIndex,
        completed_location_ids: progress.completedLocationIds,
        completed_topic_ids: progress.completedTopicIds,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'child_id' }
    )
    .then(({ error }) => {
      if (error) console.error('saveProgress failed:', error)
    })
}

export function logCheckpointAttempt(
  childId: string,
  topicId: string,
  score: number,
  total: number,
  passed: boolean
): void {
  void supabase
    .from('checkpoint_attempts')
    .insert({
      child_id: childId,
      topic_id: topicId,
      score,
      total,
      passed,
    })
    .then(({ error }) => {
      if (error) console.error('logCheckpointAttempt failed:', error)
    })
}
