import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prismadb'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('studentId')
  const sessionId = searchParams.get('sessionId')
  const take = Number(searchParams.get('take') || '5')

  if (!studentId) {
    return NextResponse.json([], { status: 400 })
  }

  // fetch a single latest note when sessionId is provided
  if (sessionId) {
    const note = await prisma.note.findFirst({
      where: { studentId: Number(studentId), sessionId: Number(sessionId) },
      orderBy: { createdAt: 'desc' },
      include: { goalData: true },
    })
    return NextResponse.json(note)
  }

  // fetch recent notes for progress view
  const notes = await prisma.note.findMany({
    where: { studentId: Number(studentId) },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      goalData: {
        include: {
          studentGoal: {
            include: { goal: true },
          },
        },
      },
    },
  })
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const data = await req.json()

  // allow overwriting the last note when noteId provided
  if (data.noteId) {
    await prisma.noteGoalData.deleteMany({ where: { noteId: data.noteId } })
    const updated = await prisma.note.update({
      where: { id: data.noteId },
      data: {
        text: data.text,
        location: data.location,
        activity: data.activity,
        prompting: data.prompting,
        comments: data.comments,
        goalData: {
          create: (data.goalData || []).map((g: any) => ({
            accuracy: g.accuracy,
            trials: g.trials,
            studentGoal: { connect: { id: g.studentGoalId } },
          })),
        },
      },
    })
    return NextResponse.json(updated)
  }

  const note = await prisma.note.create({
    data: {
      text: data.text,
      location: data.location,
      activity: data.activity,
      prompting: data.prompting,
      comments: data.comments,
      session: { connect: { id: data.sessionId } },
      student: { connect: { id: data.studentId } },
      goalData: {
        create: (data.goalData || []).map((g: any) => ({
          accuracy: g.accuracy,
          trials: g.trials,
          studentGoal: { connect: { id: g.studentGoalId } },
        })),
      },
    },
  })

  return NextResponse.json(note)
}
