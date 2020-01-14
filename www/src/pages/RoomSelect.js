import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Input from '../components/Input'
import config from '../config'
import useRoomList from '../services/useRoomList'
import { useGlobalState } from '../GlobalState'

const RoomSelectStyles = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 600px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  const [rooms, setRooms] = useRoomList()
  const [error, setError] = useState(null)
  const { socket, currentUser } = useGlobalState()
  
  async function fetchRooms () {
    try {
      const res = await window.fetch(`${config.api}/rooms`)
      const data = await res.json()
      setRooms(data)
    } catch (err) {
      console.error(err)
      setError(err)
    }
  }

  useEffect(() => { fetchRooms() }, [])

  console.log('rooms', rooms)

  function handleNewRoom (room) {
    socket.emit('user:join', { ...currentUser, room })
  }
  
  return (
    <RoomSelectStyles className="room-select">
      <h2>Salas disponibles</h2>
      {error ? (
        <h3 style={{ color: 'red', padding: '1rem' }}>Error fetching rooms</h3>
      ) : (
        <ul>
          {rooms.length === 0 ? (
            <p>No hay ninguna sala creada</p>
          ) : rooms.map(room => (
            <li key={room.name}>
              <span>{room.name}</span>{' '}
              ({room.users.map(u => String(u.name)).join(', ')})
            </li>
          ))}
        </ul>
      )}
      <RoomForm onSubmit={handleNewRoom} />
    </RoomSelectStyles>
  )
}
