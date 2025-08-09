import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const teacherId = searchParams.get('teacherId')
  const classroomId = searchParams.get('classroomId')
  const where: any = {}
  if (teacherId) where.teacherId = Number(teacherId)
  if (classroomId) where.classroomId = Number(classroomId)
  const students = await prisma.student.findMany({
    where,
    orderBy: { firstName: 'asc' },
  })
  return NextResponse.json(students)
}
