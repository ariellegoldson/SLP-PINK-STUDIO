'use client'

import { useState } from 'react'
import type { Student } from '@prisma/client'
import { SessionWithGroup } from '@/types/schedule'

interface NoteFormModalProps {
  student: Student
  session: SessionWithGroup
  open?: boolean
  onClose?: () => void
  onSkip?: () => void
  onSave?: () => void
  progress?: { current: number; total: number }
}

export default function NoteFormModal({
  student,
  session,
  open: controlledOpen,
  onClose,
  onSkip,
  onSave,
  progress,
}: NoteFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [text, setText] = useState('')
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  function close() {
    if (!isControlled) setInternalOpen(false)
    onClose?.()
  }

  async function handleSave() {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        sessionId: session.id,
        studentId: student.id,
      }),
    })
    onSave?.()
    close()
  }

  return (
    <>
      {!isControlled && (
        <button
          onClick={() => setInternalOpen(true)}
          className="rounded bg-pink-200 px-2 py-1 text-pink-900"
        >
          Add Note
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="rounded-lg bg-white p-4 text-sm shadow-lg">
            {progress && (
              <div className="mb-1 text-xs text-pink-800">
                Student {progress.current} of {progress.total}
              </div>
            )}
            <h2 className="mb-2 text-lg font-semibold text-pink-800">
              Add Note for {student.firstName} {student.lastName}
            </h2>
            <p className="mb-2">Session: {session.group?.name || 'Session'}</p>
            <textarea
              className="w-full rounded border border-pink-300 bg-pink-100 p-1"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="mt-2 flex justify-end gap-2">
              {onSkip && (
                <button
                  onClick={() => {
                    onSkip()
                    close()
                  }}
                  className="rounded bg-pink-200 px-3 py-1 text-pink-900"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleSave}
                className="rounded bg-pink-500 px-3 py-1 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
