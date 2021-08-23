import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ButtonCard from '@/components/ButtonCard'
import { motion } from 'framer-motion'
import { leaveGame, useGameList } from '@/lib/gameUtils'
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
      const id = window.prompt('Introduce el ID de la partida (4 digitos)')
      if (id && id.length === 4) {
        navigate(`/join/${id}`)
      }
    }
  }

  function createGame() {
    if (currentGame) {
      // TODO: make a UI effect (animation or alert) to confirm that you have just left the game
      leaveGame({ socket, game: currentGame, playerId })
      refetch()
    } else {
      navigate('/newgame')
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)' }} className="flex flex-col justify-center items-center py-4 px-2">
      <h1 className="mt-6 text-4xl font-semibold">Cartas contra la web</h1>
      <div className="md:flex flex-row justify-center items-center my-12 space-y-6 md:space-y-0 md:space-x-6">
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
      {/* <Link to="/decks" className="mb-6 font-medium text-gray-200 hover:text-white hover:underline">
        Editor de mazos
      </Link> */}
      <Link to="/guide" className="mb-6 font-medium text-gray-200 hover:text-white hover:underline">
        ¿Como se juega?
      </Link>
    </div>
  )
}
