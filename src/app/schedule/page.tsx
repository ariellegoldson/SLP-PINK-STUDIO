'use client'

import { useState } from 'react'
import NoteFormModal from '../../components/NoteFormModal'
import ScheduleSessionModal from '../../components/ScheduleSessionModal'

const dummyStudent = {
  id: 1,
  firstName: 'Martina',
  goals: [
    { id: 1, goal: { description: "used the phrase 'I see' to comment" } },
    { id: 2, goal: { description: 'labeled items' } }
  ]
}

const dummySession = { id: 1, title: 'Speech Session with Martina', location: 'Therapy Room' }

export default function SchedulePage() {
  const [sessionOpen, setSessionOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

  const handleMarkSeen = () => {
    setSessionOpen(false)
    setNoteOpen(true)
  }

  return (
    <section className="rounded-md bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Schedule</h2>
      <p className="mt-4 text-gray-600">View and plan your schedule.</p>
      <div className="mt-6">
        <button className="rounded-md bg-primary px-4 py-2 text-white" onClick={() => setSessionOpen(true)}>
          Open Session
        </button>
      </div>
      <ScheduleSessionModal
        isOpen={sessionOpen}
        onClose={() => setSessionOpen(false)}
        onMarkSeen={handleMarkSeen}
        session={dummySession}
      />
      <NoteFormModal
        isOpen={noteOpen}
        onClose={() => setNoteOpen(false)}
        sessionId={dummySession.id}
        studentId={dummyStudent.id}
        studentName={dummyStudent.firstName}
        goals={dummyStudent.goals}
      />
    </section>
  )
}
