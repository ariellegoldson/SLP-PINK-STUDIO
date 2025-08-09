import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const teacherId = searchParams.get('teacherId')
  const where = teacherId ? { teacherId: Number(teacherId) } : {}
  const classrooms = await prisma.classroom.findMany({
    where,
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(classrooms)
}
