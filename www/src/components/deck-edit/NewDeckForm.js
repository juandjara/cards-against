import React, { useState } from 'react'
import InputStyles from '../Input'
import Button from '../Button'

export default function NewDeckForm ({ onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  function handleSubmit (ev) {
    ev.preventDefault()
    onSubmit({ name, description })
  }

  return (
    <form className="new-deck-form" onSubmit={handleSubmit}>
      <h2>Crear mazo</h2>
      <InputStyles 
        required
        type="text"
        name="deckName"
        value={name}
        onChange={ev => setName(ev.target.value)}
        placeholder="Nombre del mazo" />
      <InputStyles 
        as="textarea"
        name="deckDescription"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
        placeholder="Descripcion del mazo" />
      <Button>Guardar</Button>
    </form>
  )
}
