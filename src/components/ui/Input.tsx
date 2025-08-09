'use client'
import React, { forwardRef } from 'react'

export default forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-2xl border border-pink-600 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-pink-600 ${className}`}
      {...props}
    />
  )
})
