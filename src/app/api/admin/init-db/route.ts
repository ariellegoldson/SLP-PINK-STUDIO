import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function POST() {
  try {
    execSync('npx prisma db push', { stdio: 'ignore' })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
