import React from 'react'

export default function Container({ children, maxw = 'max-w-screen-lg', className = '', ...props }) {
  const cn = `mx-auto py-6 px-4 ${maxw} ${className}`
  return (
    <main className={cn} {...props}>
      {children}
    </main>
  )
}
