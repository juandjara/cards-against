import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Select from 'react-select'
import useGlobalSlice from '../services/useGlobalSlice'
import useDecks from '../services/useCards'
import uuid from 'uuid/v4'
import config from '../config'
import RadioGroup from '../components/RadioGroup'

const NewGameFormStyle = styled.form`
  max-width: 960px;
  margin: 0 auto;
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
    min-width: 200px;
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
      flex: 1 1 calc(50% - 16px);
    }
  }

  .select-container {
    max-width: 200px;
  }

  > button {
    margin-top: 16px;
  }

  .display {
    margin: 0;
    font-family: var(--fontDisplay), sans-serif;
    font-size: 42px;
    line-height: 48px;
    font-weight: 600;
    letter-spacing: 1px;
  }
`

export default function NewGameForm ({ navigate, roomid }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [form, setForm] = useState({
    id: uuid(),
    deck: null,
    rotation: 'winner'
  })

  const [decks] = useDecks()
  const deckOptions = Object.values(decks).map(deck => ({
    ...deck,
    label: deck.name,
    value: deck.id
  }))

  function fetchGame () {
    return fetch(`${config.api}/games/${roomid}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setForm(data)
      })
  }

  useEffect(() => {
    fetchGame()
  }, [])
    
  function handleSubmit (ev) {
    ev.preventDefault()
    setCurrentUser({ ...currentUser, room: form.id })
    socket.emit('game:create', { ...form, deck: form.deck.value })
    socket.emit('user:join', { game: form.id, user: currentUser })
    navigate('/')
  }

  function setFormValue (key) {
    return function setFormValueInner (ev) {
      const value = ev.target ? ev.target.value : ev
      setForm(form => ({ ...form, [key]: value }))
    }
  }

  const rotationOptions = [
    { value: 'winner', label: 'El ganador de la ultima ronda' },
    { value: 'clockwise', label: 'En el sentido de las agujas del reloj' }
  ]

  return (
    <NewGameFormStyle onSubmit={handleSubmit} className="game-config">
      <h2>Nueva partida</h2>
      <div className="input-block">
        <label>Código</label>
        <p className="display">X5G8</p>
      </div>
      <div className="flex-block">
        <div className="input-block">
          <label>Jugadores</label>
          <ul>
            <li>Notas 4</li>
            <li>Notas 3</li>
            <li>Notas 2</li>
            <li>Notas 1</li>
          </ul>
        </div>
        <div className="input-block">
          <label>¿Quién lee la carta negra?</label>
          <RadioGroup
            value={form.rotation}
            onChange={setFormValue('rotation')}
            options={rotationOptions}
          />
        </div>
      </div>
      <div className="input-block">
        <label>Mazo de cartas</label>
        <Select
          value={form.deck}
          onChange={setFormValue('deck')}
          className="select-container" 
          options={deckOptions} />
      </div>
      <Button type="submit">Comenzar</Button>
    </NewGameFormStyle>
  )
}
