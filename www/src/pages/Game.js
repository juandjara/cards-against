import React, { useState, useEffect } from 'react'
import useGlobalSlice from '../services/useGlobalSlice'
import config from '../config'
import styled from 'styled-components'
import CardStyles from '../components/deck-edit/CardStyles'
import CardFlip from '../components/CardFlip'
import { Link } from '@reach/router'
import classnames from 'classnames'
import TutorialModal from '../components/TutorialModal'
import Button from '../components/Button'
import WinningModal from '../components/WinningModal'
import Player from '../components/Player'

import IconArrowLeft from '../components/icons/IconArrowLeft'
import IconWhiteCards from '../components/icons/IconWhiteCards'
import IconBlackCards from '../components/icons/IconBlackCards'

import { polyfill } from 'mobile-drag-drop'
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour'
import 'mobile-drag-drop/default.css'
import PlayerModal from '../components/PlayerModal'

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
  holdToDrag: 200
})

const PLAYER_HAND_HEIGHT = 250

const GameStyles = styled.div`
  padding: 1rem 0;
  min-height: calc(100vh - 65px);
  max-width: calc(100vw - 24px);
  position: relative;

  section {    
    & + section {
      border-top: 1px solid var(--colorModerate);
    }
  }

  .heading-small {
    margin: 16px 8px 0 8px;
    font-size: 16px;
    line-height: 20px;
    font-weight: normal;

    .subtitle {
      margin-top: 4px;
      font-size: 12px;
      line-height: 16px;
    }
  }

  .card-list {
    list-style: none;
    margin: 0;

    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: auto;

    .card, .card-flip {
      flex: 0 0 auto;
      margin-top: 16px;
      margin-bottom: 8px;

      & + .card, & + .card-flip {
        margin-left: -12px;
      }
    }
  }

  .top {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    padding-bottom: 24px;

    .players {
      flex-grow: 1;
      margin-left: 16px;
      
      .label {
        font-size: 14px;
        color: var(--colorMedium);
      }

      .player {
        margin-right: 0;
      }
    }

    .card {
      & + .card {
        margin-left: 12px;
      }
    }
  }

  .slide-in {
    animation: slideIn .5s;
  }

  .cards-in-game {
    padding-bottom: ${PLAYER_HAND_HEIGHT}px;

    &.drag, .drag {
      background-color: var(--colorLow);
    }

    .subtitle {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-counter {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: normal;
      margin: 16px auto 0 auto;
      padding: 12px;

      strong {
        font-size: 32px;
        line-height: 1;
        font-weight: normal;
        margin-bottom: 4px;
      }

      .hidden-card {
        position: absolute;
        top: -2px;
        z-index: -1;
        box-shadow: none;
      }
    }

    .card-flip-back {
      cursor: pointer;
    }
  }

  .player-hand {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    max-height: ${PLAYER_HAND_HEIGHT}px;
    overflow: hidden;
    background-color: var(--colorVeryLow);

    &.disabled {
      opacity: 0.5;
    }

    .heading-small {
      margin-top: 12px;
      min-height: 40px;
    }

    .card-list {
      padding-top: 24px;
    }

    .send-btn {
      position: absolute;
      bottom: 100%;
      margin-bottom: -8px;
      left: 50%;
      transform: translateX(-50%) scale(0);
      transition: transform 0.25s ease;

      &.show {
        transform: translateX(-50%) scale(1);
      }
    }
  }

  @media (max-width: 45rem) {
    .card-list {
      justify-content: flex-start;
      padding: 0 8px;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(100vw);
    }
    to {
      transform: translateX(0);
    }
  }
`

const EMPTY_PAIR_DATA = { whiteCard: null, blackCard: null, player: null, reader: false }

export default function Game ({ navigate, gameId }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSendBtn, setActiveSendBtn] = useState(null)
  const [cardPair, setCardPair] = useState(EMPTY_PAIR_DATA)
  const [selectedPlayerModal, setSelectedPlayerModal] = useState(null)

  const playerData = (game && game.players.find(p => p.id === currentUser.id)) || { cards: [] }
  const blackCard = game && game.round.cards.black
  const playerIsReader = game && game.round.reader === currentUser.id
  const cardsInGame = Object.entries(game ? game.round.cards.white : {})
    .map(pair => {
      const [key, value] = pair
      return { owner: key, ...(value || {}) }
    })
    .filter(c => c.owner !== game.round.reader)
  
  const numCardsReady = cardsInGame.filter(c => c.id).length
  const allCardsReady = cardsInGame.length && cardsInGame.length === numCardsReady
  const cardAlreadySent = cardsInGame.some(c => c.id && c.owner === currentUser.id)
  const disableHand = playerIsReader || cardAlreadySent

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
    // this is needed for the drag-n-drop polyfill to work
    window.addEventListener('touchmove', function() {})
    fetchGame()
    socket.on('game:edit', game => {
      setGame(game)
    })
    socket.on('game:show-round-winner', ({ player, whiteCard, blackCard }) => {
      setCardPair({ reader: false, player, whiteCard, blackCard })
    })
    return () => {
      socket.off('game:edit')
      socket.off('game:show-round-winner')
    }
    // eslint-disable-next-line
  }, [socket])

  // functions for d&d in cards
  function onDragStart (ev, card) {
    ev.target.classList.add('drag')
    ev.dataTransfer.effectAllowed = 'move'
    ev.dataTransfer.setData('text/plain', card.id)
  }
  function onDragEnd (ev) {
    ev.target.classList.remove('drag')
  }

  // functions for drop-zone
  function onDragEnter (ev) {
    ev.preventDefault()
    ev.currentTarget.classList.add('drag')
  }
  function onDragLeave (ev) {
    if (!ev.currentTarget.contains(ev.relatedTarget)) {
      ev.currentTarget.classList.remove('drag')
    }
  }
  function onDragOver (ev) {
    ev.preventDefault()
    ev.dataTransfer.dropEffect = 'move'
    return false
  }
  
  function onDrop (ev) {
    ev.currentTarget.classList.remove('drag')
    const cardId = ev.dataTransfer.getData('text/plain')
    playWhiteCard(cardId)
    ev.preventDefault()
    ev.stopPropagation()
    return false
  }

  // click handlers
  function onHandClick (card) {
    if (!disableHand) {
      setActiveSendBtn(activeSendBtn === card.id ? null : card.id)
    }
  }

  function playWhiteCard (cardId) {
    socket.emit('game:play-white-card', { gameId, cardId })
  }

  function revealCard (cardId) {
    if (playerIsReader) {
      socket.emit('game:reveal-card', { gameId, cardId })
    }
  }

  function showCardPair (card) {
    if (playerIsReader) {
      setCardPair({
        reader: true,
        player: null,
        whiteCard: card,
        blackCard
      })
    }
  }

  function closeCardPair () {
    setCardPair(EMPTY_PAIR_DATA)
  }

  function confirmWinningCard () {
    socket.emit('game:set-round-winner', {
      gameId,
      player: cardPair.whiteCard.owner,
      blackCard: cardPair.blackCard.id,
      whiteCard: cardPair.whiteCard.id
    })
    closeCardPair()
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

  if (loading || !blackCard) {
    return (
      <GameStyles className="game">
        <h2 className="heading">Cargando...</h2>
      </GameStyles>
    )
  }

  return (
    <GameStyles className="game">
      <TutorialModal />
      <WinningModal
        whiteCard={cardPair.whiteCard}
        blackCard={cardPair.blackCard}
        isReader={cardPair.reader}
        player={cardPair.player}
        onClose={closeCardPair}
        onConfirm={confirmWinningCard} />
      <PlayerModal player={selectedPlayerModal} onClose={() => setSelectedPlayerModal(null)} />
      <section className="top">
        <CardStyles className="card black">
          <span>{blackCard.text}</span>
          {blackCard.answers > 1 && (<div className="answers">{blackCard.answers}</div>)}
        </CardStyles>
        <div className="block players">
          <p className="label">Jugadores</p>
          <ul>
            {game.players.map(p => (
              <Player key={p.id} as="li"
                player={p}
                selectable
                onClick={() => setSelectedPlayerModal(p)}
                readerId={game.round.reader} />
            ))}
          </ul>
        </div>
      </section>
      <section
        className="cards-in-game"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}>
        <header className="heading-small center">
          <p className="title">Cartas en juego</p>
          <p className="subtitle">
            {allCardsReady ? (
              <>
                <IconBlackCards/> <strong>Juez</strong>, revela las cartas y haz tu elecci&oacute;n
              </>
            ) : (
              <>
                <IconWhiteCards /> <strong>Jugadores</strong>, enviad vuestras cartas
              </>
            )}
          </p>
        </header>
        {allCardsReady ? (
          <ul className="card-list">
            {cardsInGame.map(c => {
              return (
                <CardFlip key={c.id} className="card-flip slide-in" as="li" rotated={!c.hidden}>
                  <CardStyles
                    onClick={() => revealCard(c.owner)}
                    className={classnames('card-flip-elem card-flip-front', { selectable: c.hidden && playerIsReader })}>
                    <p>¿?</p>
                  </CardStyles>
                  <CardStyles
                    onClick={() => showCardPair(c)}
                    className="card-flip-elem card-flip-back">
                    <p>{c.text}</p>
                  </CardStyles>
                </CardFlip>
              )
            })}
          </ul>
        ) : (
          <CardStyles className="card card-counter">
            <strong>{numCardsReady} / {cardsInGame.length}</strong>
            <span>cartas enviadas</span>
            {cardsInGame.filter(c => c.id).map(c => (
              <CardStyles key={c.id} className="card hidden-card slide-in"></CardStyles>
            ))}
          </CardStyles>
        )}
      </section>
      <section className={classnames('player-hand', { disabled: disableHand })}>
        <header className="heading-small center">
          <p className="title">Cartas en tu mano</p>
          <p className="subtitle">
            {playerIsReader
              ? 'En esta ronda no envias cartas, eres quien las juzga'
              : cardAlreadySent
                ? 'Cartas enviadas'
                : `Escoge ${blackCard.answers} carta${blackCard.answers === 1 ? '' : 's'}`}
          </p>
        </header>
        <ul className="card-list">
          {playerData.cards.map(c => (
            <CardStyles key={c.id} as="li"
              draggable={!disableHand}
              onDragStart={ev => onDragStart(ev, c)}
              onDragEnd={onDragEnd}
              onClick={() => onHandClick(c)}
              className={classnames('card', { selectable: !disableHand })}>
              <p>{c.text}</p>
              <Button
                onClick={() => playWhiteCard(c.id)}
                className={classnames('send-btn', { show: activeSendBtn === c.id })}>Enviar</Button>
            </CardStyles>
          ))}
        </ul>
      </section>
    </GameStyles>
  )
}
