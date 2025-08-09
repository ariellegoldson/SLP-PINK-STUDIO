'use client'

import { useState, useTransition, Fragment } from 'react'
import { addDays } from '@/utils/date'
import { getSessionsForRange } from '@/app/schedule/actions'
import ScheduleBlock from './ScheduleBlock'
import { Student } from '@prisma/client'
import { SessionWithGroup } from '@/types/schedule'

interface Props {
  initialWeekStart: Date
  initialSessions: SessionWithGroup[]
  students: Student[]
}

const times = Array.from({ length: 8 }, (_, i) => `${8 + i}:00`)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default function ScheduleGrid({
  initialWeekStart,
  initialSessions,
  students,
}: Props) {
  const [weekStart, setWeekStart] = useState(new Date(initialWeekStart))
  const [sessions, setSessions] = useState<SessionWithGroup[]>(initialSessions)
  const [pending, startTransition] = useTransition()

  function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  async function changeWeek(offset: number) {
    const newStart = addDays(weekStart, offset * 7)
    startTransition(async () => {
      const newSessions = await getSessionsForRange(newStart, addDays(newStart, 7))
      setWeekStart(newStart)
      setSessions(newSessions)
    })
  }

  function findSession(day: number, time: string) {
    const date = addDays(weekStart, day)
    return sessions.find((s) => {
      const sameDay = startOfDay(new Date(s.date)).getTime() === startOfDay(date).getTime()
      const st = new Date(s.startTime)
      const hh = st.getHours().toString().padStart(2, '0')
      return sameDay && `${hh}:00` === time
    })
  }

  function upsertSession(session: SessionWithGroup) {
    setSessions((prev) => {
      const existing = prev.findIndex((p) => p.id === session.id)
      if (existing >= 0) {
        const clone = [...prev]
        clone[existing] = session
        return clone
      }
      return [...prev, session]
    })
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => changeWeek(-1)}
          className="rounded bg-pink-200 px-2 py-1 text-pink-900"
        >
          Prev
        </button>
        <div className="font-semibold text-pink-800">
          Week of {weekStart.toLocaleDateString()}
        </div>
        <button
          onClick={() => changeWeek(1)}
          className="rounded bg-pink-200 px-2 py-1 text-pink-900"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-6 gap-px">
        <div></div>
        {days.map((d) => (
          <div key={d} className="p-2 text-center font-semibold">
            {d}
          </div>
        ))}
        {times.map((t) => (
          <Fragment key={t}>
            <div className="p-2 text-right text-sm">{t}</div>
            {days.map((_, i) => {
              const date = addDays(weekStart, i)
              const session = findSession(i, t)
              return (
                <ScheduleBlock
                  key={`${i}-${t}`}
                  date={date}
                  time={t}
                  session={session}
                  students={students}
                  onChange={upsertSession}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
