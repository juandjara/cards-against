import React from 'react'

export default function Input({
  id,
  label,
  labelColor = 'text-gray-50',
  value,
  onChange,
  corner,
  type = 'text',
  placeholder,
  required,
  as: asProp,
  className = '',
  ...props
}) {
  const Component = asProp === 'textarea' ? 'textarea' : 'input'
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        {label && (
          <label htmlFor={id} className={`${labelColor} block text-sm font-medium`}>
            {label}
          </label>
        )}
        {corner}
      </div>
      <div className={['relative rounded-md shadow-sm', label ? 'mt-1' : ''].join(' ')}>
        <Component
          type={type}
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          className="text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          required={required}
          {...props}
        />
      </div>
    </div>
  )
}
