import React, { useState, useEffect } from 'react'
import useGlobalSlice from '../services/useGlobalSlice'
import config from '../config'
import styled from 'styled-components'
import CardStyles from '../components/deck-edit/CardStyles'

const GameStyles = styled.div`
  padding-top: 2rem;
  min-height: calc(100vh - 65px);
  max-width: calc(100vw - 24px);
  position: relative;

  .heading {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .heading-small {
    margin: 12px 8px;
    font-size: 16px;
    line-height: 20px;
    font-weight: normal;
  }

  section {
    &:not(.player-hand) {
      padding-bottom: 24px;
    }

    &.cards-in-game {
      padding-bottom: 216px;
    }

    @media (max-width: 45rem) {
      padding-bottom: 200px;
    }
    
    & + section {
      border-top: 1px solid var(--colorModerate);
    }
  }

  .top {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: flex-start;

    .players {
      flex-basis: 160px;
      padding-right: 16px;
      margin-right: 32px;
      margin-bottom: 32px;
      
      .label {
        font-size: 14px;
        color: var(--colorMedium);
      }

      li {
        background-color: white;
        max-width: 156px;
        padding: 4px 8px;
        border-radius: 8px;
        margin: 8px 0;
      }
    }

    .card {
      & + .card {
        margin-left: 12px;
      }
    }
  }

  .player-hand {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    max-height: 216px;
    overflow: hidden;

    @media (max-width: 45rem) {
      max-height: 200px;
    }
  }

  .card-list {
    list-style: none;
    margin: 0;

    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    overflow: auto;

    .card {
      position: relative;
      margin-top: 16px;
      margin-bottom: 8px;

      & + .card {
        margin-left: -32px;
      }

      &.drag {
        background-color: var(--colorVeryLow);
      }
    }
  }

  @media (max-width: 45rem) {
    .card {
      width: 160px;
      height: 160px;
    }
  }
`

const CardPlaceholder = styled.div`
  width: 180px;
  height: 180px;
  padding: 12px 16px;
  padding-bottom: 24px;
  border-radius: 16px;
  border: 2px dashed #333;

  &.drag {
    background-color: white;
  }
`

export default function Game ({ navigate, gameId }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchGame () {
    setLoading(true)
    const res = await fetch(`${config.api}/games/${gameId}`)
    const data = await res.json()
    if (res.ok) {
      setGame(data)
      if (!currentUser.game) {
        socket.emit('game:join', { gameId, user: currentUser })
        setCurrentUser({ ...currentUser, game: gameId })
      }
      if (data.owner === currentUser.id && !data.started) {
        socket.emit('game:start', gameId)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGame()
    socket.on('game:edit', game => {
      setGame(game)
    })
    return () => {
      socket.off('game:edit')
    }
  }, [socket])

  if (loading) {
    return (
      <GameStyles className="game">
        <h2 className="heading">Cargando...</h2>
      </GameStyles>
    )
  }

  if (!loading && !game) {
    return (
      <GameStyles className="game">
        <h2 className="heading">No hay ninguna partida aqui :c</h2>
      </GameStyles>
    )
  }

  function onDragEnter (ev) {
    ev.target.classList.add('drag')
  }
  function onDragLeave (ev) {
    ev.target.classList.remove('drag')
  }
  function onDragStart (ev) {
    ev.target.classList.add('drag')
  }
  function onDragEnd (ev) {
    ev.target.classList.remove('drag')
  }

  return (
    <GameStyles className="game">
      <section className="top">
        <div className="block players">
          <p className="label">Jugadores</p>
          <ul>
            {game.players.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
        <CardStyles className="card black">
          {game.deck.cards.find(c => c.type === 'black').text}
        </CardStyles>
        {/** TODO: Mostrar CardPlaceholder solo en fase 2 (elegir carta blanca ganadora) */}
        <CardPlaceholder className="card card-placeholder">
          <p>Arrastra aquí la carta ganadora</p>
        </CardPlaceholder>
      </section>
      <section className="cards-in-game">
        <h3 className="heading-small">Cartas en juego</h3>
        <ul className="card-list">
          {game.players.map(p => (
            <CardPlaceholder key={p.id}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              className="card card-placeholder">
              <p></p>
            </CardPlaceholder>
          ))}
        </ul>
      </section>
      <section className="player-hand">
        <h3 className="heading-small">Cartas en tu mano</h3>
        <ul className="card-list">
          {game.deck.cards.filter(c => c.type === 'white').slice(0, 5).map(c => (
            <CardStyles
              draggable="true"
              key={c.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              className="card white translate-y">
              <p>{c.text}</p>
            </CardStyles>
          ))}
        </ul>
      </section>
    </GameStyles>
  )
}
