import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Input from '../components/Input'
import { useGlobalState } from '../GlobalState'

const RoomSelectStyles = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 600px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      margin: 12px 0;
    }
  }
  ul {
    list-style: none;
    padding: .5rem 1rem;
    margin: 0;
    border: 1px solid #ccc;
    min-height: 60vh;
    border-radius: 2px;
    overflow: auto;
  }
  li {
    padding: 8px 12px;
    & + li {
      border-top: 1px solid #ccc;
    }
    &:hover {
      background-color: #f4f4f4;
      cursor: pointer;
    }
  }
  form {
    display: flex;
    button {
      flex-shrink: 0;
    }
  }
`

function RoomForm ({ onSubmit }) {
  const [newRoom, setNewRoom] = useState("")

  function handleNewRoomSubmit (ev) {
    ev.preventDefault()
    onSubmit(newRoom)
  }

  return (
    <form onSubmit={handleNewRoomSubmit}>
      <Input 
        required
        type="text"
        name="newRoom"
        value={newRoom}
        onChange={ev => setNewRoom(ev.target.value)}
        placeholder="Nombre de la sala" />
      <Button type="submit">Crear sala</Button>
    </form>
  )
}

export default function RoomSelect () {
  const { socket, currentUser, setCurrentUser, rooms } = useGlobalState()
  const [showRoomForm, setShowRoomForm] = useState(false)

  function handleNewRoom (room) {
    setCurrentUser({ ...currentUser, room })
    socket.emit('user:join', { ...currentUser, room })
  }

  return (
    <RoomSelectStyles className="room-select">
      <header>
        <h2>Salas disponibles</h2>
        {!showRoomForm && (<Button onClick={() => setShowRoomForm(true)}>Nueva sala</Button>)}
      </header>
      {showRoomForm && (<RoomForm onSubmit={handleNewRoom} />)}
      <ul>
        {rooms.length === 0 ? (
          <p>No hay ninguna sala creada</p>
        ) : rooms.map(([room, users]) => (
          <li key={room}>
            <span>{room}</span>{' '}
            ({users.map(u => String(u.name)).join(', ')})
          </li>
        ))}
      </ul>
    </RoomSelectStyles>
  )
}
