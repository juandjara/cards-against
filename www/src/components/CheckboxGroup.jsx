import React from 'react'

export default function CheckboxGroup({ label = '', options, selected, onChange }) {
  function handleChange(ev) {
    const { name, checked } = ev.target
    let newSelection
    if (checked) {
      newSelection = selected.concat(name)
    } else {
      newSelection = selected.filter(v => v !== name)
    }
    onChange(newSelection)
  }

  return (
    <div>
      <p className="block ml-1 mb-2 text-sm text-gray-200 font-medium">{label}</p>
      <div className="space-y-4">
        {options.map(opt => (
          <label key={opt.value} className="flex items-start border border-gray-400 rounded-lg p-2">
            <input
              type="checkbox"
              name={opt.value}
              checked={selected.indexOf(opt.value) !== -1}
              onChange={handleChange}
              className="h-5 w-5 text-blue-500 rounded-sm"
            />
            <span className="ml-3 text-white font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
