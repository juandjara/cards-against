import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import { Link, navigate } from '@reach/router'
import config from '../config'
import useGlobalSlice from '../services/useGlobalSlice'

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
    box-shadow: -4px 4px 4px 0 rgba(0,0,0,0.2);
    list-style: none;
    padding: .5rem 1rem;
    margin: 0;
    border: 1px solid var(--colorLow);
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
    margin-bottom: 12px;
    button {
      flex-shrink: 0;
      margin-left: 12px;
    }
  }
`

export default function RoomSelect () {
  const [games, setGames] = useState([])
  const [socket] = useGlobalSlice('socket')

  function fetchGames () {
    return fetch(`${config.api}/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data)
      })
  }

  useEffect(() => {
    fetchGames()
  }, [])

  useEffect(() => {
    socket.on('game:created', () => fetchGames())
    socket.on('user:joined', () => fetchGames())
    socket.on('user:left', () => fetchGames())

    return () => {
      socket.off('game:created')
      socket.off('user:joined')
      socket.off('user:left')
    }
  }, [socket, games])

  return (
    <RoomSelectStyles className="room-select">
      <header>
        <h2>Partidas disponibles</h2>
        <Button onClick={() => navigate('/room/new')}>Nueva partida</Button>
      </header>
      <ul>
        {games.length === 0 ? (
          <p>No hay ninguna partida creada</p>
        ) : games.map(game => (
          <li key={game.id}>
            <Link to={`/room/${game.id}`}>
              <span>{game.name}</span>{' '}
              <span>({game.players.length} jugador{game.players.length === 1 ? '' : 'es'})</span>
            </Link>
          </li>
        ))}
      </ul>
    </RoomSelectStyles>
  )
}
