"use client"
import React from 'react'
import Button from './Button'

interface Props {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  children?: React.ReactNode
}

export default function EmptyState({ title, description, actionLabel, onAction, children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-text">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-600">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
