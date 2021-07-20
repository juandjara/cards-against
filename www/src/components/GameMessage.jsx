import React from 'react'
import Container from '@/components/Container'
import { Link, useParams } from 'react-router-dom'

export default function GameMessage({ loading, error }) {
  const { id } = useParams()

  if (error) {
    return <ErrorMessage status={error.status} id={id} />
  }

  if (loading) {
    return <LoadingMessage />
  }

  return null
}

function ErrorMessage({ id, status }) {
  const msg = status === 404 ? `No se ha encontrado ningún juego para el ID ${id}` : `Error cargando el juego ${id}`
  return (
    <Container style={{ minHeight: 'calc(100vh - 52px)' }} className="flex flex-col justify-center items-center">
      <p className="text-gray-100 text-lg font-semibold">{msg}</p>
      <Link to="/" className="text-blue-300 hover:underline mt-2">
        Volver
      </Link>
    </Container>
  )
}

function LoadingMessage() {
  return (
    <Container style={{ minHeight: 'calc(100vh - 52px)' }} className="flex flex-col justify-center items-center">
      <p>Cargando datos del juego...</p>
    </Container>
  )
}
