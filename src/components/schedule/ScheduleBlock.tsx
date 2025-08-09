'use client'

import { useState } from 'react'
import StudentProgressTooltip from '../notes/StudentProgressTooltip'
import SessionModal from './SessionModal'
import type { Teacher } from '@prisma/client'
import { SessionWithGroup } from '@/types/schedule'

interface Props {
  date: Date
  time: string
  session?: SessionWithGroup
  teachers: Teacher[]
  onChange: (session: SessionWithGroup) => void
  highlightStudentId?: number
}

export default function ScheduleBlock({
  date,
  time,
  session,
  teachers,
  onChange,
  highlightStudentId,
}: Props) {
  const [open, setOpen] = useState(false)
  const [hoverStudent, setHoverStudent] = useState<number | null>(null)

  const status = session?.status ?? 'UPCOMING'
  const color =
    status === 'SEEN'
      ? 'bg-pink-400'
      : status === 'MISSED'
      ? 'bg-gray-300'
      : session
      ? 'bg-[#f5bcd6]'
      : ''
  const highlight =
    highlightStudentId && session?.group?.students.some((s) => s.id === highlightStudentId)

  return (
    <>
      <div
        className={`relative h-16 w-full cursor-pointer border p-1 text-xs ${color} ${
          highlight ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => setOpen(true)}
        onMouseLeave={() => setHoverStudent(null)}
      >
        {session && (
          <div className="truncate space-x-1">
            {session.group?.name
              ? session.group.name
              : session.group?.students.map((s) => (
                  <span
                    key={s.id}
                    className="underline"
                    onMouseEnter={(e) => {
                      e.stopPropagation()
                      setHoverStudent(s.id)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setHoverStudent(s.id)
                    }}
                  >
                    {s.firstName}
                  </span>
                ))}
          </div>
        )}
        {hoverStudent && (
          <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded bg-white shadow-lg">
            <StudentProgressTooltip studentId={hoverStudent} />
          </div>
        )}
      </div>
      {open && (
        <SessionModal
          initialDate={date}
          initialTime={time}
          session={session}
          teachers={teachers}
          onClose={() => setOpen(false)}
          onSave={(s) => {
            onChange(s)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}
