'use server'

import prisma from '@/lib/prisma'
import { SessionStatus, SessionWithGroup } from '@/types/schedule'

export async function getSessionsForRange(
  start: Date,
  end: Date,
): Promise<SessionWithGroup[]> {
  return prisma.session.findMany({
    where: { date: { gte: start, lt: end } },
    include: { group: { include: { students: true } } },
    orderBy: { startTime: 'asc' },
  }) as any
}

interface SaveSessionInput {
  id?: number
  date: string
  startTime: string
  endTime: string
  location: string
  studentIds: number[]
  groupName?: string
  status: SessionStatus
}

export async function saveSession(input: SaveSessionInput): Promise<SessionWithGroup> {
  const { id, date, startTime, endTime, location, studentIds, groupName, status } = input

  const start = new Date(`${date}T${startTime}:00`)
  const end = new Date(`${date}T${endTime}:00`)
  const sessionDate = new Date(date)

  let groupId: number | undefined
  if (studentIds.length > 0) {
    const group = await prisma.group.create({
      data: {
        name: groupName || 'Session Group',
        students: { connect: studentIds.map((id) => ({ id })) },
      },
    })
    groupId = group.id
  }

  const session = id
    ? await prisma.session.update({
        where: { id },
        data: { date: sessionDate, startTime: start, endTime: end, location, groupId, status },
      })
    : await prisma.session.create({
        data: { date: sessionDate, startTime: start, endTime: end, location, groupId, status },
      })

  return (await prisma.session.findUnique({
    where: { id: session.id },
    include: { group: { include: { students: true } } },
  })) as any
}

export async function markSessionSeen(id: number): Promise<SessionWithGroup> {
  return prisma.session.update({
    where: { id },
    data: { status: 'SEEN' },
    include: { group: { include: { students: true } } },
  }) as any
}
