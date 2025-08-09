import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const groupId = Number(params.id)
  if (isNaN(groupId)) {
    return NextResponse.json({ error: 'Invalid group id' }, { status: 400 })
  }

  const sessions = await prisma.$transaction(async (tx) => {
    await tx.session.updateMany({
      where: { groupId },
      data: { status: 'SEEN' },
    })
    return tx.session.findMany({
      where: { groupId },
      include: { group: { include: { students: true } } },
    })
  })

  return NextResponse.json(sessions)
}
