import prisma from '@/lib/prisma'

async function deleteTemplate(id: number) {
  'use server'
  await prisma.sessionTemplate.delete({ where: { id } })
}

export default async function TemplatesPage() {
  const templates = await prisma.sessionTemplate.findMany({
    include: { students: { include: { student: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return (
    <section className="rounded-md bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-pink-800">Session Templates</h2>
      <ul className="space-y-2">
        {templates.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded bg-pink-50 p-2">
            <div>
              <p className="font-medium text-pink-900">{t.name}</p>
              <p className="text-sm text-pink-700">{t.students.length} students</p>
            </div>
            <form action={deleteTemplate.bind(null, t.id)}>
              <button className="rounded bg-pink-200 px-2 py-1 text-pink-900" type="submit">
                Delete
              </button>
            </form>
          </li>
        ))}
        {templates.length === 0 && (
          <li className="text-pink-700">No templates yet.</li>
        )}
      </ul>
    </section>
  )
}
