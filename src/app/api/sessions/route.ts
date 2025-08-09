import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const data = await req.json()
  const { date, startTime, endTime, location, activity, studentIds = [], groupName, status } = data
  if (!date || !startTime || !endTime) {
    return NextResponse.json({ error: 'date, startTime and endTime are required' }, { status: 400 })
  }

  const start = new Date(`${date}T${startTime}:00`)
  const end = new Date(`${date}T${endTime}:00`)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: 'Invalid time format' }, { status: 400 })
  }
  const sessionDate = new Date(date)

  let groupId: number | undefined
  if (studentIds.length > 0) {
    const group = await prisma.group.create({
      data: {
        name: groupName || 'Session Group',
        students: { connect: studentIds.map((id: number) => ({ id })) },
      },
    })
    groupId = group.id
  }

  const session = await prisma.session.create({
    data: {
      date: sessionDate,
      startTime: start,
      endTime: end,
      location,
      activity,
      groupId,
      status,
    },
  })

  const saved = await prisma.session.findUnique({
    where: { id: session.id },
    include: { group: { include: { students: true } } },
  })

  return NextResponse.json(saved)
}
