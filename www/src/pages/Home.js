import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import useGlobalSlice from '../services/useGlobalSlice'
import IconInterface from '../components/icons/IconInterface'
import IconCheck from '../components/icons/IconCheck'
import CardStyles from '../components/deck-edit/CardStyles'
import InputStyles from '../components/Input'
import CardFlip from '../components/CardFlip'
import bg from '../assets/humaaans.png';
import {useTranslations} from "../components/Localise";

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
      cursor: pointer;
    }

    > ${CardStyles},
    > ${CardFlip} {
      margin: 16px;
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

  .bg {
    max-width: 90vw;
    margin: 1rem 0;
  }
`

export default function Home ({ navigate }) {
  const [socket] = useGlobalSlice('socket')
  const [isRotated, setIsRotated] = useState(false)
  const [code, setCode] = useState('')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const {getTranslation} = useTranslations()

  function goTo (id) {
    navigate(`/game/${id}`)
  }

  function enterGame (ev) {
    ev.preventDefault()
    goTo(code)
  }

  function leaveGame () {
    socket.emit('game:leave', currentUser.game)
    setCurrentUser({ ...currentUser, game: null })
  }

  function continueGame () {
    goTo(currentUser.game)
  }

  return (
    <HomeStyles className="home">
      <img className="bg" src={bg} alt="" />
      {currentUser.game ? (
        <div className="btn-group">
          <CardStyles as="button"
            onClick={leaveGame}
            className="white scale">
            {getTranslation("views.home.leave")}
          </CardStyles>
          <CardStyles as="button"
            onClick={continueGame}
            className="black scale">
            {getTranslation("views.home.continue")}
          </CardStyles>
        </div>
      ) : (
        <div className="btn-group">
          <CardFlip rotated={isRotated}>
            <CardStyles as="button"
              onClick={() => setIsRotated(true)}
              className="card-flip-elem card-flip-front card white scale">
                {getTranslation("views.home.join")}
            </CardStyles>
            <CardStyles as="form"
              onSubmit={enterGame}
              className="card-flip-elem card-flip-back card white">
              <label>{getTranslation("views.home.code_input")}</label>
              <div className="input-group">
                <InputStyles
                  type="text"
                  value={code}
                  maxLength="4"
                  onChange={ev => setCode(ev.target.value)}
                  disabled={!isRotated}
                  placeholder="ABCD" />
                <Button type="submit" disabled={!isRotated}><IconCheck /></Button>
              </div>
            </CardStyles>
          </CardFlip>
          <CardStyles as="button"
            onClick={() => navigate('/newgame')}
            className="black scale">
              {getTranslation("views.home.create")}
          </CardStyles>
        </div>
      )}
      <footer>
        <IconInterface />
        <span> by <a href="https://juandjara.com" target="_blank" rel="noopener noreferrer">juandjara</a></span>
      </footer>
    </HomeStyles>
  )
}
