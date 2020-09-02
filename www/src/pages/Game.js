import React, { useState, useEffect } from 'react'
import useGlobalSlice from '../services/useGlobalSlice'
import config from '../config'
import styled from 'styled-components'
import CardStyles from '../components/deck-edit/CardStyles'
import CardFlip from '../components/CardFlip'
import { Link } from '@reach/router'
import IconArrowLeft from '../components/icons/IconArrowLeft'

import { polyfill } from 'mobile-drag-drop'
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import 'mobile-drag-drop/default.css'

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
  holdToDrag: 200
})

const GameStyles = styled.div`
  padding: 1rem 0;
  min-height: calc(100vh - 65px);
  max-width: calc(100vw - 24px);
  position: relative;

  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin-bottom: 12px;

    span {
      margin-left: 2px;
    }

    svg .primary {
      display: none;
    }
  }

  .heading {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    margin-top: 8px;
    margin-bottom: 16px;

    &.center {
      text-align: center;
    }
  }

  .heading-small {
    margin: 12px 8px;
    font-size: 16px;
    line-height: 20px;
    font-weight: normal;
  }

  section {    
    & + section {
      border-top: 1px solid var(--colorModerate);
    }
  }

  .card-list {
    list-style: none;
    margin: 0;

    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    overflow: auto;

    .card, .card-flip {
      margin-top: 16px;
      margin-bottom: 8px;

      & + .card, & + .card-flip {
        margin-left: -12px;
      }

      &.drag:not(.card-placeholder) {
        opacity: 0.5;
      }
    }
  }

  @media (max-width: 45rem) {
    .card {
      width: 160px;
      height: 160px;
    }
  }

  .top {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: flex-start;
    padding-bottom: 24px;

    .players {
      flex-basis: 160px;
      padding-right: 16px;
      margin-right: 32px;
      margin-bottom: 32px;
      
      .label {
        font-size: 14px;
        color: var(--colorMedium);
      }

      li {
        background-color: white;
        max-width: 156px;
        padding: 4px 8px;
        border-radius: 8px;
        margin: 8px 0;

        &.reader {
          background-color: var(--colorTop);
          color: white;
        }
      }
    }

    .card {
      & + .card {
        margin-left: 12px;
      }
    }
  }

  .cards-in-game {
    padding-bottom: 216px;
  }

  .player-hand {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    max-height: 216px;
    overflow: hidden;

    @media (max-width: 45rem) {
      max-height: 200px;
    }
  }
`

const CardPlaceholder = styled.div`
  width: 180px;
  height: 180px;
  padding: 12px 16px;
  padding-bottom: 24px;
  border-radius: 16px;
  border: 2px dashed #333;
  background-color: var(--colorVeryLow);

  &.drag {
    background-color: white;
    border-color: transparent;
  }
`

export default function Game ({ navigate, gameId }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const playerData = (game && game.players.find(p => p.id === currentUser.id)) || { cards: [] }
  const blackCard = game && game.round.cards.black
  const playerHasPlayed = game && !!game.round.cards.white[currentUser.id]
  const playerIsReader = game && game.round.reader === currentUser.id
  const cardsInGame = game && Object.entries(game.round.cards.white)
    .map(pair => {
      const [key, value] = pair
      return { owner: key, ...(value || {}) }
    })
    .filter(c => c.owner !== game.round.reader)
  
  const allCardsReady = cardsInGame && cardsInGame.length && cardsInGame.every(c => c.id)
  const allCardsShown = cardsInGame && cardsInGame.length && cardsInGame.every(c => c.id && !c.hidden)

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
      if (!data.shuffled) {
        socket.emit('game:shuffle', gameId)
      }
      askCards(data.round.reader === currentUser.id)
    }
    setLoading(false)
  }

  function askCards (isReader) {
    socket.emit('game:draw-white-cards', gameId)
    if (isReader) {
      socket.emit('game:draw-black-card', gameId)
    }
  }

  useEffect(() => {
    window.addEventListener( 'touchmove', function() {})
    fetchGame()
    socket.on('game:edit', game => {
      setGame(game)
    })
    return () => {
      socket.off('game:edit')
    }
  }, [socket])

  function onDragStart (ev, card) {
    ev.target.classList.add('drag')
    ev.dataTransfer.effectAllowed = 'move'
    ev.dataTransfer.setData('text/plain', card.id)
  }
  function onDragEnd (ev) {
    ev.target.classList.remove('drag')
  }

  function onDragEnter (ev) {
    ev.preventDefault()
    ev.target.classList.add('drag')
  }
  function onDragLeave (ev) {
    ev.target.classList.remove('drag')
  }
  function onDragOver (ev) {
    ev.preventDefault()
    ev.dataTransfer.dropEffect = 'move'
    return false
  }
  
  function onDrop (ev) {
    const cardId = ev.dataTransfer.getData('text/plain')
    socket.emit('game:play-white-card', { gameId, cardId })
    ev.preventDefault()
    ev.stopPropagation()
    return false
  }

  if (loading) {
    return (
      <GameStyles className="game">
        <h2 className="heading">Cargando...</h2>
      </GameStyles>
    )
  }

  if (!loading && !game) {
    return (
      <GameStyles className="game">
        <h2 className="heading center">Ninguna partida activa con el c&oacute;digo <strong>{gameId}</strong></h2>
        <Link to="/" className="back">
          <IconArrowLeft width="20" height="20" />
          <span>Volver al men&uacute; principal</span>
        </Link>
      </GameStyles>
    )
  }

  return (
    <GameStyles className="game">
      <section className="top">
        <div className="block players">
          <p className="label">Jugadores</p>
          <ul>
            {game.players.map(p => (
              <li key={p.id} className={p.id === game.round.reader ? 'reader' : ''}>
                {p.name}
              </li>
            ))}
          </ul>
        </div>
        <CardStyles className="card black">
          {blackCard && blackCard.text}
        </CardStyles>
        {allCardsShown ? (<CardPlaceholder className="card card-placeholder">
          <p>Arrastra aquí la carta ganadora</p>
        </CardPlaceholder>) : null}
      </section>
      <section className="cards-in-game">
        <h3 className="heading-small">Cartas en juego</h3>
        <ul className="card-list">
          {cardsInGame.map(c => {
            if (!c.id) {
              return (
                <CardPlaceholder key={c.owner}
                  as="li"
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  className="card card-placeholder">
                  <p></p>
                </CardPlaceholder>
              )
            }
            return (
              <CardFlip key={c.id} className="card-flip" as="li" rotated={!c.hidden}>
                <CardStyles 
                  draggable={playerIsReader}
                  onDragStart={ev => onDragStart(ev, c)}
                  onDragEnd={onDragEnd}
                  className="card-flip-elem card-flip-front white translate-y">
                  <p>¿?</p>
                </CardStyles>
                <CardStyles
                  draggable={playerIsReader}
                  onDragStart={ev => onDragStart(ev, c)}
                  onDragEnd={onDragEnd}
                  className="card-flip-elem card-flip-back white translate-y">
                  <p>{c.text}</p>
                </CardStyles>
              </CardFlip>
            )
          })}
        </ul>
      </section>
      <section className="player-hand">
        <h3 className="heading-small">Cartas en tu mano</h3>
        <ul className="card-list">
          {playerData.cards.map(c => (
            <CardStyles key={c.id}
              as="li"
              draggable={!playerHasPlayed && !playerIsReader}
              onDragStart={ev => onDragStart(ev, c)}
              onDragEnd={onDragEnd}
              className="card white translate-y">
              <p>{c.text}</p>
            </CardStyles>
          ))}
        </ul>
      </section>
    </GameStyles>
  )
}
