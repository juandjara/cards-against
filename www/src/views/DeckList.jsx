import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftIcon, ShareIcon, TrashIcon } from '@heroicons/react/solid'
import Button from '@/components/Button'
import Container from '@/components/Container'
import { Link } from 'react-router-dom'
import useLocalStorage from '@/lib/useLocalStorage'
import { DECKS_KEY } from '@/views/DeckEdit'
import { Stack } from 'phosphor-react'
import { useAlert } from '@/components/Alert'
import PrimaryButton from '@/components/PrimaryButton'
import DeckImport from '@/components/DeckImport'

export default function DeckList() {
  const navigate = useNavigate()
  const [decks, setDecks] = useLocalStorage(DECKS_KEY, [])
  const showAlert = useAlert()

  function deleteDeck(deck) {
    const confirm = window.confirm(`¿Estas seguro de eliminar el mazo ${deck.name}?`)
    if (confirm) {
      const newDecks = decks.filter(d => d.id !== deck.id)
      setDecks(newDecks)
      showAlert({ type: 'success', text: 'Mazo eliminado correctamente' })
    }
  }

  return (
    <Container>
      <div>
        <Button
          padding="p-2"
          className="rounded-full hover:shadow-md mb-4"
          backgroundColor="bg-white hover:bg-blue-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon aria-hidden="true" className="w-5 h-5" />
          Atrás
        </Button>
      </div>
      <h3 role="alert" className="mb-2 text-3xl font-medium">
        Mazos personalizados
      </h3>
      {decks.length === 0 && <p className="mb-1">No tienes guardado ningún mazo personalizado.</p>}
      <div className="flex items-center gap-3 mt-6">
        <Link to="/decks/new">
          <PrimaryButton>Crear mazo</PrimaryButton>
        </Link>
        <DeckImport onImport={deck => setDecks(decks.concat(deck))} />
      </div>
      <ul className="mt-6 space-y-6">
        {decks.map(d => (
          <li key={d.id}>
            <div className="bg-gray-500 border border-white py-3 px-4 rounded-lg hover:shadow-lg">
              <p className="hover:underline text-xl font-medium capitalize pt-2 pb-4">
                <Link className="block" to={`/decks/${d.id}`}>
                  {d.name}
                </Link>
              </p>
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="flex items-center gap-1">
                    <Stack className="w-6 h-6 text-white" />
                    <p className="font-bold">{d.whiteCards.length}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Stack className="w-6 h-6 text-gray-900" />
                    <p className="font-bold">{d.blackCards.length}</p>
                  </div>
                </div>
                <Link
                  to={`/decks/share/${d.id}?role=host`}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-600 bg-opacity-75"
                >
                  <ShareIcon className="h-6 w-6" />
                </Link>
                <Button
                  onClick={() => deleteDeck(d)}
                  padding="p-2"
                  textColor="white"
                  backgroundColor="hover:bg-red-600"
                >
                  <TrashIcon className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}
