import React from 'react'
import RadioButton from './RadioButton'
import styled from 'styled-components'

const RadioGroupStyles = styled.div`
  margin: 24px 0;
  > p {
    margin: 8px 0;
  }
`

export default function RadioGroup ({ options, label, name, value, onChange }) {
  return (
    <RadioGroupStyles className="radio-group">
      <p>{label}</p>
      {options.map(opt => (
        <RadioButton
          name={name}
          label={opt.label}
          value={opt.value}
          checked={opt.value === value}
          onChange={ev => onChange(ev.target.value)} />
      ))}
    </RadioGroupStyles>
  )
}