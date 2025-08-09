'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'

interface Result {
  id: number
  firstName: string
  lastName: string
  grade: string
  teacher: string
  classroom: string
  upcomingSessions: { date: string; startTime: string }[]
}

export default function QuickStudentSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [overlay, setOverlay] = useState<Result | null>(null)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/students?q=${encodeURIComponent(query)}`)
        if (!res.ok) {
          setResults([])
          return
        }
        const data = await res.json()
        setResults(data)
        setActive(0)
        setOpen(true)
      } catch {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const activeId = results[active] ? `student-option-${results[active].id}` : undefined

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      const student = results[active]
      if (student) router.push(`/students/${student.id}`)
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search students"
        className="w-48 rounded-2xl border border-pink-600 px-2 py-1 text-sm text-text placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-600"
        aria-controls="student-search-results"
        aria-expanded={open}
        aria-activedescendant={activeId}
      />
      {open && results.length > 0 && (
        <ul
          id="student-search-results"
          role="listbox"
          className="absolute z-10 mt-1 w-72 rounded-md border border-primary bg-white shadow"
        >
          {results.map((r, i) => (
            <li
              key={r.id}
              id={`student-option-${r.id}`}
              role="option"
              aria-selected={i === active}
              className={`flex cursor-pointer items-center justify-between px-2 py-1 text-sm ${
                i === active ? 'bg-primary' : ''
              }`}
              onMouseEnter={() => setActive(i)}
            >
              <div
                className="flex-1"
                onMouseDown={(e) => {
                  e.preventDefault()
                  router.push(`/students/${r.id}`)
                  setOpen(false)
                }}
              >
                <div className="font-medium">{r.firstName} {r.lastName}</div>
                <div className="text-xs text-gray-600">
                  {r.grade} • {r.teacher} • {r.classroom}
                </div>
              </div>
              <button
                className="ml-2 rounded bg-primary px-1 py-0.5 text-xs text-pink-900"
                onMouseDown={(e) => {
                  e.preventDefault()
                  setOverlay(r)
                }}
              >
                Sessions
              </button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={!!overlay} onClose={() => setOverlay(null)} className="relative z-20">
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        <div className="fixed inset-0 mt-20 flex items-start justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-md bg-white p-4">
            <Dialog.Title className="text-lg font-semibold">
              {overlay?.firstName} {overlay?.lastName}
            </Dialog.Title>
            <div className="mt-2 text-sm">
              {overlay?.upcomingSessions.length ? (
                <ul className="mb-2 list-disc pl-4">
                  {overlay.upcomingSessions.slice(0, 3).map((s, idx) => (
                    <li key={idx}>
                      {new Date(s.date).toLocaleDateString()} {' '}
                      {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming sessions</p>
              )}
            </div>
            {overlay && (
              <button
                className="mt-2 rounded bg-primary px-3 py-1 text-pink-900"
                onClick={() => {
                  router.push(`/schedule?studentId=${overlay.id}`)
                  setOverlay(null)
                }}
              >
                View in Schedule
              </button>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
