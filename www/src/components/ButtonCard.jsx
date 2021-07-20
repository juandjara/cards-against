import React from 'react'

const bgmap = {
  white: 'white',
  black: '#333'
}

const colormap = {
  white: '#333',
  black: 'white'
}

export default function ButtonCard({
  as: Base = 'button',
  type = 'white',
  text = '',
  className = '',
  br = 'rounded-xl',
  style = {},
  ...props
}) {
  const bg = bgmap[type]
  const color = colormap[type]
  const animation = 'hover:shadow-lg hover:scale-105 duration-300 transform transition'
  return (
    <Base
      style={{ backgroundColor: bg, ...style }}
      className={`${className} ${animation} flex justify-center items-center ${br} w-40 h-40 p-3`}
      {...props}
    >
      <p style={{ color }} className="font-semibold text-center">
        {text}
      </p>
    </Base>
  )
}
