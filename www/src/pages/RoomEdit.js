import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../components/ButtonOutline'

const RoomEditStyles = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 1200px;
  .name-input {
    display: block;
    padding: 8px 12px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0, 0.2);
    /* box-shadow: 0 2px 8px rgba(0,0,0, 0.1); */
    margin-bottom: 24px;
  }
  label {
    display: block;
  }
  .radio-group {
    margin-bottom: 24px;
    > p {
      margin-bottom: 8px;
    }
  }
  .radio-option + .radio-option {
    margin-top: 8px;
  }
  .radio-input {
    margin-right: 8px;
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
          <label className="radio-option">
            <input
              type="radio"
              name="czar-rotation"
              value="winner"
              onChange={ev => setRotation(ev.target.value)}
              checked={rotation === 'winner'}
              className="radio-input"
            />
            El que gana la última ronda
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="czar-rotation"
              value="clockwise"
              onChange={ev => setRotation(ev.target.value)}
              checked={rotation === 'clockwise'}
              className="radio-input"
            />
            Rotando en el sentido de las agujas del reloj
          </label>
        </div>
        <Button>Enviar</Button>
      </form>
    </RoomEditStyles>
  )
}
