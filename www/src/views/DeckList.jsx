import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import Button from '@/components/Button'
import Container from '@/components/Container'
import { Link } from 'react-router-dom'

export default function DeckList() {
  const navigate = useNavigate()
  return (
    <Container>
      <div>
        <Button
          padding="p-2"
          className="rounded-full hover:shadow-md mb-4"
          backgroundColor="bg-white hover:bg-blue-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
      </div>
      <h3 className="mb-3 text-3xl font-medium">Mazos personalizados</h3>
      <p>
        No tienes guardado ningun mazo personalizado.{' '}
        <Link className="text-blue-300 hover:text-blue-200 transition-colors" to="/decks/new">
          Crear mazo
        </Link>
      </p>
    </Container>
  )
}
