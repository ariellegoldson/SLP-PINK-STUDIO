import prisma from '@/lib/prisma'

export interface SimpleSession {
  date: Date
  startTime: Date
}

/**
 * Returns up to `take` upcoming sessions for the provided student IDs.
 */
export async function getUpcomingSessionsForStudents(
  studentIds: number[],
  take = 3,
): Promise<Record<number, SimpleSession[]>> {
  if (studentIds.length === 0) return {}
  const sessions = await prisma.session.findMany({
    where: {
      date: { gte: new Date() },
      group: { students: { some: { id: { in: studentIds } } } },
    },
    include: {
      group: { include: { students: { select: { id: true } } } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  const map: Record<number, SimpleSession[]> = {}
  for (const s of sessions) {
    for (const st of s.group?.students || []) {
      if (!studentIds.includes(st.id)) continue
      const arr = map[st.id] || []
      if (arr.length < take) {
        arr.push({ date: s.date, startTime: s.startTime })
        map[st.id] = arr
      }
    }
  }
  return map
}
