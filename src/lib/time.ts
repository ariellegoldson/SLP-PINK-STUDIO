export function parseTime(time: string): Date {
  const [hour, minute] = time.split(':').map(Number)
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d
}

export function formatTime(date: Date): string {
  return date.toISOString().substring(11, 16)
}

export function getDefaultSlotTimes({
  hour,
  minute,
  slotMinutes,
}: {
  hour: number
  minute: number
  slotMinutes: number
}): { startTime: string; endTime: string } {
  const start = new Date()
  start.setHours(hour, minute, 0, 0)
  const end = new Date(start.getTime() + slotMinutes * 60000)
  return { startTime: formatTime(start), endTime: formatTime(end) }
}
