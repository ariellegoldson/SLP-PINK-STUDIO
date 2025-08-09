import { Session, Group, Student } from '@prisma/client'

export type SessionStatus = 'UPCOMING' | 'SEEN' | 'MISSED'

export type SessionWithGroup = Session & {
  group: (Group & { students: Student[] }) | null
  status: SessionStatus
}

export const SESSION_STATUSES: SessionStatus[] = ['UPCOMING', 'SEEN', 'MISSED']
