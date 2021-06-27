import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '@/components/Card'

export default function Home() {
  const navigate = useNavigate()

  function joinGame() {
    const id = window.prompt('Introduce el ID de la partida (4 digitos)')
    if (id && id.length === 4) {
      navigate(`/join/${id}`)
    }
  }

  return (
    <div
      style={{ minHeight: 'calc(100vh - 52px)' }}
      className="flex flex-col justify-center items-center py-4 px-2 mb-8"
    >
      <h1 className="mt-6 text-4xl font-semibold">Cards Against Web</h1>
      <div className="md:flex flex-row justify-center items-center my-12 space-y-6 md:space-y-0 md:space-x-6">
        <Card
          as="button"
          type="white"
          text="Unirse a una partida"
          onClick={joinGame}
        />
        <Card as={Link} to="/newgame" type="black" text="Crear partida" />
      </div>
      <Link
        to="/decks"
        className="mb-6 font-medium text-gray-200 hover:text-white hover:underline"
      >
        Editor de mazos
      </Link>
      <Link
        to="/guide"
        className="mb-6 font-medium text-gray-200 hover:text-white hover:underline"
      >
        ¿Como se juega?
      </Link>
    </div>
  )
}
