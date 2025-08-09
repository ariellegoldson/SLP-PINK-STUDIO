'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  studentId: number
}

interface NoteResponse {
  id: number
  createdAt: string
  goalData: {
    id: number
    accuracy: number
    trials: number
    studentGoal: { goal: { description: string } }
  }[]
}

export default function StudentProgressTooltip({ studentId }: Props) {
  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/notes?studentId=${studentId}&take=5`)
      const data = await res.json()
      setNotes(data)
      setLoading(false)
    }
    load()
  }, [studentId])

  if (loading) {
    return <div className="p-2 text-xs text-pink-800">Loading...</div>
  }

  if (!notes.length) {
    return <div className="p-2 text-xs text-pink-800">No past session data</div>
  }

  const goalsMap: Record<string, { description: string; points: { date: string; accuracy: number }[] }> = {}
  notes.forEach((note) => {
    note.goalData.forEach((g) => {
      const key = g.studentGoal.goal.description
      if (!goalsMap[key]) {
        goalsMap[key] = { description: key, points: [] }
      }
      goalsMap[key].points.push({ date: note.createdAt, accuracy: g.accuracy })
    })
  })

  return (
    <div className="p-2 text-xs">
      {Object.values(goalsMap).map((goal) => (
        <div key={goal.description} className="mb-2">
          <div className="mb-1 font-semibold">{goal.description}</div>
          <ResponsiveContainer width={150} height={40}>
            <LineChart data={goal.points}>
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 100]} hide />
              <ReTooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#f472b6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}
