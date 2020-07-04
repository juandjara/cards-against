import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import { Link, navigate } from '@reach/router'
import config from '../config'
import useGlobalSlice from '../services/useGlobalSlice'
import IconInterface from '../components/icons/IconInterface'

const RoomSelectStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);

  .main-btn {
    min-width: 250px;
    background: transparent;
    color: var(--colorPrimary);
    border: 2px solid currentColor;
    margin-bottom: 32px;
    padding: 15px 30px;
    font-size: 20px;
    font-weight: 600;
    box-shadow: 0 4px 6px hsla(0, 0%, 0%, 0.2);
    transition: box-shadow 0.25s ease;

    &:active {
      box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.2);
    }
  }

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

  footer {
    position: fixed;
    bottom: 8px;
    right: 12px;
    display: flex;
    align-items: center;
    color: var(--colorMidHigh);
    font-size: 14px;

    a {
      color: inherit;
    }

    svg {
      margin-right: 4px;
      width: 20px;
      height: 20px;
      color: var(--colorMedium);
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
      {/* <header>
        <h2>Partidas disponibles</h2>
        <Button onClick={() => navigate('/room/new')}>Nueva partida</Button>
      </header> */}
      <section>
        <Button className="main-btn">Unirse a una partida</Button>
      </section>
      <Button onClick={() => navigate('/room/new')} className="main-btn">Nueva partida</Button>
      <Button onClick={() => navigate('/decks')} className="main-btn">Mis mazos</Button>
      <footer>
        <IconInterface />
        <span> by <a href="https://juandjara.com" target="_blank">juandjara</a></span>
      </footer>
      {/* <ul>
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
      </ul> */}
    </RoomSelectStyles>
  )
}
