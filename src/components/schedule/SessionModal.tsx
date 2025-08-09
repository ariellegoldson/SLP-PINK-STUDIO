'use client'

import { useState } from 'react'
import type { Student } from '@prisma/client'
import { saveSession } from '@/app/schedule/actions'
import { SessionWithGroup, SessionStatus, SESSION_STATUSES } from '@/types/schedule'

interface Props {
  initialDate: Date
  initialTime: string
  session?: SessionWithGroup
  students: Student[]
  onClose: () => void
  onSave: (session: SessionWithGroup) => void
}

const times = Array.from({ length: 9 }, (_, i) => `${8 + i}:00`)
const locations = ['Room 1', 'Room 2', 'Room 3']

export default function SessionModal({
  initialDate,
  initialTime,
  session,
  students,
  onClose,
  onSave,
}: Props) {
  const [date, setDate] = useState(
    session ? session.date.toISOString().substring(0, 10) : initialDate.toISOString().substring(0, 10)
  )
  const [startTime, setStartTime] = useState(
    session
      ? new Date(session.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : initialTime
  )
  const [endTime, setEndTime] = useState(
    session
      ? new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      : times[times.indexOf(initialTime) + 1] || initialTime
  )
  const [location, setLocation] = useState(session?.location || '')
  const [selected, setSelected] = useState<number[]>(
    session?.group?.students.map((s) => s.id) || []
  )
  const [groupName, setGroupName] = useState(session?.group?.name || '')
  const [status, setStatus] = useState<SessionStatus>(session?.status || 'UPCOMING')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const saved = await saveSession({
      id: session?.id,
      date,
      startTime,
      endTime,
      location,
      studentIds: selected,
      groupName,
      status,
    })
    onSave(saved)
  }

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <form
        onSubmit={handleSubmit}
        className="w-80 rounded-lg bg-pink-50 p-4 shadow-lg"
      >
        <h2 className="mb-2 text-lg font-semibold text-pink-800">
          {session ? 'Edit Session' : 'New Session'}
        </h2>
        <div className="mb-2">
          <label className="block text-sm text-pink-800">Date</label>
          <input
            type="date"
            className="mt-1 w-full rounded border-pink-300 bg-pink-100 p-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-2 flex gap-2">
          <div className="flex-1">
            <label className="block text-sm text-pink-800">Start</label>
            <select
              className="mt-1 w-full rounded border-pink-300 bg-pink-100 p-1"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              {times.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-pink-800">End</label>
            <select
              className="mt-1 w-full rounded border-pink-300 bg-pink-100 p-1"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            >
              {times.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm text-pink-800">Location</label>
          <select
            className="mt-1 w-full rounded border-pink-300 bg-pink-100 p-1"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm text-pink-800">Students</label>
          <div className="mt-1 max-h-24 overflow-y-auto rounded border border-pink-300 bg-pink-100 p-1">
            {students.map((s) => (
              <label key={s.id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                {s.firstName} {s.lastName}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm text-pink-800">Group Name (optional)</label>
          <input
            type="text"
            className="mt-1 w-full rounded border-pink-300 bg-pink-100 p-1"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-pink-800">Status</label>
          <select
            className="mt-1 w-full rounded border-pink-300 bg-pink-100 p-1"
            value={status}
            onChange={(e) => setStatus(e.target.value as SessionStatus)}
          >
            {SESSION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded bg-pink-200 px-3 py-1 text-pink-900"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-pink-500 px-3 py-1 text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
