import ScheduleGrid from '@/components/schedule/ScheduleGrid'
import NoteFormModal from '@/components/notes/NoteFormModal'
import prisma from '@/lib/prisma'

function startOfCurrentWeek() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(now.getFullYear(), now.getMonth(), diff)
}

export default async function SchedulePage() {
  const weekStart = startOfCurrentWeek()
  const sessions = await prisma.session.findMany({
    where: { date: { gte: weekStart, lt: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) } },
    include: { group: { include: { students: true } } },
    orderBy: { startTime: 'asc' },
  })
  const teachers = await prisma.teacher.findMany({ orderBy: { name: 'asc' } })
  const students = await prisma.student.findMany({ orderBy: { firstName: 'asc' } })
  const sessionForNote = sessions[0]
  const studentForNote = sessionForNote?.group?.students[0] || students[0]
  return (
    <section className="rounded-md bg-white p-2 shadow">
      <h2 className="mb-4 text-xl font-semibold">Schedule</h2>
      <ScheduleGrid
        initialWeekStart={weekStart}
        initialSessions={sessions as any}
        teachers={teachers}
      />
      {sessionForNote && studentForNote && (
        <div className="mt-4">
          <NoteFormModal student={studentForNote} session={sessionForNote as any} />
        </div>
      )}
    </section>
  )
}
