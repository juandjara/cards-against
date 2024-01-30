import React, { useEffect, useState, useRef } from 'react'
import { editGame } from '@/lib/gameUtils'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import withGame from '@/lib/withGame'
import GameCard from '@/components/GameCard'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import PrimaryButton from '@/components/PrimaryButton'
import Button from '@/components/Button'
import usePlayerId from '@/lib/usePlayerId'
import { Check, Clock, CrownSimple } from 'phosphor-react'
import Modal from '@/components/Modal'
import { UserIcon, XIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import NameEditModal from '@/components/NameEditModal'
import { ErrorMessage } from '@/components/GameMessage'

function getLastFinishedRound(game) {
  const round = game.finishedRounds[game.finishedRounds.length - 1]
  if (!round) {
    return null
  }

  const winner = game.players.find(p => p.id === round.winner)
  return { ...round, winner }
}

function PlayGameUI({ socket, game }) {
  const navigate = useNavigate()
  const cache = useQueryClient()
  const playerId = usePlayerId()
  const playerData = game?.players.find(p => p.id === playerId)
  const cardsToPick = game?.round.blackCard?.pick || 1
  const playerIsHost = playerId === game?.round.host
  const blackCardRef = useRef()

  const roundPlayed = game?.round.whiteCards.some(c => c.player === playerId)
  const playersReady = game?.players.filter(p => game.round.whiteCards.some(c => c.player === p.id)).length
  const allCardsSent = playersReady === game?.players.length - 1

  const showHand = !playerIsHost && !roundPlayed
  const showCardCounter = !allCardsSent && (playerIsHost || roundPlayed)
  const cardCounterText = `${playersReady} / ${game?.players.length - 1}`

  const counterAnimation = useAnimation()
  const [winner, setWinner] = useState(null)
  const [showRoundModal, setShowRoundModal] = useState(false)

  useEffect(() => {
    socket.emit('game:rejoin', { gameId: game.id })
    socket.on('game:edit', game => {
      editGame(cache, game)
      if (game.finished) {
        socket.off('game:edit')
      }
    })
    socket.on('game:cards-played', () => {
      counterAnimation.start({ x: [300, 0] })
    })
    socket.on('game:round-winner', () => {
      setShowRoundModal(true)
    })
    socket.on('game:kick', kickedPlayerId => {
      if (kickedPlayerId === playerId) {
        navigate('/')
      }
    })

    return () => {
      if (socket) {
        socket.off('game:edit')
        socket.off('game:kick')
        cache.removeQueries({ queryKey: ['game', game.id] })
      }
    }
  }, [])

  function playCards(cards) {
    socket.emit('game:play-white-cards', {
      gameId: game.id,
      playerId,
      cards
    })
  }

  function onRoundWhiteCardClick(card, group) {
    if (!playerIsHost) {
      return
    }

    if (card.hidden) {
      socket.emit('game:reveal-card', {
        gameId: game.id,
        playerId: card.player
      })
    } else {
      card.selected = true;
      if (group !== undefined) {
        for (const card of game.round.whiteCards) {
          card.selected = false;
        }

        for (const card of group) {
          card.selected = true;
        }
      }
      setWinner(card.player)
    }
  }

  function discardWhiteCards(cards) {
    socket.emit('game:discard-white-card', {
      gameId: game.id,
      playerId,
      cards
    })
  }

  function finishRound() {
    socket.emit('game:finish-round', {
      gameId: game.id,
      winnerPlayerId: winner
    })
    setWinner(null)
  }

  function closeModal() {
    setShowRoundModal(false)
    if (blackCardRef.current) {
      blackCardRef.current.focus()
    }

  }

  function closeGameOverModal() {
    removePlayer(playerId)
    navigate('/')
  }

  function removePlayer(playerId) {
    socket.emit('game:leave', { playerId, gameId: game.id })
  }

  if (playerData && game.players.length < 2) {
    return <ErrorMessage message="No hay nadie más en este juego" />
  }

  return (
    <main
      className="h-full p-3 pb-0 flex flex-col items-stretch justify-start"
      style={{ minHeight: 'calc(100vh - 54px)' }}
    >
      <NameEditModal game={game} socket={socket} />
      <GameOverModal closeModal={closeGameOverModal} game={game} />
      <RoundModal closeModal={closeModal} show={showRoundModal && !game.finished} game={game} />
      <div className="absolute top-0 right-0 flex items-center gap-2 p-2">
        <p className="text-sm">{playerData?.name}</p>
        <UserIcon className="w-4 h-4" />
      </div>
      <PlayersInfo playerId={playerId} onRemovePlayer={removePlayer} game={game} />
      <Round
        playerIsHost={playerIsHost}
        cardCounterText={cardCounterText}
        showCardCounter={showCardCounter}
        counterAnimation={counterAnimation}
        winner={winner}
        allCardsSent={allCardsSent}
        round={game.round}
        onCardClick={onRoundWhiteCardClick}
        onWinnerSelect={finishRound}
        showHand={showHand}
      />
      {showHand ? (
        <CardPicker
          cardsToPick={cardsToPick}
          cards={playerData?.cards}
          onCardsPicked={playCards}
          onDiscard={discardWhiteCards}
        />
      ) : (
        <p role="alert" className="text-center pb-8">
          {allCardsSent
            ? playerIsHost
              ? ''
              : 'Esperando a que el juez elija la carta ganadora...'
            : 'Esperando a que los jugadores envíen sus cartas...'}
        </p>
      )}
    </main>
  )
}

function GameOverModal({ closeModal, game }) {
  // TODO: include a gallery of rounds here using finishedRounds data
  const players = game.players.slice().sort((a, b) => b.points - a.points)
  return (
    <Modal show={game.finished} onClose={closeModal} title="Fin de la partida">
      <ul role="alert" className="pt-4">
        {players.map(p => (
          <li className="text-gray-700" key={p.id}>
            <strong className="font-bold">{p.name}:</strong> {p.points} puntos
          </li>
        ))}
      </ul>
    </Modal>
  )
}

function RoundModal({ closeModal, show, game }) {
  const round = getLastFinishedRound(game)
  const title = show && (
    <p>
      <span>{round?.winner.name}</span>
      <small className="text-gray-600"> - Ganador de la ronda</small>
    </p>
  )
  const whiteCards = round ? round.whiteCards : []
  const blackCard = round ? round.blackCard : { text: '' }
  return (
    <Modal show={show} onClose={closeModal} title={title}>
      <div role="alert" className="pt-8 gap-4 flex flex-wrap items-center justify-center content-center">
        <GameCard type="black" text={decodeHtml(blackCard.text)} badge={blackCard.pick} />
        {whiteCards.map(c => (
          <GameCard className="shadow-md" text={decodeHtml(c.card)} type="white" key={c.card} />
          ))}
      </div>
    </Modal>
  )
}

function getPlayerState(game, player) {
  const isHost = game.round.host === player.id
  const hasPlayed = game.round.whiteCards.some(c => c.player === player.id)

  if (isHost) {
    return (
      <span title="Juez de las cartas">
        <CrownSimple className="w-6 h-6" />
      </span>
    )
  }
  if (hasPlayed) {
    return (
      <span title="Carta enviada">
        <Check className="w-6 h-6" />
      </span>
    )
  } else {
    return (
      <span title="Esperando a que envíe su carta">
        <Clock className="w-6 h-6 opacity-50" />
      </span>
    )
  }
}

function PlayersInfo({ playerId, game, onRemovePlayer }) {
  const creator = game.players[0] && game.players[0].id
  const host = game.round.host
  const roundNum = game.finishedRounds.length + 1
  return (
    <>
      <p aria-live="polite" className="text-lg font-bold pb-3">Ronda {roundNum}</p>
      <aside>
      <ul className="px-1 space-y-3 overflow-hidden">
        {game.players.map(p => (
          <li key={p.id} className="flex space-x-3 items-center">
            {getPlayerState(game, p)}
            <span aria-hidden="true" className={`${p.id === host ? 'font-bold' : 'font-medium'} truncate text-lg`}>{p.name} </span>
            <span aria-hidden="true" className="font-medium font-mono bg-gray-900 px-2 py-1 rounded-lg">{p.points}</span>
            <span aria-live="polite" aria-atomic="true" className="sr-only" aria-label={`${p.name}, ${p.points} puntos`} />
            {playerId === creator && p.id !== playerId && (
              <button
                title="Expulsar jugador"
                aria-label={"Expulsar a "+ p.name}
                className="p-1 rounded-xl hover:bg-white hover:bg-opacity-25"
                onClick={() => onRemovePlayer(p.id)}
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      </aside>
    </>
  )
}

function decodeHtml(html) {
  var el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

function groupCardsByPlayer(cards) {
  const players = {}
  let number = 0;
  for (const card of cards) {
    number = number + 1;
    players[card.player] = players[card.player] || { player: card.player, cards: [], groupNumber: number }
    players[card.player].cards.push(card)
  }
  return Object.values(players)
}

function Round({
  playerIsHost,
  cardCounterText,
  showCardCounter,
  counterAnimation,
  winner,
  allCardsSent,
  round,
  onCardClick,
  onWinnerSelect,
  blackCardRef
}) {
  const cardCounter = showCardCounter && (
    <main>
    <GameCard
      as={motion.div}
      animate={counterAnimation}
      type="white"
      className="justify-center items-center text-center m-2"
      text={
        <>
          <p className="text-4xl font-bold mb-2">{cardCounterText}</p>
          <p>cartas enviadas</p>
        </>
      }
      />
      </main>
  )

  return (
    <div className="flex-grow py-6 flex flex-col items-center justify-center content-center">
      {allCardsSent && playerIsHost && (
        <p className="pt-2 text-lg font-semibold">Elije la combinaci&oacute;n ganadora</p>
      )}
      <div className="py-4 flex flex-wrap items-start justify-center">
        {round.blackCard && (
          <main>
            <h2>
          <GameCard aria-live="polite" ref={blackCardRef} tabIndex="0" className="m-2" type="black" text={decodeHtml(round.blackCard.text)} badge={round.blackCard.pick} />
          </h2>
          </main>
        )}
        {cardCounter}
        {allCardsSent &&
          groupCardsByPlayer(round.whiteCards).map(group => (
            <motion.div
              initial={{ y: 0 }}
              whileHover={{ y: playerIsHost ? -10 : 0 }}
              key={group.player}
              className={classNames(
                { 'ring-inset ring-4 ring-blue-500': group.player === winner },
                'flex-shrink-0',
                'm-1 bg-gray-900 bg-opacity-20 rounded-2xl text-left'
              )}
            >
              <fieldset>
                <legend>{group.cards.length > 1 ? "Grupo de cartas" + group.groupNumber : null}</legend>
              {group.cards.map((c, i) =>
                playerIsHost ? (
                  <GameCard
                    text={c.hidden ? '¿?' : decodeHtml(c.card)}
                    aria-pressed={c.selected ? true : false}
                    className={classNames(
                      { '-mt-6': i !== 0 },
                      'm-2 text-left border-t-2 border-gray-300 focus:outline-none'
                    )}
                    type="white"
                    key={i}
                    as="button"
                    onClick={() => onCardClick(c, group.cards)}
                  />
                ) : (
                  <GameCard
                    text={c.hidden ? '¿?' : decodeHtml(c.card)}
                    className={classNames({ '-mt-6': i !== 0 }, 'm-2 text-left border-t-2 border-gray-300')}
                    type="white"
                    key={i}
                  />
                )
                )}
                </fieldset>
            </motion.div>
          ))}
      </div>
      {allCardsSent && playerIsHost ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PrimaryButton
            disabled={!winner}
            onClick={onWinnerSelect}
            className={classNames({ 'opacity-50 pointer-events-none': !winner })}
          >
            Confirmar
          </PrimaryButton>
        </motion.div>
      ) : null}
    </div>
  )
}

function CardPicker({ cardsToPick, cards = [], onCardsPicked, onDiscard }) {
  const [selected, setSelected] = useState([])
  const selectCardMessage = cardsToPick === 1 ? 'Elije una carta' : `Elije ${cardsToPick} cartas`
  const showSendButton = selected.length >= cardsToPick
  const showDiscardButton = selected.length >= 1
  function selectCard(card) {
    if (cardIsSelected(card)) {
      setSelected(selected.filter(c => c !== card))
    } else {
      setSelected(selected.concat(card).slice(-cardsToPick))
    }
  }

  function cardIsSelected(card) {
    return selected.indexOf(card) !== -1
  }

  function sendCards() {
    onCardsPicked(selected)
    setSelected([])
  }

  function discard() {
    onDiscard(selected)
    setSelected([])
  }

  return (
    <div className="flex flex-col gap-2 items-start mx-auto max-w-full pb-1">
      <p className="font-medium text-lg">{selectCardMessage}</p>
      <motion.div className="flex items-center gap-3" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <PrimaryButton
          disabled={!showSendButton}
          onClick={sendCards}
          className={classNames({ 'opacity-50 pointer-events-none': !showSendButton })}
        >
          {cardsToPick === 1 ? 'Elegir esta carta' : 'Elegir estas cartas'}
        </PrimaryButton>
        <Button
                  disabled={!showDiscardButton}
                  onClick={discard}
                  className={classNames({ 'opacity-50 pointer-events-none': !showDiscardButton })}
                  >
                   Descartar
                   </Button>
      </motion.div>
      <div className="overflow-x-auto max-w-full">
        <div className="flex md:justify-center items-start gap-3 p-1 my-1">
          <AnimatePresence>
            {cards.map(card => (
              <GameCard
                key={card}
                type="white"
                text={decodeHtml(card)}
                aria-pressed={cardIsSelected(card) ? true : false}
                aria-label={decodeHtml(card)}
                className={classNames('text-left flex-shrink-0 hover:bg-gray-50 focus:outline-none', {
                  'ring-4 ring-blue-500': cardIsSelected(card)
                })}
                as={motion.button}
                badge={cardsToPick > 1 ? selected.indexOf(card) + 1 : 0}
                onClick={() => selectCard(card) }
                initial={{ x: 200, opacity: 0, width: 0 }}
                animate={{ x: 0, opacity: 1, width: '' }}
                exit={{ x: -200, width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ touchAction: 'pan-x' }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const PlayGame = withGame(PlayGameUI)
export default PlayGame
