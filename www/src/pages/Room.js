import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from 'react-select'
import useGlobalSlice from '../services/useGlobalSlice'
import useDecks from '../services/useCards'
import uuid from 'uuid/v4'
import config from '../config'

const RoomStyle = styled.div`
  .game-config {
    max-width: 960px;
    margin: 0 auto;
    margin-top: 36px;
    padding: 1em;
    border-radius: 4px;
    border: 1px solid var(--colorLow);
    box-shadow: -4px 4px 4px 0 rgba(0,0,0,0.2);

    h2 {
      text-align: center;
      margin-top: .5rem;
      margin-bottom: 1.5rem;
    }

    .input-block {
      margin-bottom: 16px;
      > label {
        font-size: 12px;
        font-weight: 600;
        margin-left: 8px;
        margin-bottom: 4px;
        display: block;
        color: var(--colorMedium);
      }
      select {
        display: block;
      }
    }

    .radio-group {
      font-size: 14px;
      line-height: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      justify-content: flex-start;
      label {
        display: block;
        margin-right: 16px;
        padding: 8px 0;
        cursor: pointer;
      }
      span {
        margin-left: 4px;
      }
    }

    .flex-block {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;

      .input-block + .input-block {
        margin-left: 16px;
      }
    }

    .select-container {
      min-width: 140px;
    }

    > button {
      margin-top: 16px;
    }
  }
`

export default function Room ({ navigate, roomid }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [form, setForm] = useState({
    id: uuid(),
    name: '',
    deck: null,
    rotation: null
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

  return (
    <RoomStyle>
      <form onSubmit={handleSubmit} className="game-config">
        <h2>Crear nueva partida</h2>
        <div className="input-block">
          <label>Nombre de la partida</label>
          <Input
            value={form.name}
            onChange={setFormValue('name')}
            className="text-input" required
            type="text" placeholder="Escriba el nombre de la partida" />
        </div>
        <div className="flex-block">
          <div className="input-block">
            <label>Mazo de cartas</label>
            <Select
              value={form.deck}
              onChange={setFormValue('deck')}
              className="select-container" 
              options={deckOptions} />
          </div>
          <div className="input-block">
            <label>Eleccion de nuevo zar</label>
            <div className="radio-group">
              <label>
                <input type="radio"
                  checked={form.rotation === 'winner'}
                  onChange={setFormValue('rotation')}
                  value="winner" name="rotation" />
                <span>Ganador de la ultima ronda</span>
              </label>
              <label>
                <input type="radio" 
                  checked={form.rotation === 'clockwise'}
                  onChange={setFormValue('rotation')}
                  value="clockwise" name="rotation" />
                <span>En el sentido de las agujas del reloj</span>
              </label>
            </div>
          </div>
        </div>
        <Button type="submit">Crear partida</Button>
      </form>
    </RoomStyle>
  )
}
