import React, { useState, useEffect, useRef } from 'react'
import { useGlobalState } from '../GlobalState'
import io from 'socket.io-client'
import styled from 'styled-components'
import Header from '../components/Header'
import Button from '../components/Button'

const NameSelectStyle = styled.div`
  height: 100vh;
  form {
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 1rem;
    input {
      padding: 6px 12px;
      font-size: 24px;
      background-color: inherit;
      color: inherit;
      border: 1px solid #bfbfbf;
      border-right-color: transparent;
      &::placeholder {
        color: #aaa;
      }
    }
    button {
      border-radius: 0;
    }
  }
`

const NAME_KEY = 'cards-against-username'

export default function NameSelect () {
  const actions = useGlobalState()
  const nameFromLS = localStorage.getItem(NAME_KEY) || ''
  const [name, setName] = useState(nameFromLS)
  const inputRef = useRef()

  function handleSubmit (ev) {
    ev.preventDefault()
    connect(name)
  }

  function connect(name) {
    const socket = io(`localhost:5000?name=${name}`)
    socket.on('connect', () => {
      socket.emit('user:id-request', (user) => {
        localStorage.setItem(NAME_KEY, name)
        actions.setCurrentUser(user)
        actions.setSocket(socket)
      })
    })
  }

  // this runs only on mount
  useEffect(() => {
    if (nameFromLS) {
      connect(nameFromLS)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return nameFromLS ? null : (
    <NameSelectStyle className="name-select">
      <Header />
      <form onSubmit={handleSubmit}>
        <input 
          ref={inputRef}
          required
          type="text"
          name="name"
          value={name}
          onChange={ev => setName(ev.target.value.trim())}
          placeholder="Hola, ¿Como te llamas?" />
        <Button type="submit">Entrar</Button>
      </form>
    </NameSelectStyle>
  )
}
