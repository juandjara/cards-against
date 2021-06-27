import React from 'react'
import config from '@/config'
import Container from '@/components/Container'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'

async function fetchGame({ queryKey }) {
  const id = queryKey[1]
  const res = await fetch(`${config.api}/games/${id}`)
  if (!res.ok) {
    const text = await res.text()
    const error = new Error(
      `Request failed with status code ${res.status}: \n${text}`
    )
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
    loading: isLoading,
    error
  }
}

export function editGame(cache, game) {
  cache.setQueryData(['game', game.id], game)
}

export function GameLoaderUI({ game, loading, error, children }) {
  const { id } = useParams()
  if (error) {
    return <ErrorMessage status={error.status} id={game?.id || id} />
  }

  if (loading || !game) {
    return <Loading />
  }

  return children
}

function ErrorMessage({ id, status }) {
  const msg =
    status === 404
      ? `No se ha encontrado ningún juego para el ID ${id}`
      : `Error cargando el juego ${id}`
  return (
    <Container
      style={{ minHeight: 'calc(100vh - 52px)' }}
      className="flex flex-col justify-center items-center"
    >
      <p className="text-gray-100 text-lg font-semibold">{msg}</p>
      <Link to="/" className="text-blue-300 hover:underline mt-2">
        Volver
      </Link>
    </Container>
  )
}

function Loading() {
  return (
    <Container
      style={{ minHeight: 'calc(100vh - 52px)' }}
      className="flex flex-col justify-center items-center"
    >
      <p>Cargando datos del juego...</p>
    </Container>
  )
}
