import React from 'react'

export const buttonFocusStyle =
  'focus:outline-none focus-visible:ring focus-visible:ring-offset-0 focus-visible:ring-blue-500 focus-visible:ring-offset-transparent'

const base = `transition-colors rounded-md text-sm font-medium`

export default function Button({
  children,
  className = '',
  padding = 'px-4 py-2',
  backgroundColor = 'hover:bg-blue-200 bg-blue-100',
  textColor = 'text-blue-700',
  color,
  disabled,
  ...props
}) {
  if (color) {
    backgroundColor = `hover:bg-${color}-200 bg-${color}-100`
    textColor = `text-${color}-700`
  }
  if (disabled) {
    className += ' opacity-50 pointer-events-none'
  }

  const style = `${className} ${buttonFocusStyle} ${padding} ${backgroundColor} ${textColor} ${base}`
  return (
    <button {...props} disabled={disabled} className={style}>
      {children}
    </button>
  )
}
