import prisma from '@/lib/prisma'

export default async function StudentPage({ params }: { params: { id: string } }) {
  const student = await prisma.student.findUnique({
    where: { id: Number(params.id) },
    include: { teacher: true, classroom: true },
  })
  if (!student) {
    return <div className="p-4">Student not found</div>
  }
  return (
    <section className="rounded-md bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">
        {student.firstName} {student.lastName}
      </h2>
      <p className="mt-2 text-gray-600">Grade: {student.grade}</p>
      <p className="mt-1 text-gray-600">Teacher: {student.teacher.name}</p>
      <p className="mt-1 text-gray-600">Classroom: {student.classroom.name}</p>
    </section>
  )
}
