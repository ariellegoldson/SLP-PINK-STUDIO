'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { generateNoteParagraph, GoalPerformance } from '../lib/generateNoteParagraph'

interface StudentGoal {
  id: number
  goal: { description: string; targetAreaId: number }
}

interface TargetArea {
  id: number
  name: string
}

interface NoteFormModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: number
  studentId: number
  studentName: string
}

export default function NoteFormModal({ isOpen, onClose, sessionId, studentId, studentName }: NoteFormModalProps) {
  const [location, setLocation] = useState('')
  const [activity, setActivity] = useState('')
  const [prompting, setPrompting] = useState('none')
  const [goalData, setGoalData] = useState<Record<number, { accuracy: number; trials: number }>>({})
  const [comments, setComments] = useState('')
  const [noteText, setNoteText] = useState('')
  const [targetAreas, setTargetAreas] = useState<TargetArea[]>([])
  const [targetAreaId, setTargetAreaId] = useState<'all' | number>('all')
  const [goals, setGoals] = useState<StudentGoal[]>([])

  useEffect(() => {
    async function loadAreas() {
      const res = await fetch('/api/target-areas')
      const data = await res.json()
      setTargetAreas(data)
    }
    loadAreas()
  }, [])

  useEffect(() => {
    async function loadGoals() {
      const params = new URLSearchParams({ studentId: String(studentId) })
      if (targetAreaId !== 'all') params.append('targetAreaId', String(targetAreaId))
      const res = await fetch(`/api/goals?${params.toString()}`)
      const data = await res.json()
      setGoals(data)
      setGoalData({})
    }
    if (isOpen) {
      loadGoals()
    }
  }, [isOpen, studentId, targetAreaId])

  const handleGenerate = () => {
    const goalPerf: GoalPerformance[] = goals.map(g => ({
      goalDescription: g.goal.description,
      accuracy: goalData[g.id]?.accuracy ?? 0,
      trials: goalData[g.id]?.trials ?? 0
    }))
    const text = generateNoteParagraph({
      studentName,
      activity,
      prompting,
      goals: goalPerf,
      comments
    })
    setNoteText(text)
  }

  const handleSave = async () => {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        studentId,
        text: noteText,
        location,
        activity,
        prompting,
        comments,
        goalData: Object.entries(goalData).map(([studentGoalId, data]) => ({
          studentGoalId: Number(studentGoalId),
          accuracy: data.accuracy,
          trials: data.trials
        }))
      })
    })
    onClose()
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">Session Note</Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                      <option value="">Select...</option>
                      <option value="classroom">Classroom</option>
                      <option value="therapy room">Therapy Room</option>
                      <option value="outside">Outside</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Activity Description</label>
                    <input value={activity} onChange={e => setActivity(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prompting Type</label>
                    <select value={prompting} onChange={e => setPrompting(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                      <option value="verbal">Verbal</option>
                      <option value="visual">Visual</option>
                      <option value="physical">Physical</option>
                      <option value="gestural">Gestural</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target Area</label>
                    <select
                      value={targetAreaId}
                      onChange={e => setTargetAreaId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                      className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                    >
                      <option value="all">All</option>
                      {targetAreas.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    {goals.map(g => (
                      <div key={g.id} className="rounded-md bg-primary/20 p-2">
                        <p className="text-sm font-medium">{g.goal.description}</p>
                        <div className="mt-1 flex space-x-2">
                          <input
                            type="number"
                            placeholder="Accuracy %"
                            className="w-1/2 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                            value={goalData[g.id]?.accuracy ?? ''}
                            onChange={e =>
                              setGoalData(prev => ({
                                ...prev,
                                [g.id]: { ...prev[g.id], accuracy: Number(e.target.value) },
                              }))
                            }
                          />
                          <input
                            type="number"
                            placeholder="Trials"
                            className="w-1/2 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                            value={goalData[g.id]?.trials ?? ''}
                            onChange={e =>
                              setGoalData(prev => ({
                                ...prev,
                                [g.id]: { ...prev[g.id], trials: Number(e.target.value) },
                              }))
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comments</label>
                    <textarea value={comments} onChange={e => setComments(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
                  </div>
                  <div>
                    <button type="button" onClick={handleGenerate} className="rounded-md bg-primary px-4 py-2 text-white">Generate</button>
                  </div>
                  {noteText && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Generated Note</label>
                      <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary" rows={4} />
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button type="button" className="rounded-md bg-gray-200 px-4 py-2" onClick={onClose}>Cancel</button>
                  <button type="button" className="rounded-md bg-primary px-4 py-2 text-white" onClick={handleSave}>Save</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
