import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftIcon, PencilIcon, ShareIcon } from '@heroicons/react/solid'
import Button from '@/components/Button'
import Container from '@/components/Container'
import { Link } from 'react-router-dom'
import useLocalStorage from '@/lib/useLocalStorage'
import { DECKS_KEY } from '@/views/DeckEdit'
import { Stack } from 'phosphor-react'

export default function DeckList() {
  const navigate = useNavigate()
  const [decks] = useLocalStorage(DECKS_KEY, [])

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
      <h3 className="mb-4 text-3xl font-medium">Mazos personalizados</h3>
      {decks.length === 0 && <p className="mb-1">No tienes guardado ningun mazo personalizado.</p>}
      <Link className="text-blue-300 hover:text-blue-200 transition-colors" to="/decks/new">
        Crear mazo
      </Link>
      <ul className="mt-6 space-y-6">
        {decks.map(d => (
          <li key={d.id}>
            <div className="flex flex-wrap items-center border border-white py-3 px-4 rounded-lg hover:shadow-lg">
              <div>
                <p className="text-xl font-medium capitalize">{d.name}</p>
                <div className="flex items-center space-x-4 mt-4 mb-1">
                  <div className="flex items-center space-x-2">
                    <Stack className="w-6 h-6 text-white" />
                    <p className="font-bold">{d.whiteCards.length}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stack className="w-6 h-6 text-gray-900" />
                    <p className="font-bold">{d.blackCards.length}</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow"></div>
              <Link to={`/decks/${d.id}`} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-500">
                <PencilIcon className="h-6 w-6" />
                <p className="font-medium">Editar</p>
              </Link>
              <Link
                to={`/decks/share/${d.id}?role=host`}
                className="flex items-center space-x-2 p-2 ml-2 rounded-lg hover:bg-gray-500"
              >
                <ShareIcon className="h-6 w-6" />
                <p className="font-medium">Compartir</p>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}
