import React from 'react'

export default function Input({ id, label, value, onChange, corner, type = 'text', placeholder }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-gray-50">
          {label}
        </label>
        {corner}
      </div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          className="text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
