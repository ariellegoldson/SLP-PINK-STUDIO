'use client'

import { useState } from 'react'
import { Student } from '@prisma/client'
import { SessionWithGroup } from '@/types/schedule'

interface NoteFormModalProps {
  student: Student
  session: SessionWithGroup
}

export default function NoteFormModal({ student, session }: NoteFormModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-pink-200 px-2 py-1 text-pink-900"
      >
        Add Note
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="rounded-lg bg-white p-4 shadow-lg text-sm">
            <h2 className="mb-2 text-lg font-semibold text-pink-800">
              Add Note for {student.firstName} {student.lastName}
            </h2>
            <p className="mb-2">
              Session: {session.group?.name || 'Session'}
            </p>
            <textarea
              className="w-full rounded border border-pink-300 bg-pink-100 p-1"
              rows={4}
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded bg-pink-200 px-3 py-1 text-pink-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

