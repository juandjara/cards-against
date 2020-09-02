import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import Input from '../components/Input'
import { Link } from '@reach/router'
import useDecks from '../services/useCards'
import useGlobalSlice from '../services/useGlobalSlice'
import WhiteCardsIcon from '../components/icons/CardsOutlineIcon'
import BlackCardsIcon from '../components/icons/CardsIcon'
import IconArrowLeft from '../components/icons/IconArrowLeft'
import EditIcon from '../components/icons/EditIcon'

const SettingsStyles = styled.div`
  margin-top: 1.5rem;

  .back {
    display: flex;
    align-items: center;
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
    margin-top: 0;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  section {
    margin-top: 24px;
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

    &:hover {
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
    margin: 16px 0 24px 0;
    li {
      display: flex;
      align-items: center;
      padding: 12px 4px;
      & + li {
        border-top: 2px solid #e8e8e8;
      }
      svg {
        margin: 0 8px;
      }
      > span {
        min-width: 30px;
      }
      a {
        margin-left: 8px;
      }
    }
  }
`

export default function Settings () {
  const [decks] = useDecks()
  const Settings = Object.values(decks)
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [username, setUsername] = useState(currentUser.name)
  const [editMode, setEditMode] = useState(false)

  function editUsername () {
    setCurrentUser({ ...currentUser, name: username })
    setEditMode(false)
  }

  return (
    <SettingsStyles className="deck-list">
      <Link to="/" className="back">
        <IconArrowLeft width="20" height="20" />
        <span>Volver al men&uacute; principal</span>
      </Link>
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
              <EditIcon />
              <span>Editar</span>
            </button>
          </div>
        )}
      </section>
      <section>
        <h3>Mazos</h3>
        <Link to="/decks/new">
          <Button>Crear mazo</Button>
        </Link>
        {Settings.length === 0 ? (
          <p>Todavia no has guardado ningún mazo</p>
        ) : (
          <ul>
            {Settings.map(d => ({
              ...d,
              no_white: d.cards.filter(c => c.type === 'white').length,
              no_black: d.cards.filter(c => c.type === 'black').length
            })).map(d => (
              <li key={d.id}>
                <BlackCardsIcon /><span>{d.no_black}</span>
                <WhiteCardsIcon /><span>{d.no_white}</span>
                <Link to={`/decks/${d.id}`}>
                  {d.name}
                </Link>{' '}
              </li>
            ))}
          </ul>
        )}
      </section>
    </SettingsStyles>
  )
}
