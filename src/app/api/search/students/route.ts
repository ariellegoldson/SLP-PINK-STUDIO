import { NextResponse } from 'next/server'
import { Student, Teacher, Classroom } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getUpcomingSessionsForStudents } from '@/lib/sessions'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''
  if (q.length < 2) {
    return NextResponse.json([], {
      status: 400,
      headers: { 'X-Debounce': '300' },
    })
  }
  try {
    const students: (Student & { teacher: Teacher; classroom: Classroom })[] =
      await prisma.student.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
          ],
        },
        include: {
          teacher: true,
          classroom: true,
        },
        orderBy: { firstName: 'asc' },
        take: 10,
      })
    const sessionsMap = await getUpcomingSessionsForStudents(
      students.map((s) => s.id),
    )
    const results = students.map((s) => ({
      id: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
      grade: s.grade,
      teacher: s.teacher.name,
      classroom: s.classroom.name,
      upcomingSessions: sessionsMap[s.id] || [],
    }))
    return NextResponse.json(results)
  } catch (e) {
    console.error(e)
    return NextResponse.json([])
  }
}
