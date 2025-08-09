import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const variantClasses =
    variant === 'primary'
      ? 'bg-[#f5bcd6] text-gray-800 hover:bg-[#f1a7c8]'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  return (
    <button
      className={`rounded-2xl px-4 py-2 text-sm font-medium shadow-sm focus:outline-none transition-colors ${variantClasses} ${className}`}
      {...props}
    />
  )
}
