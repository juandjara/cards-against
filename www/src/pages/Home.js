import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import { Link, navigate } from '@reach/router'
import config from '../config'
import useGlobalSlice from '../services/useGlobalSlice'
import IconInterface from '../components/icons/IconInterface'
import CheckIcon from '../components/icons/CheckIcon'
import CardStyles from '../components/deck-edit/CardStyles'
import InputStyles from '../components/Input'

const HomeStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);

  .btn-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-bottom: 36px;
    perspective: 600px;

    button {
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      display: block;
      margin: 16px;
      cursor: pointer;
    }
  }

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

  .card-flip {
    position: relative;
    transition: transform 1s;
    transform-style: preserve-3d;
    width: 180px;
    height: 180px;

    ${CardStyles} {
      margin: 0;
    }

    &.rotated {
      transform: rotateY(180deg);
    }

    .card-flip-elem {
      position: absolute;
      backface-visibility: hidden;
    }
  
    .card-flip-back {
      transform: rotateY(180deg);
    }
  }

  form {
    flex-direction: column;
    justify-content: center;

    label {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .input-group {
      display: flex;
      align-items: center;
  
      input {
        flex-shrink: 1;
        height: 38px;
        margin-right: -4px;
        min-width: 0;
        flex-shrink: 1;
      }
  
      button {
        margin: 0;
        padding: 4px 12px;
        border-radius: 0 4px 4px 0;
        height: 38px;

        svg {
          vertical-align: middle;
        }
      }
    }
  }
`

export default function Home () {
  const [games, setGames] = useState([])
  const [socket] = useGlobalSlice('socket')
  const [isRotated, setIsRotated] = useState(false)

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
    <HomeStyles className="home">
      <div className="btn-group">
        <div className={`card-flip ${isRotated ? 'rotated' : ''}`}>
          <CardStyles as="button"
            onClick={() => setIsRotated(true)} 
            className="card-flip-elem card-flip-front white scale">
            Unirse a una partida
          </CardStyles>
          <CardStyles as="form"
            onSubmit={ev => ev.preventDefault()}
            className="card-flip-elem card-flip-back white">
            <label>Introduce el código</label>
            <div className="input-group">
              <InputStyles type="text" placeholder="xxxx" />
              <Button type="submit"><CheckIcon /></Button>
            </div>
          </CardStyles>
        </div>
        <CardStyles as="button"
          onClick={() => navigate('/room/new')}
          className="black scale">
          Nueva partida
        </CardStyles>
      </div>
      <footer>
        <IconInterface />
        <span> by <a href="https://juandjara.com" target="_blank">juandjara</a></span>
      </footer>
    </HomeStyles>
  )
}
