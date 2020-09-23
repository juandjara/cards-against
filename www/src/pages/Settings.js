import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Input from '../components/Input'
import { Link, navigate } from '@reach/router'
import useDecks from '../services/useDecks'
import useGlobalSlice from '../services/useGlobalSlice'
import WhiteIconCards from '../components/icons/IconWhiteCards'
import BlackIconCards from '../components/icons/IconBlackCards'
import IconArrowLeft from '../components/icons/IconArrowLeft'
import IconEdit from '../components/icons/IconEdit'
import IconDoorExit from '../components/icons/IconDoorExit'

const SettingsStyles = styled.div`
  margin-top: 1.5rem;

  h2 {
    margin-top: 0;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  section {
    margin-top: 32px;
  }

  .username, .edit-username {
    display: flex;
    align-items: center;
  }

  .pill {
    padding: 6px 12px;
    background-color: white;
    border-radius: 1rem;
    font-size: 14px;
  }

  .button-link {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 0;
    margin-left: 8px;
    border: 0;
    background: none;
    color: var(--colorPrimary);
    margin-right: 16px;
    font-size: 12px;
    cursor: pointer;

    &:hover, &:focus {
      text-decoration: underline;
    }

    svg {
      margin-right: 2px;
      width: 20px;
      height: 20px;
    }
  }

  .edit-username {
    button {
      margin-left: 8px;
      height: 36px;
    }
  }

  input {
    max-width: 215px;
    height: 36px;
  }

  @media (max-width: 45rem) {
    .edit-username {
      display: block;
      input {
        display: block;
        margin-bottom: 8px;
      }
      button {
        margin-left: 0;
        margin-right: 8px;
      }
    }
  }

  .cancel-btn {
    background: none;
    border: none;
    &:hover, &:focus {
      text-decoration: underline;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 12px 0 24px 0;
    li {
      padding: 12px 4px;
      border-radius: 8px;
      margin-bottom: 8px;

      &:hover {
        background-color: white;
        box-shadow: 1px 1px 3px 0 rgba(0,0,0, 0.2);
      }

      /* & + li {
        border-top: 2px solid #e8e8e8;
      } */

      .title {
        display: flex;
        align-items: center;

        svg {
          margin-left: 8px;
          margin-right: 4px;
        }
        > span {
          min-width: 30px;
        }
        a {
          margin-left: 8px;
        }
      }

      .description {
        margin: 10px;
        font-size: 14px;
        line-height: 20px;
        max-width: 690px;
      }
    }
  }

  .no-data {
    margin-top: 16px;
  }

  .back {
    justify-content: flex-start;
    margin: 0;
  }

  .game-id {
    margin-right: 4px;
    font-family: var(--fontDisplay), sans-serif;
    font-size: 32px;
    line-height: 38px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .game-id-wrapper {
    display: flex;
    align-items: centeR;
  }
`

export default function Settings () {
  const [decksTree] = useDecks()
  const decks = Object.values(decksTree).map(d => ({
    ...d,
    num_white: d.cards.filter(c => c.type === 'white').length,
    num_black: d.cards.filter(c => c.type === 'black').length
  }))
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [username, setUsername] = useState(currentUser.name)
  const [editMode, setEditMode] = useState(false)

  function editUsername () {
    setCurrentUser({ ...currentUser, name: username })
    setEditMode(false)
  }

  function leaveGame () {
    socket.emit('game:leave', currentUser.game)
    setCurrentUser({ ...currentUser, game: null })
    navigate('/')
  }

  return (
    <SettingsStyles className="deck-list">
      <button onClick={() => window.history.back()} className="button-link back">
        <IconArrowLeft width="20" height="20" />
        <span>Volver</span>
      </button>
      <h2>Ajustes</h2>
      <section>
        <h3>Nombre de jugador</h3>
        {editMode ? (
          <div className="edit-username">
            <Input value={username} onChange={ev => setUsername(ev.target.value)} />
            <Button onClick={editUsername}>Guardar</Button>
            <Button onClick={() => setEditMode(false)} className="cancel-btn">Cancelar</Button>
          </div>
        ) : (
          <div className="username">
            <p className="pill">{currentUser.name}</p>
            <button className="button-link" onClick={() => setEditMode(true)}>
              <IconEdit />
              <span>Editar</span>
            </button>
          </div>
        )}
      </section>
      <section>
        <h3>Partida</h3>
        {currentUser.game ? (
          <div className="game-id-wrapper">
            <p className="game-id">{currentUser.game}</p>
            <button className="button-link" onClick={leaveGame}>
              <IconDoorExit />
              <span>Abandonar partida</span>
            </button>
          </div>
        ) : (
          <p>Ninguna partida comenzada</p>
        )}
      </section>
      <section>
        <h3>Mazos</h3>
        <Link to="/decks/new">
          <Button>Crear mazo</Button>
        </Link>
        {decks.length === 0 ? (
          <p className="no-data">Todavia no has guardado ningún mazo</p>
        ) : (
          <ul>
            {decks.map(d => (
              <li key={d.id}>
                <div className="title">
                  <BlackIconCards /> <span>{d.num_black}</span>
                  <WhiteIconCards /> <span>{d.num_white}</span>
                  <Link to={`/decks/${d.id}`}>{d.name}</Link>
                </div>
                <p className="description">{d.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SettingsStyles>
  )
}
