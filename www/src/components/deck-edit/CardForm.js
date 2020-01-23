import React, { useState } from 'react'
import styled from 'styled-components'
import InputStyles from '../Input'
import CheckIcon from '../icons/CheckIcon'
import CloseIcon from '../icons/CloseIcon'
import CardActionsStyle from './CardActionsStyle'

const CardFormStyles = styled.form`
  position: relative;
  margin-left: 20px;

  > textarea {
    width: 250px;
    height: 250px;
    margin-bottom: 1.5rem;
    font: inherit;
    padding-top: 4px;
    resize: none;
  }
`

export default function CardForm ({ initialValue = "", onSubmit, onCancel }) {
  const [text, setText] = useState(initialValue)
  function handleSubmit (ev) {
    ev.preventDefault()
    setText("")
    onSubmit(text)
  }
  function handleCancel () {
    setText("")
    onCancel()
  }
  return (
    <CardFormStyles onSubmit={handleSubmit}>
      <CardActionsStyle>
        <button title="Guardar" disabled={!text} type="submit">
          <CheckIcon />
        </button>
        <button title="Cancelar" type="button" onClick={handleCancel}>
          <CloseIcon />
        </button>
      </CardActionsStyle>
      <InputStyles 
        as="textarea"
        value={text}
        onChange={ev => setText(ev.target.value)}
        placeholder="Escribe el contenido de la nueva carta..." />
    </CardFormStyles>
  )
}