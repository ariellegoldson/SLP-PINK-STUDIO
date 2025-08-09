import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'SLP Pink Studio',
  description: 'School-based speech-language pathologist dashboard'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        <nav className="w-64 bg-primary text-white p-4 rounded-r-md">
          <h1 className="mb-8 text-2xl font-semibold">SLP Pink Studio</h1>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="block rounded-md px-4 py-2 hover:bg-white/20">Dashboard</Link>
            </li>
            <li>
              <Link href="/students" className="block rounded-md px-4 py-2 hover:bg-white/20">Students</Link>
            </li>
            <li>
              <Link href="/schedule" className="block rounded-md px-4 py-2 hover:bg-white/20">Schedule</Link>
            </li>
            <li>
              <Link href="/reports" className="block rounded-md px-4 py-2 hover:bg-white/20">Reports</Link>
            </li>
            <li>
              <Link href="/settings" className="block rounded-md px-4 py-2 hover:bg-white/20">Settings</Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  )
}
