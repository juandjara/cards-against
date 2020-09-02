import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Select from 'react-select'
import useGlobalSlice from '../services/useGlobalSlice'
import useDecks from '../services/useCards'
import config from '../config'
import RadioGroup from '../components/RadioGroup'
import CardLists from '../components/deck-edit/CardLists'
import { Link } from '@reach/router'

import IconSave from '../components/icons/IconSave'
import AddIcon from '../components/icons/AddIcon'
import EditIcon from '../components/icons/EditIcon'
import IconViewVisible from '../components/icons/IconViewVisible'
import IconViewHidden from '../components/icons/IconViewHidden'
import IconArrowLeft from '../components/icons/IconArrowLeft'

const GameConfigStyle = styled.form`
  max-width: 960px;
  margin: 0 auto;
  margin-bottom: 3rem;
  padding: 1em 0;
  border-radius: 4px;

  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin-bottom: 12px;

    span {
      margin-left: 2px;
    }

    svg .primary {
      display: none;
    }
  }

  h2 {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    margin-top: 8px;
    margin-bottom: 16px;

    &.center {
      text-align: center;
    }
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
    li {
      background-color: white;
      padding: 6px 12px;
      border-radius: 16px;
      margin-top: 4px;
      margin-bottom: 8px;
      margin-right: 8px;
    }
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

export default function GameConfig ({ navigate, gameId }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
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
    navigate(`/game/${gameId}`)
  }

  function saveCurrentDeck () {
    // TODO: replace with "react-toast" or "react-alert" or something like that
    setDecks({ ...decks, [game.deck.id]: game.deck })
    window.alert('Se ha guardado el mazo en este dispositivo')
  }

  const rotationOptions = [
    { value: 'winner', label: 'El ganador de la ultima ronda' },
    { value: 'clockwise', label: 'En el sentido de las agujas del reloj' }
  ]

  if (loading) {
    return (
      <GameConfigStyle className="game-config">
        <h2 className="center">Cargando...</h2>
      </GameConfigStyle>
    )
  }

  if (!loading && !game) {
    return (
      <GameConfigStyle className="game-config">
        <h2 className="center">Ninguna partida activa con el c&oacute;digo <strong>{gameId}</strong></h2>
        <Link to="/" className="back">
          <IconArrowLeft width="20" height="20" />
          <span>Volver al men&uacute; principal</span>
        </Link>
      </GameConfigStyle>
    )
  }

  return (
    <GameConfigStyle onSubmit={handleSubmit} className="game-config">
      <h2>Nueva partida</h2>
      <div className="flex-block" style={{ justifyContent: 'space-between' }}>
        <div className="input-block">
          <label>¿Quién lee la carta negra?</label>
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
            <AddIcon />
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
                  <EditIcon />
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
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
      <Button disabled={!game.deck} className="big align-center" type="submit">Comenzar</Button>
    </GameConfigStyle>
  )
}
