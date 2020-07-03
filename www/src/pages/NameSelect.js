import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import styled from 'styled-components'
import useGlobalSlice from '../services/useGlobalSlice'
import Header from '../components/Header'
import Button from '../components/Button'
import config from '../config'

const NameSelectStyle = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr; 
  form {
    align-self: center;
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
      border-radius: 4px 0 0 4px;
      &::placeholder {
        color: #aaa;
      }
    }
    button {
      border-radius: 0 4px 4px 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
`

export default function NameSelect () {
  const [socket, setSocket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const nameFromLS = localStorage.getItem(config.NAME_KEY) || ''
  const [name, setName] = useState(nameFromLS)
  const inputRef = useRef()

  function handleSubmit (ev) {
    ev.preventDefault()
    connect(name)
  }

  function connect(name) {
    const socket = io(`${config.api}?name=${name}`)
    socket.on('connect', () => {
      socket.emit('user:id-request', (user) => {
        setSocket(socket)
        setCurrentUser(user)
        localStorage.setItem(config.NAME_KEY, name)
      })
    })
  }

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
