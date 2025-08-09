import { PrismaClient } from '@prisma/client';
import { GOAL_BANK } from './goal_bank';

const prisma = new PrismaClient();

async function main() {
  // Core reference data
  for (const [areaName, goals] of Object.entries(GOAL_BANK)) {
    await prisma.targetArea.create({
      data: {
        name: areaName,
        goals: {
          create: goals.map((description) => ({ description })),
        },
      },
    })
  }

  // Minimal users and classroom
  const teacher = await prisma.teacher.create({
    data: { name: 'Test Teacher' },
  })

  const classroom = await prisma.classroom.create({
    data: { name: 'Room 101', teacherId: teacher.id },
  })

  const student = await prisma.student.create({
    data: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: new Date('2015-01-01'),
      grade: '1',
      teacherId: teacher.id,
      classroomId: classroom.id,
    },
  })

  const group = await prisma.group.create({
    data: {
      name: 'Group A',
      students: { connect: { id: student.id } },
    },
  })

  await prisma.session.create({
    data: {
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      location: 'Room 101',
      groupId: group.id,
    },
  })

  await prisma.sessionTemplate.create({
    data: {
      name: 'Default Template',
      teacherId: teacher.id,
      classroomId: classroom.id,
      location: 'Room 101',
      durationMinutes: 30,
      students: { create: { studentId: student.id } },
    },
  })
}

main()
  .then(async () => {
    console.log('Seeding completed');
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
