import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('studentId')
  if (!studentId) {
    return NextResponse.json([], { status: 400 })
  }
  const targetAreaId = searchParams.get('targetAreaId')
  const goals = await prisma.studentGoal.findMany({
    where: {
      studentId: Number(studentId),
      ...(targetAreaId ? { goal: { targetAreaId: Number(targetAreaId) } } : {}),
    },
    include: { goal: true },
    orderBy: { id: 'asc' },
  })
  return NextResponse.json(goals)
}
