import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prismadb'

export async function POST(req: Request) {
  const data = await req.json()

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
          studentGoal: { connect: { id: g.studentGoalId } }
        }))
      }
    }
  })

  return NextResponse.json(note)
}
