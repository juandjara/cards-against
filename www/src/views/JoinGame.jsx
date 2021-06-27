import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { Copy, StackSimple } from 'phosphor-react'
import Button from '@/components/Button'
import PrimaryButton from '@/components/PrimaryButton'
import Container from '@/components/Container'
import { useSocket } from '@/lib/SocketProvider'
import { useGame, GameLoaderUI } from '@/lib/GameLoader'
import { useQueryClient } from 'react-query'
import { editGame } from '@/lib/GameLoader'

export default function JoinGame() {
  const cache = useQueryClient()
  const socket = useSocket()
  const { id } = useParams()
  const gameQuery = useGame(id)
  const game = gameQuery.game

  const playerHasJoined = game && game.players.some((p) => p.id === socket.id)

  useEffect(() => {
    if (socket && game) {
      socket.on('game:edit', (game) => editGame(cache, game))
      if (!playerHasJoined) {
        // TODO: 1. save name in local storage and use as second argument for prompt in other plays
        // TODO: 2. replace window.prompt with custom modal
        const name = window.prompt('Introduce un nombre de usuario')
        socket.emit('game:join', {
          gameId: game.id,
          user: { id: socket.id, name }
        })
      }
    }

    return () => {
      if (socket) {
        socket.off('game:edit')
      }
    }
  }, [socket, game])

  return (
    <GameLoaderUI {...gameQuery}>
      <JoinGameUI socket={socket} game={game} />
    </GameLoaderUI>
  )
}

function JoinGameUI({ socket, game }) {
  const navigate = useNavigate()
  const playerIsHost = socket && game && game.players[0] && game.players[0].id === socket.id

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to the clipboard')
    })
  }

  return (
    <Container>
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
          <p className="ml-1 mb-1 text-sm text-gray-200 font-medium">
            Enlace para compartir
          </p>
          <div className="flex">
            <pre className="py-2 pl-3 px-5 -mr-2 bg-white text-gray-700 rounded-l-md">
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
        <Players game={game} />
        {playerIsHost ? (
          <PrimaryButton>Comenzar</PrimaryButton>
        ) : (
          <p>Esperando a que el anfitrión empieze el juego ...</p>
        )}
      </div>
    </Container>
  )
}

function Players({ game }) {
  if (!game) {
    return (
      <div>
        <p className="ml-1 text-sm text-gray-200 font-medium">
          Cargando lista de jugadores...
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="ml-1 text-sm text-gray-200 font-medium">Jugadores</p>
      <ul>
        {game.players.map((p, i) => (
          <li key={p.id} className="flex items-center space-x-2 py-2">
            <StackSimple
              weight="fill"
              className={i === 0 ? 'text-gray-900' : 'text-white'}
              width={24}
              height={24}
            />
            <span>{p.name}</span>
            {i === 0 && <small>- Anfitrión</small>}
          </li>
        ))}
      </ul>
    </div>
  )
}
