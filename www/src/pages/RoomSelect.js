import React, { useEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Button from '../components/Button'
import { Link } from '@reach/router'

const RoomSelectStyles = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 1200px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
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
`

export default function RoomSelect () {
  const { data, error } = useSWR(
    'http://localhost:5000/rooms',
    (...args) => fetch(...args).then(res => res.json())
  )

  useEffect(() => {
    if (error) {
      console.log('fetch error', error)
    }
  }, [error])

  if (error) {
    return <div>Failed to load rooms</div>
  }

  const hasRooms = data && Object.keys(data).length

  return (
    <RoomSelectStyles className="room-select">
      <header>
        <h2>Salas disponibles</h2>
        <Link to="/roomedit">
          <Button>Crear sala</Button>
        </Link>
      </header>
      {data ? (
        hasRooms ? (
          <ul>
            {data.map(room => (
              <li key={room.name}>{room.name} ({room.sockets.length} jugador)</li>
            ))}
          </ul>
        ) : ( <p>No hay ninguna sala creada</p> )
      ) : (<p>Loading rooms ...</p>)}
    </RoomSelectStyles>
  )
}
