import React from 'react'

export default function RadioGroup({ label = '', name = '', options, selected, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block ml-1 mb-2 text-sm text-gray-200 font-medium">
        {label}
      </label>
      <div className="space-y-3">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected === opt.value}
              onChange={ev => onChange(ev.target.value)}
              className="h-5 w-5 text-blue-500"
            />
            <span className="ml-3 text-white font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
