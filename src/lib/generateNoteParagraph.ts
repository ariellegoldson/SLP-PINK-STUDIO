export interface GoalPerformance {
  goalDescription: string
  accuracy: number
  trials: number
}

export interface NoteData {
  studentName: string
  activity: string
  prompting: string
  goals: GoalPerformance[]
  comments?: string
}

export function generateNoteParagraph(data: NoteData): string {
  const parts: string[] = []
  parts.push(`${data.studentName} was engaged and participated throughout the session.`)

  if (data.activity) {
    parts.push(`Activities included ${data.activity}.`)
  }

  data.goals.forEach(g => {
    parts.push(`${data.studentName} ${g.goalDescription} ${g.trials}x with ${g.accuracy}% accuracy.`)
  })

  if (data.prompting && data.prompting !== 'none') {
    parts.push(`${data.studentName} required ${data.prompting} prompting.`)
  }

  if (data.comments) {
    parts.push(data.comments)
  }

  return parts.join(' ')
}
