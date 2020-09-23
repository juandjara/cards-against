import React from 'react'
import styled from 'styled-components'

const RadioGroupStyles = styled.div`
  font-size: 14px;
  line-height: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-start;
  label {
    display: block;
    margin-right: 8px;
    padding: 2px 0;
    cursor: pointer;
  }
  span {
    margin-left: 4px;
  }
`

export default function RadioGroup ({ name, options, value, onChange, required }) {
  return (
    <RadioGroupStyles className="radio-group">
      {options.map(opt => (
        <label key={opt.value}>
          <input type="radio"
            required={required}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            value={opt.value} name={name} />
          <span>{opt.label}</span>
        </label>
      ))}
    </RadioGroupStyles>
  )
}
