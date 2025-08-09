'use client'

import { useState } from 'react'
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
        className={`h-16 w-full cursor-pointer border p-1 text-xs ${color} ${
          highlight ? 'ring-2 ring-primary' : ''
        }`}
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
