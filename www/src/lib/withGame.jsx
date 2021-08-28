import React from 'react'
import { useParams } from 'react-router-dom'
import GameMessage from '@/components/GameMessage'
import { useGame } from '@/lib/gameUtils'
import { useSocket } from '@/lib/SocketProvider'

export default function withGame(Component) {
  function wrappedComponent() {
    const socket = useSocket()
    const { id } = useParams()
    const { game, loading, error } = useGame(id)

    const ready = game && socket

    return ready ? <Component socket={socket} game={game} /> : <GameMessage error={error} loading={loading} />
  }

  wrappedComponent.displayName = `withGame(${Component.displayName || Component.name})`

  return wrappedComponent
}
