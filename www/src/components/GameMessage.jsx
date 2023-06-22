import React from 'react'
import Container from '@/components/Container'
import { Link, useParams } from 'react-router-dom'

export default function GameMessage({ loading, error }) {
  const { id } = useParams()

  if (error) {
    const msg =
      error.status === 404 ? `No se ha encontrado ningún juego para el ID ${id}` : `Error cargando el juego ${id}`
    return <ErrorMessage message={msg} />
  }

  if (loading) {
    return <LoadingMessage />
  }

  return null
}

export function ErrorMessage({ message }) {
  return (
    <Container style={{ minHeight: 'calc(100vh - 52px)' }} className="flex flex-col justify-center items-center">
      <p className="text-gray-100 text-center text-lg font-semibold">{message}</p>
      <Link to="/" className="text-blue-300 font-semibold hover:underline mt-2 p-2">
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
