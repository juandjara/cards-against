import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../components/ButtonOutline'
import RadioButton from '../components/RadioButton'

const RoomEditStyles = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 1200px;
  .name-input {
    display: block;
    padding: 8px 12px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0, 0.25);
    /* box-shadow: 0 2px 8px rgba(0,0,0, 0.1); */
    margin-bottom: 24px;

    &:hover, &:focus {
      border-color: #228BEC;
    }
    &:focus {
      box-shadow: 
        /* inset 0 1px 1px rgba(0, 0, 0, 0.075),  */
        0 0 0 3px rgba(19, 133, 229, 0.1);
      outline: 0;
    }
  }
  label {
    display: block;
  }
  .radio-group {
    margin: 24px 0;
    > p {
      margin: 8px 0;
    }
  }
`

export default function RoomEdit () {
  const [name, setName] = useState("")
  const [rotation, setRotation] = useState("winner")

  function handleSubmit (ev) {
    ev.preventDefault()
    // set global state for room
    // redirect to room page
  }

  return (
    <RoomEditStyles className="room-edit">
      <h2>Crear sala</h2>
      <form onSubmit={handleSubmit}>
        <input 
          required
          type="text"
          name="name"
          value={name}
          onChange={ev => setName(ev.target.value.trim())}
          className="name-input"
          placeholder="Nombre de la sala" />
        <div className="radio-group">
          <p>¿Quién lee la carta negra?</p>
          <RadioButton
            label="El que gana la última ronda"
            name="czar-rotation"
            value="winner"
            onChange={ev => setRotation(ev.target.value)}
            checked={rotation === 'winner'}
          />
          <RadioButton
            label="Rotando en sentido horario"
            name="czar-rotation"
            value="clockwise"
            onChange={ev => setRotation(ev.target.value)}
            checked={rotation === 'clockwise'}
          />
        </div>
        <Button>Enviar</Button>
      </form>
    </RoomEditStyles>
  )
}
