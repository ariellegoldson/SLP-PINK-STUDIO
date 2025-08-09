import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import QuickStudentSearch from '@/components/QuickStudentSearch'
import Button from '@/components/ui/Button'

export const metadata = {
  title: 'SLP Pink Studio',
  description: 'School-based speech-language pathologist dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="bg-pink shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
            <h1 className="text-xl font-semibold">SLP Pink Studio</h1>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-pink-600">
                Dashboard
              </Link>
              <Link href="/students" className="hover:text-pink-600">
                Students
              </Link>
              <Link href="/schedule" className="hover:text-pink-600">
                Schedule
              </Link>
              <Link href="/reports" className="hover:text-pink-600">
                Reports
              </Link>
              <Link href="/settings" className="hover:text-pink-600">
                Settings
              </Link>
            </nav>
            <div className="flex-1" />
            <QuickStudentSearch />
            <Link href="/schedule" className="ml-4">
              <Button>New Session</Button>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 fade-up">{children}</main>
      </body>
    </html>
  )
}
