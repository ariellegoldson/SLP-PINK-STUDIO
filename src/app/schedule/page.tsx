import ScheduleGrid from '@/components/schedule/ScheduleGrid'
import NoteFormModal from '@/components/notes/NoteFormModal'
import prisma from '@/lib/prisma'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

function startOfCurrentWeek() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(now.getFullYear(), now.getMonth(), diff)
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { studentId?: string }
}) {
  const weekStart = startOfCurrentWeek()
  try {
    const sessions = await prisma.session.findMany({
      where: {
        date: {
          gte: weekStart,
          lt: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: { group: { include: { students: true } } },
      orderBy: { startTime: 'asc' },
    })
    const teachers = await prisma.teacher.findMany({ orderBy: { name: 'asc' } })
    const students = await prisma.student.findMany({ orderBy: { firstName: 'asc' } })
    const sessionForNote = sessions[0]
    const studentForNote = sessionForNote?.group?.students[0] || students[0]
    const highlightStudentId = searchParams.studentId ? Number(searchParams.studentId) : undefined
    return (
      <Card className="fade-up">
        <h2 className="mb-4 text-xl font-semibold">Schedule</h2>
        <ScheduleGrid
          initialWeekStart={weekStart}
          initialSessions={sessions as any}
          teachers={teachers}
          highlightStudentId={highlightStudentId}
        />
        {sessionForNote && studentForNote && (
          <div className="mt-4">
            <NoteFormModal student={studentForNote} session={sessionForNote as any} />
          </div>
        )}
      </Card>
    )
  } catch (e: any) {
    if (e.code === 'P2021') {
      return (
        <EmptyState title="Database not initialized" description="Initialize database to continue">
          <form action="/api/admin/init-db" method="post">
            <Button type="submit">Initialize Database</Button>
          </form>
        </EmptyState>
      )
    }
    throw e
  }
}
