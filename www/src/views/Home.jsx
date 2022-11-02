import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ButtonCard from '@/components/ButtonCard'
import { motion } from 'framer-motion'
import { useGameList } from '@/lib/gameUtils'
import usePlayerId from '@/lib/usePlayerId'
import { useSocket } from '@/lib/SocketProvider'

export default function Home() {
  const socket = useSocket()
  const navigate = useNavigate()
  const playerId = usePlayerId()
  const { games, refetch } = useGameList()
  const currentGame = games.find(g => g.players.find(p => p.id === playerId))

  function joinGame() {
    if (currentGame) {
      navigate(`/join/${currentGame.id}`)
    } else {
      navigate('/publicgames')
    }
  }

  function createGame() {
    if (currentGame) {
      // TODO: make a UI effect (animation or alert) to confirm that you have just left the game
      socket.emit('game:leave', { playerId, gameId: currentGame.id })
      refetch()
    } else {
      navigate('/newgame')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center py-4 px-2">
      <h1 className="my-8 font-bold text-center text-4xl">Cartas contra la web</h1>
      <div className="md:flex flex-row justify-center items-center mt-8 mb-12 space-y-6 md:space-y-0 md:space-x-6">
        <ButtonCard
          as={motion.button}
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          onClick={joinGame}
          type="white"
          text={currentGame ? 'Continuar partida' : 'Unirse a una partida'}
        />
        <ButtonCard
          as={motion.button}
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          onClick={createGame}
          type="black"
          text={currentGame ? 'Abandonar partida' : 'Crear partida'}
        />
      </div>
      <div className="space-y-4">
        <Link to="/decks" className="block text-center font-medium hover:underline">
          Mazos personalizados
        </Link>
        <Link to="/guide" className="block text-center font-medium hover:underline">
          ¿Como se juega?
        </Link>
      </div>
    </div>
  )
}
