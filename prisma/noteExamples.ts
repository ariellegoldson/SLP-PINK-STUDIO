import { prisma } from '../src/lib/prisma'

export async function createNoteExample() {
  return prisma.note.create({
    data: {
      text: 'Example note',
      session: { connect: { id: 1 } },
      student: { connect: { id: 1 } },
      goalData: {
        create: [
          {
            accuracy: 80,
            trials: 10,
            studentGoal: { connect: { id: 1 } }
          }
        ]
      }
    }
  })
}

export async function getNotesForStudent(studentId: number) {
  return prisma.note.findMany({
    where: { studentId },
    include: {
      session: true,
      goalData: { include: { studentGoal: { include: { goal: true } } } }
    }
  })
}
