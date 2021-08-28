import config from '@/config'
import { useQuery } from 'react-query'

async function fetchGame({ queryKey }) {
  const id = queryKey[1]
  const res = await fetch(`${config.api}/games/${id}`)
  if (!res.ok) {
    const text = await res.text()
    const error = new Error(`Request failed with status code ${res.status}: \n${text}`)
    error.status = res.status
    throw error
  }

  const json = await res.json()
  return json
}

async function fetchAllGames() {
  const res = await fetch(`${config.api}/games`)
  if (!res.ok) {
    const text = await res.text()
    const error = new Error(`Request failed with status code ${res.status}: \n${text}`)
    error.status = res.status
    throw error
  }

  const json = await res.json()
  return json
}

export function useGame(id) {
  const { data, error, isLoading } = useQuery(['game', id], fetchGame, {
    retry: false
  })
  return {
    game: data,
    loading: isLoading || !data,
    error
  }
}

export function useGameList() {
  const { data, error, isLoading, refetch } = useQuery('public-games', fetchAllGames, {
    retry: false
  })
  return {
    games: data || [],
    loading: isLoading || !data,
    error,
    refetch
  }
}

export function editGame(cache, game) {
  cache.setQueryData(['game', game.id], game)
}

export function joinGame({ socket, game, playerId }) {
  const playerHasJoined = game.players.some(p => p.id === playerId)
  let msg = 'Introduce un nombre de usuario'
  let name = 'rejoining ...'

  if (!playerHasJoined) {
    name = window.prompt(msg)
    if (!name) {
      msg = msg + ' que no este vacío'
      name = window.prompt(msg)
    }
    if (!name) {
      msg = msg + ' por favor'
      name = window.prompt(msg)
    }
    if (!name) {
      msg = msg + '. En serio'
      name = window.prompt(msg)
    }
    if (!name) {
      msg = 'Introduce el nombre que te de la gana'
      name = window.prompt(msg)
    }
  }

  socket.emit('game:join', { gameId: game.id, name, playerId })
}

export function leaveGame({ socket, game, playerId }) {
  socket.emit('game:leave', {
    gameId: game.id,
    playerId
  })
}
