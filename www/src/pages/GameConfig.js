import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Select from 'react-select'
import useGlobalSlice from '../services/useGlobalSlice'
import useDecks from '../services/useDecks'
import config from '../config'
import RadioGroup from '../components/RadioGroup'
import CardLists from '../components/deck-edit/CardLists'
import { Link } from '@reach/router'
import { useAlerts } from '../components/Alerts'
import Player from '../components/Player'

import IconSave from '../components/icons/IconSave'
import IconAdd from '../components/icons/IconAdd'
import IconEdit from '../components/icons/IconEdit'
import IconViewVisible from '../components/icons/IconViewVisible'
import IconViewHidden from '../components/icons/IconViewHidden'
import IconArrowLeft from '../components/icons/IconArrowLeft'

const GameConfigStyle = styled.form`
  max-width: 960px;
  margin: 0 auto;
  margin-bottom: 3rem;
  padding: 1em 0;
  border-radius: 4px;

  h2 {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .input-block {
    margin-bottom: 32px;
    > label {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
      display: block;
      color: var(--colorMedium);
    }
    select {
      display: block;
    }
  }
  
  .radio-group {
    display: block;
    min-width: 260px;
  }

  .select-container {
    max-width: 260px;
  }

  .flex-block {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;

    .input-block {
      margin-right: 16px;
    }

    > div {
      /* flex: 1 1 calc(50% - 16px); */
    }
  }

  > button {
    margin-top: 16px;
  }

  .display {
    margin: 0;
    font-family: var(--fontDisplay), sans-serif;
    font-size: 42px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .card-lists {
    max-width: calc(100vw - 24px);
  }
  
  .align-center {
    text-align: center;
  }

  .players {
    display: flex;
    justify-content: center;
  }

  .select-actions {
    display: flex;
    align-items: center;
    margin-top: 8px;
    .action {
      display: flex;
      align-items: center;
      text-align: left;
      padding: 0;
      border: 0;
      background: none;
      color: var(--colorPrimary);
      margin-right: 16px;
      font-size: 12px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      svg {
        margin-right: 2px;
        width: 20px;
        height: 20px;
      }
    }
  }
`

function Loading () {
  return (
    <GameConfigStyle className="game-config">
      <h2 className="center">Cargando...</h2>
    </GameConfigStyle>
  )
}

function NoGame ({ id }) {
  return (
    <GameConfigStyle className="game-config">
      <h2 className="center">Ninguna partida activa con el c&oacute;digo <strong>{id}</strong></h2>
      <Link to="/" className="back">
        <IconArrowLeft width="20" height="20" />
        <span>Volver al men&uacute; principal</span>
      </Link>
    </GameConfigStyle>
  )
}

export default function GameConfig ({ navigate, gameId }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [addAlert] = useAlerts()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deckVisible, setDeckVisible] = useState(false)

  function setFormValue (key) {
    return function setFormValueInner (ev) {
      const value = ev.target ? ev.target.value : ev
      socket.emit('game:edit', { id: gameId, [key]: value })
    }
  }

  const [decks, setDecks] = useDecks()
  const deckOptions = Object.values(decks)
  .map(deck => ({
    ...deck,
    label: deck.name,
    value: deck.id
  }))

  const gameDeckIsNotSaved = game && game.deck && !deckOptions.some(d => d.id === game.deck.id)

  if (gameDeckIsNotSaved) {
    deckOptions.unshift(game.deck)
  }
 
  async function fetchGame () {
    setLoading(true)
    const res = await fetch(`${config.api}/games/${gameId}`)
    const data = await res.json()
    if (res.ok) {
      if (data.shuffled) {
        navigate(`/game/${gameId}`)
      }
      setGame(data)
      if (!currentUser.game) {
        socket.emit('game:join', { gameId, user: currentUser })
        setCurrentUser({ ...currentUser, game: gameId })
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

  function handleSubmit (ev) {
    ev.preventDefault()
    navigate(`/game/${gameId}`, { replace: true })
  }

  function saveCurrentDeck () {
    setDecks({ ...decks, [game.deck.id]: game.deck })
    addAlert({ text: 'Se ha guardado el mazo en este dispositivo' })
  }

  const rotationOptions = [
    { value: 'winner', label: 'El ganador de la ultima ronda' },
    { value: 'clockwise', label: 'El siguiente jugador de la lista' }
  ]

  if (loading) return <Loading />
  if (!loading && !game) return <NoGame id={gameId} />

  return (
    <GameConfigStyle onSubmit={handleSubmit} className="game-config">
      <h2>Nueva partida</h2>
      <div className="flex-block" style={{ justifyContent: 'space-between' }}>
        <div className="input-block">
          <label>¿Quién será El Juez de las Cartas en cada ronda?</label>
          <RadioGroup
            value={game.rotation}
            onChange={setFormValue('rotation')}
            options={rotationOptions}
          />
        </div>
        <div className="input-block">
          <label>Código</label>
          <p className="display">{gameId}</p>
        </div>
      </div>
      <div className="input-block">
        <label>Mazo de cartas</label>
        <Select
          value={game.deck}
          onChange={setFormValue('deck')}
          className="select-container" 
          options={deckOptions} />
        <footer className="select-actions">
          <Link to="/decks/new" className="action">
            <IconAdd />
            <span>Nuevo mazo</span>
          </Link>
          {game.deck && (
            <>
              {gameDeckIsNotSaved ? (
                <button type="button" className="action" onClick={saveCurrentDeck}>
                  <IconSave />
                  <span>Guardar mazo</span>
                </button>
              ) : (
                <Link to={`/decks/${game.deck.id}`} className="action">
                  <IconEdit />
                  <span>Editar mazo</span>
                </Link>
              )}
              <button type="button" className="action" onClick={() => setDeckVisible(!deckVisible)}>
                {deckVisible ? <IconViewHidden /> : <IconViewVisible />}
                <span>{deckVisible ? 'Ocultar' : 'Mostrar'} cartas</span>
              </button>
            </>
          )}
        </footer>
      </div>
      {deckVisible && (<div className="input-block">
        <CardLists
          cards={game.deck.cards.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))}
          editable={false} />
      </div>)}
      <div className="input-block">
        <label className="align-center">Jugadores</label>
        <ul className="players">
          {game.players.map(p => (
            <Player key={p.id} as="li" player={p} readerId={game.round.reader} />
          ))}
        </ul>
      </div>
      <Button disabled={!game.deck} className="big align-center" type="submit">Comenzar</Button>
    </GameConfigStyle>
  )
}
