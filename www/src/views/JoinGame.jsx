import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { Copy, CrownSimple, User } from 'phosphor-react'
import Button from '@/components/Button'
import PrimaryButton from '@/components/PrimaryButton'
import Container from '@/components/Container'
import { editGame } from '@/lib/gameUtils'
import { useQueryClient } from 'react-query'
import usePlayerId from '@/lib/usePlayerId'
import withGame from '@/lib/withGame'
import { X as XIcon } from 'phosphor-react'
import NameEditModal from '@/components/NameEditModal'

const MIN_PLAYERS = 2

function JoinGameUI({ socket, game }) {
  const navigate = useNavigate()
  const cache = useQueryClient()
  const playerId = usePlayerId()
  const playerIsHost = socket && game && game.players[0] && game.players[0].id === playerId
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    socket.emit('game:rejoin', { gameId: game.id })
    if (game.started) {
      navigate(`/game/${game.id}`)
    }

    socket.on('game:edit', game => {
      editGame(cache, game)
      if (game.started) {
        navigate(`/game/${game.id}`)
      }
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

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      window.alert('Enlace copiado al portapapeles')
    })
  }

  function startGame() {
    setLoading(true)
    socket.emit('game:start', game.id)
  }

  function removePlayer(playerId) {
    socket.emit('game:leave', { playerId, gameId: game.id })
  }

  return (
    <Container>
      <NameEditModal game={game} socket={socket} />
      <Button
        padding="p-2"
        className="rounded-full hover:shadow-md"
        backgroundColor="bg-white hover:bg-blue-50"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </Button>
      <h2 className="mt-4 text-3xl font-semibold">Unirse a partida</h2>
      <p className="mb-8 text-2xl text-gray-300 uppercase">ID {game.id}</p>

      <div className="space-y-8">
        <div>
          <p className="ml-1 mb-1 text-sm text-gray-200 font-medium">Enlace para compartir</p>
          <div className="flex">
            <pre className="truncate py-2 pl-3 px-5 -mr-2 bg-white text-gray-700 rounded-l-md">
              <code>{window.location.href}</code>
            </pre>
            <Button
              title="Copiar enlace"
              className="rounded-r-md"
              backgroundColor="bg-white"
              textColor="text-gray-500 hover:text-blue-500"
              padding="p-2"
              onClick={copyLink}
            >
              <Copy width={24} height={24} />
            </Button>
          </div>
        </div>
        <Players game={game} playerIsHost={playerIsHost} onRemovePlayer={removePlayer} />
        {playerIsHost ? (
          <div className="flex items-center space-x-3">
            <PrimaryButton
              onClick={startGame}
              className="flex-shrink-0"
              disabled={loading || game.players.length < MIN_PLAYERS}
            >
              Comenzar
            </PrimaryButton>
            {game.players.length < MIN_PLAYERS && (
              <p className="text-sm">Se necesita un minimo de {MIN_PLAYERS} jugadores para comenzar una partida</p>
            )}
          </div>
        ) : (
          <p>Esperando a que el anfitrión empieze el juego...</p>
        )}
      </div>
    </Container>
  )
}

function Players({ game, playerIsHost, onRemovePlayer }) {
  if (!game) {
    return (
      <div>
        <p className="ml-1 text-sm text-gray-200 font-medium">Cargando lista de jugadores...</p>
      </div>
    )
  }

  return (
    <div>
      <p className="ml-1 text-sm text-gray-200 font-medium">Jugadores</p>
      <ul>
        {game.players.map((p, i) => (
          <li key={p.id} className="flex items-center space-x-2 py-2">
            {i === 0 ? (
              <CrownSimple weight="fill" className="text-gray-900 w-6 h-6" />
            ) : (
              <User weight="fill" className="text-white w-6 h-6" />
            )}
            <span>{p.name}</span>
            {i === 0 && <small>- Anfitrión</small>}
            {i > 0 && playerIsHost && (
              <button
                title="Eliminar selección"
                aria-label="Eliminar selección"
                className="p-1 rounded-xl hover:bg-white hover:bg-opacity-25"
                onClick={() => onRemovePlayer(p.id)}
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const JoinGame = withGame(JoinGameUI)
export default JoinGame
