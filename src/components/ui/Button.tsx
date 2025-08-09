'use client'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const variantClasses =
    variant === 'primary'
      ? 'bg-pink text-text hover:bg-pink-600'
      : 'bg-gray-200 text-text hover:bg-gray-300'
  return (
    <button
      className={`rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-600 ${variantClasses} ${className}`}
      {...props}
    />
  )
}
