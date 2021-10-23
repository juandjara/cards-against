import React, { useEffect, useState } from 'react'
import { editGame, joinGame, leaveGame } from '@/lib/gameUtils'
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

    // TODO: 1. save name in local storage and use as second argument for prompt in other plays
    //       2. replace window.prompt with custom modal
    joinGame({ socket, game, playerId })

    return () => {
      if (socket) {
        socket.off('game:edit')
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

  function onRoundWhiteCardClick(card) {
    if (!playerIsHost) {
      return
    }

    if (card.hidden) {
      socket.emit('game:reveal-card', {
        gameId: game.id,
        playerId: card.player
      })
    } else {
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
  }

  function closeGameOverModal() {
    leaveGame({ socket, game, playerId })
    navigate('/')
  }

  return (
    <main className="h-full px-4 flex flex-col items-stretch justify-start" style={{ minHeight: 'calc(100vh - 54px)' }}>
      <PlayersInfo game={game} />
      <GameOverModal closeModal={closeGameOverModal} game={game} />
      <RoundModal closeModal={closeModal} show={showRoundModal && !game.finished} game={game} />
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
        <p className="text-center flex-grow">
          {allCardsSent
            ? '... Esperando a que el juez elija la carta ganadora'
            : '... Esperando a que los jugadores envíen sus cartas'}
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
      <ul className="pt-4">
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
  const title = `Ganador de la ronda: ${round?.winner?.name}`
  const whiteCards = round ? round.whiteCards : []
  const blackCard = round ? round.blackCard : { text: '' }
  return (
    <Modal show={show} onClose={closeModal} title={title}>
      <div className="py-6 flex flex-wrap items-center justify-center content-center">
        <GameCard className="m-2 ml-0" type="black" text={decodeHtml(blackCard.text)} badge={blackCard.pick} />
        {whiteCards.map(c => (
          <GameCard className="shadow-lg m-2" text={decodeHtml(c.card)} type="white" key={c.card} />
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
      <span title="Jugador. Carta enviada">
        <Check className="w-6 h-6" />
      </span>
    )
  } else {
    return (
      <span title="Jugador. Esperando a que este jugador envie su carta">
        <Clock className="w-6 h-6 opacity-50" />
      </span>
    )
  }
}

function PlayersInfo({ game }) {
  const host = game.round.host
  const roundNum = game.finishedRounds.length + 1
  return (
    <div className="pt-2 flex items-start justify-between">
      <ul className="space-y-3">
        {game.players.map(p => (
          <li key={p.id} className="flex space-x-3 items-center">
            {getPlayerState(game, p)}
            <span className="font-medium font-mono bg-gray-900 px-2 py-1 rounded-lg">{p.points}</span>
            <span className={`${p.id === host ? 'font-bold' : 'font-medium'} text-lg`}>{p.name} </span>
          </li>
        ))}
      </ul>
      <p className="text-lg font-bold flex-shrink-0 pl-4">Ronda {roundNum}</p>
    </div>
  )
}

function decodeHtml(html) {
  var el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

function groupCardsByPlayer(cards) {
  const players = {}
  for (const card of cards) {
    players[card.player] = players[card.player] || { player: card.player, cards: [] }
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
  onWinnerSelect
}) {
  function getGroupClassName(group) {
    const selectedStyles = group.player === winner ? 'ring-4 ring-blue-500 ring-inset' : ''
    return `${selectedStyles} bg-gray-900 bg-opacity-20 rounded-xl m-1 flex flex-wrap flex-shrink-0 text-left items-center justify-center`
  }

  const cardCounter = showCardCounter && (
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
  )

  return (
    <div className="flex-grow py-6 flex flex-col items-center justify-center content-center">
      {winner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PrimaryButton onClick={onWinnerSelect} className="my-2">
            Marcar como ganador
          </PrimaryButton>
        </motion.div>
      )}
      <div className="py-4 flex flex-wrap items-center justify-center">
        {round.blackCard && (
          <GameCard className="m-2" type="black" text={decodeHtml(round.blackCard.text)} badge={round.blackCard.pick} />
        )}
        {cardCounter}
        <ul className="flex flex-wrap justify-center">
          {allCardsSent &&
            groupCardsByPlayer(round.whiteCards).map(group => (
              <div key={group.player} className={getGroupClassName(group)}>
                {group.cards.map((c, i) =>
                  playerIsHost ? (
                    <GameCard
                      text={c.hidden ? '¿?' : decodeHtml(c.card)}
                      className="m-2 text-left focus:outline-none"
                      type="white"
                      key={i}
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onCardClick(c)}
                    />
                  ) : (
                    <GameCard
                      text={c.hidden ? '¿?' : decodeHtml(c.card)}
                      className="m-2 text-left"
                      type="white"
                      key={i}
                    />
                  )
                )}
              </div>
            ))}
        </ul>
      </div>
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

  function getCardClassName(card) {
    const selectedStyles = cardIsSelected(card) ? 'ring-4 ring-blue-500 ring-inset' : ''
    return `mt-2 flex-shrink-0 text-left focus:outline-none ${selectedStyles}`
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
    <div className="">
      <div className="mx-auto px-1 md:px-8 max-w-6xl mb-1">
        {showSendButton || showDiscardButton ? (
          <motion.div className="mb-2" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
            {showSendButton && (
              <PrimaryButton onClick={sendCards}>
                {cardsToPick === 1 ? 'Elegir esta carta' : 'Elegir estas cartas'}
              </PrimaryButton>
            )}
            {showDiscardButton && (
              <Button onClick={discard} className="ml-2">
                Descartar
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="h-9 mb-2"></div>
        )}
        <p className="font-medium text-xl">
          <span>Cartas en tu mano</span>
          <small className="text-gray-100 text-base"> · {selectCardMessage}</small>
        </p>
      </div>
      <div className="overflow-x-auto flex md:justify-center items-start space-x-4">
        <AnimatePresence>
          {cards.map(card => (
            <GameCard
              key={card}
              type="white"
              text={decodeHtml(card)}
              className={getCardClassName(card)}
              as={motion.button}
              onClick={() => selectCard(card)}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -200, opacity: 0 }}
              whileHover={{ y: -20 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

const PlayGame = withGame(PlayGameUI)
export default PlayGame
