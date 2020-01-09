import React, { useEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

const RoomSelectStyles = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 1200px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  button {
    font-size: 14px;
    font-weight: bold;
    background: transparent;
    border: 2px solid #222;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }
`

export default function RoomSelect () {
  const { data, error } = useSWR('http://localhost:5000/rooms', fetch)

  useEffect(() => {
    console.log('fetch error', error)
  }, [error])

  if (error) {
    return <div>Failed to load rooms</div>
  }

  const hasRooms = data && Object.keys(data).length

  return (
    <RoomSelectStyles className="room-select">
      <header>
        <h2>Salas disponibles</h2>
        <button>Crear sala</button>
      </header>
      {data ? (
        hasRooms ? (
          <ul>
            {Object.keys(data).map(room => (
              <li key={room}>{room}</li>
            ))}
          </ul>
        ) : ( <p>No hay ninguna sala creada</p> )
      ) : (<p>Loading rooms ...</p>)}
    </RoomSelectStyles>
  )
}
