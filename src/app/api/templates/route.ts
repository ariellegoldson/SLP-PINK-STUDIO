import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const teacherId = searchParams.get('teacherId')
  const classroomId = searchParams.get('classroomId')
  const where: any = {}
  if (teacherId) where.teacherId = Number(teacherId)
  if (classroomId) where.classroomId = Number(classroomId)

  const templates = await prisma.sessionTemplate.findMany({
    where,
    include: { students: { include: { student: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(templates)
}

export async function POST(req: Request) {
  const data = await req.json()
  const {
    name,
    teacherId,
    classroomId,
    location,
    durationMinutes,
    defaultActivity,
    defaultPromptingType,
    studentIds = [],
  } = data

  if (!name || !location || !durationMinutes) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const template = await prisma.sessionTemplate.create({
    data: {
      name,
      teacherId: teacherId ?? null,
      classroomId: classroomId ?? null,
      location,
      durationMinutes,
      defaultActivity,
      defaultPromptingType,
      students: {
        create: studentIds.map((id: number) => ({ studentId: id })),
      },
    },
    include: { students: { include: { student: true } } },
  })

  return NextResponse.json(template)
}
