import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import styled from 'styled-components'
import useGlobalSlice from '../services/useGlobalSlice'
import Header from '../components/Header'
import Button from '../components/Button'
import Input from '../components/Input'
import config from '../config'

const NameSelectStyle = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr; 

  .name-form {
    align-self: center;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h2 {
      font-size: 24px;
      line-height: 32px;
      font-weight: 500;
      margin: 0;
    }

    .input-group {
      display: flex;
      align-items: stretch;
      justify-content: center;
      margin: 12px 0;
    }

    input {
      margin-right: -4px;
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
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  function handleSubmit (ev) {
    ev.preventDefault()
    connect(name)
  }

  function connect(name) {
    const socket = io(`${config.api}?name=${name}`)
    setLoading(true)
    socket.on('connect', () => {
      socket.emit('user:id-request', (user) => {
        setLoading(false)
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
    if (inputRef.current) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return (
      <NameSelectStyle className="name-select">
        <Header />
        <div className="name-form">
          <h2>Cargando ...</h2>
        </div>
      </NameSelectStyle>
    )
  }

  if (nameFromLS) {
    return null
  }

  return (
    <NameSelectStyle className="name-select">
      <Header />
      <form className="name-form" onSubmit={handleSubmit}>
        <h2>Hola, ¿Como te llamas?</h2>
        <div className="input-group">
          <Input 
            ref={inputRef}
            required
            type="text"
            name="name"
            value={name}
            onChange={ev => setName(ev.target.value.trim())}
            placeholder="Introduce tu nombre" />
          <Button type="submit">Entrar</Button>
        </div>
      </form>
    </NameSelectStyle>
  )
}
