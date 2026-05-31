import { LESSONS, LessonStep, CheckpointDef } from './lessons'

/**
 * Gets a specific lesson step by topic slug and step index
 * @param topicSlug - The lesson topic identifier (e.g., 'space', 'animals')
 * @param stepIndex - Zero-based index of the step
 * @returns LessonStep object or null if not found
 */
export function getLessonStep(
  topicSlug: string,
  stepIndex: number
): LessonStep | null {
  const lesson = LESSONS[topicSlug]
  if (!lesson) {
    return null
  }

  if (stepIndex < 0 || stepIndex >= lesson.steps.length) {
    return null
  }

  return lesson.steps[stepIndex]
}

/**
 * Gets the total number of steps for a lesson topic
 * @param topicSlug - The lesson topic identifier
 * @returns Total number of steps, or 0 if topic not found
 */
export function getTotalLessonSteps(topicSlug: string): number {
  const lesson = LESSONS[topicSlug]
  if (!lesson) {
    return 0
  }

  return lesson.steps.length
}

/**
 * Evaluates if a selected answer is correct for a checkpoint
 * @param topicSlug - The lesson topic identifier
 * @param stepIndex - Zero-based index of the step
 * @param selectedOptionIndex - Index of the selected answer option
 * @returns Object containing correctness, feedback message, and optional hint
 */
export function evaluateCheckpoint(
  topicSlug: string,
  stepIndex: number,
  selectedOptionIndex: number
): {
  correct: boolean
  feedback: string
  hint?: string
} {
  const step = getLessonStep(topicSlug, stepIndex)

  if (!step) {
    return {
      correct: false,
      feedback: 'Lesson step not found.',
    }
  }

  const checkpoint = step.checkpoint
  const isCorrect = selectedOptionIndex === checkpoint.correctIndex

  if (isCorrect) {
    return {
      correct: true,
      feedback:
        "Wow! That's exactly right! You're doing amazing! Let's move to the next step.",
    }
  }

  // Get the selected option text for the feedback message
  const selectedOption = checkpoint.options[selectedOptionIndex]
  const feedbackMessage = selectedOption
    ? `Not quite! "${selectedOption}" isn't the right answer. Let's try again! You've got this!`
    : `Not quite! That's not the right answer. Let's try again! You've got this!`

  const result: {
    correct: boolean
    feedback: string
    hint?: string
  } = {
    correct: false,
    feedback: feedbackMessage,
  }

  // Add hint if available
  if (checkpoint.hint) {
    result.hint = checkpoint.hint
  }

  return result
}

/**
 * Gets the checkpoint definition for a specific lesson step
 * @param topicSlug - The lesson topic identifier
 * @param stepIndex - Zero-based index of the step
 * @returns CheckpointDef object or null if not found
 */
export function getCheckpoint(
  topicSlug: string,
  stepIndex: number
): CheckpointDef | null {
  const step = getLessonStep(topicSlug, stepIndex)

  if (!step) {
    return null
  }

  return step.checkpoint
}

/**
 * Checks if a lesson is complete based on steps completed
 * @param topicSlug - The lesson topic identifier
 * @param stepsCompleted - Number of steps that have been completed
 * @returns true if stepsCompleted >= total steps for the topic
 */
export function isLessonComplete(
  topicSlug: string,
  stepsCompleted: number
): boolean {
  const totalSteps = getTotalLessonSteps(topicSlug)

  if (totalSteps === 0) {
    return false
  }

  return stepsCompleted >= totalSteps
}
