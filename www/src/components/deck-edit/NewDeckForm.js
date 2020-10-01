import React, { useState } from 'react'
import InputStyles from '../Input'
import Button from '../Button'
import styled from 'styled-components'

const DeckFormStyles = styled.form`
  label {
    font-size: 12px;
    color: var(--colorMidHigh);
    display: block;
    margin-bottom: 4px;
  }

  input {
    margin-bottom: 1.5rem;
  }

  textarea {
    margin-bottom: 1.5rem;
    font: inherit;
    padding-top: 4px;
    height: 80px;
    resize: none;
  }

  input, textarea {
    max-width: 320px;
  }

  .cancel-btn {
    background: none;
    border: none;
    &:hover, &:focus {
      text-decoration: underline;
    }
  }
`

export default function NewDeckForm ({ deck = {}, onSubmit }) {
  const [name, setName] = useState(deck.name || '')
  const [description, setDescription] = useState(deck.description || '')
  function handleSubmit (ev) {
    ev.preventDefault()
    onSubmit({ name, description })
  }

  return (
    <DeckFormStyles className="new-deck-form" onSubmit={handleSubmit}>
      <h2>Edición de mazo</h2>
      <label htmlFor="deckName">Nombre</label>
      <InputStyles
        required
        type="text"
        name="deckName"
        value={name}
        onChange={ev => setName(ev.target.value)}
        placeholder="Nombre del mazo" />
      <label htmlFor="deckDescription">Descripci&oacute;n</label>
      <InputStyles
        as="textarea"
        name="deckDescription"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
        placeholder="Descripcion del mazo" />
      <Button>Guardar</Button>
      <Button className="cancel-btn"
        onClick={() => window.history.back()}
        type="button">Cancelar</Button>
    </DeckFormStyles>
  )
}
