import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id)
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

  const updated = await prisma.$transaction(async (tx) => {
    await tx.sessionTemplateStudent.deleteMany({ where: { sessionTemplateId: id } })
    const tpl = await tx.sessionTemplate.update({
      where: { id },
      data: {
        name,
        teacherId: teacherId ?? null,
        classroomId: classroomId ?? null,
        location,
        durationMinutes,
        defaultActivity,
        defaultPromptingType,
        students: {
          create: studentIds.map((sid: number) => ({ studentId: sid })),
        },
      },
      include: { students: { include: { student: true } } },
    })
    return tpl
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id)
  await prisma.sessionTemplate.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
