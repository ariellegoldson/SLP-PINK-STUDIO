import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id)
  const data = await req.json()
  const { date, startTime, endTime, location, activity, status, applyToAll } = data

  const start = new Date(`${date}T${startTime}:00`)
  const end = new Date(`${date}T${endTime}:00`)
  const sessionDate = new Date(date)

  const existing = await prisma.session.findUnique({
    where: { id },
    select: { groupId: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  await prisma.$transaction(async (tx) => {
    if (applyToAll && existing.groupId) {
      await tx.session.updateMany({
        where: { groupId: existing.groupId },
        data: { date: sessionDate, startTime: start, endTime: end, location, activity, status },
      })
    } else {
      await tx.session.update({
        where: { id },
        data: { date: sessionDate, startTime: start, endTime: end, location, activity, status },
      })
    }
  })

  const updated = await prisma.session.findUnique({
    where: { id },
    include: { group: { include: { students: true } } },
  })

  return NextResponse.json(updated)
}
