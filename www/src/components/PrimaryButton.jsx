import React from 'react'
import Button from './Button'

export default function PrimaryButton({ className = '', ...props }) {
  return (
    <Button
      backgroundColor="bg-blue-500 hover:bg-blue-600"
      textColor="white"
      className={`${className} font-semibold hover:shadow-sm`}
      {...props}
    />
  )
}
