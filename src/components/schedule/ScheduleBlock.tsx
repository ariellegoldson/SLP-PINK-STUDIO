'use client'

import { useState } from 'react'
import SessionModal from './SessionModal'
import { Student } from '@prisma/client'
import { SessionWithGroup } from '@/types/schedule'

interface Props {
  date: Date
  time: string
  session?: SessionWithGroup
  students: Student[]
  onChange: (session: SessionWithGroup) => void
}

export default function ScheduleBlock({ date, time, session, students, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const status = session?.status ?? 'UPCOMING'
  const color =
    status === 'SEEN'
      ? 'bg-pink-400'
      : status === 'MISSED'
      ? 'bg-gray-300'
      : session
      ? 'bg-[#f5bcd6]'
      : ''

  return (
    <>
      <div
        className={`h-16 w-full border p-1 text-xs cursor-pointer ${color}`}
        onClick={() => setOpen(true)}
      >
        {session && (
          <div className="truncate">
            {session.group?.name ||
              session.group?.students.map((s) => s.firstName).join(', ')}
          </div>
        )}
      </div>
      {open && (
        <SessionModal
          initialDate={date}
          initialTime={time}
          session={session}
          students={students}
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
