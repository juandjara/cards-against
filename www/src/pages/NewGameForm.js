import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Select from 'react-select'
import useGlobalSlice from '../services/useGlobalSlice'
import useDecks from '../services/useCards'
import config from '../config'
import RadioGroup from '../components/RadioGroup'
import CardLists from '../components/deck-edit/CardLists'
import uuid from 'uuid/v4'

const NewGameFormStyle = styled.form`
  max-width: 960px;
  margin: 0 auto;
  margin-bottom: 3rem;
  padding: 1em 0;
  border-radius: 4px;

  h2 {
    margin-top: .5rem;
    margin-bottom: 1.5rem;
  }

  .input-block {
    margin-bottom: 24px;
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

  .ar {
    text-align: right;
  }
`

export default function NewGameForm ({ navigate, gameId }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  function setFormValue (key) {
    return function setFormValueInner (ev) {
      const value = ev.target ? ev.target.value : ev
      socket.emit('game:edit', { id: gameId, [key]: value })
    }
  }

  const [decks] = useDecks()
  const deckOptions = Object.values(decks).map(deck => ({
    ...deck,
    label: deck.name,
    value: deck.id
  }))
  deckOptions.unshift({ label: 'Nuevo mazo', value: null, cards: [] })
 
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
  }

  const rotationOptions = [
    { value: 'winner', label: 'El ganador de la ultima ronda' },
    { value: 'clockwise', label: 'En el sentido de las agujas del reloj' }
  ]

  function addCard (newCard) {
    newCard = { ...newCard, id: uuid(), created_at: Date.now() }
    const deck = { ...game.deck, value: null, label: 'Nuevo mazo', cards: game.deck.cards.concat(newCard) }
    setFormValue('deck')(deck)
  }
  function editCard (card) {
    const deck = { ...game.deck, value: null, label: 'Nuevo mazo', cards: game.deck.cards.map(c => c.id === card.id ? card : c) }
    setFormValue('deck')(deck)
  }
  function removeCard (cardid) {
    const deck = { ...game.deck, value: null, label: 'Nuevo mazo', cards: game.deck.cards.filter(c => c.id !== cardid) }
    setFormValue('deck')(deck)
  }

  if (loading) {
    return (
      <div className="game-config">
        <h2>Cargando...</h2>
      </div>
    )
  }

  if (!loading && !game) {
    return (
      <div className="game-config">
        <h2>No hay ninguna partida aqui :c</h2>
      </div>
    )
  }

  return (
    <NewGameFormStyle onSubmit={handleSubmit} className="game-config">
      <div className="flex-block" style={{ justifyContent: 'space-between' }}>
        <div className="input-block">
          <label>Jugadores</label>
          <ul>
            {game.players.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
        <div className="input-block">
          <label>Nueva partida</label>
          <p className="display">{gameId}</p>
        </div>
      </div>
      <div className="input-block">
        <label>¿Quién lee la carta negra?</label>
        <RadioGroup
          value={game.rotation}
          onChange={setFormValue('rotation')}
          options={rotationOptions}
        />
      </div>
      <div className="input-block">
        <label>Mazo de cartas</label>
        <Select
          value={game.deck}
          onChange={setFormValue('deck')}
          className="select-container" 
          options={deckOptions} />
      </div>
      {game.deck && (<div className="input-block">
        <CardLists
          cards={game.deck.cards.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))}
          addCard={addCard}
          removeCard={removeCard}
          editCard={editCard} />
      </div>)}
      <Button disabled={!game.deck} className="big" type="submit">Comenzar</Button>
    </NewGameFormStyle>
  )
}
