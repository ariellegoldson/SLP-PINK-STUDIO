import assert from 'node:assert/strict'
import prisma from '../src/lib/prisma'

async function run() {
  const created = await prisma.sessionTemplate.create({
    data: {
      name: 'Test Template',
      location: 'Room 1',
      durationMinutes: 30,
    },
  })
  assert.ok(created.id)

  const listed = await prisma.sessionTemplate.findMany()
  assert.ok(listed.find((t) => t.id === created.id))

  const updated = await prisma.sessionTemplate.update({
    where: { id: created.id },
    data: { name: 'Updated Template', location: 'Room 2' },
  })
  assert.equal(updated.name, 'Updated Template')

  await prisma.sessionTemplate.delete({ where: { id: created.id } })

  const list2 = await prisma.sessionTemplate.findMany()
  assert.ok(!list2.find((t) => t.id === created.id))

  await prisma.$disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
