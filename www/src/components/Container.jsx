import React from 'react'

export default function Container({ children, className = '', ...props }) {
  const cn = `max-w-screen-lg mx-auto py-6 px-4 ${className}`
  return (
    <main className={cn} {...props}>
      {children}
    </main>
  )
}
