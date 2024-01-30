import React, { useEffect, useState } from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { useNavigate, useParams, useLocation } from 'react-router'
import useLocalStorage from '@/lib/useLocalStorage'
import { DECKS_KEY } from './DeckEdit'
import { Stack } from 'phosphor-react'
import { useSocket } from '@/lib/SocketProvider'
import CopyLink from '@/components/CopyLink'

export default function DeckShare() {
  const navigate = useNavigate()
  const loc = useLocation()
  const searchParams = new URLSearchParams(loc.search)
  const isHost = searchParams.get('role') === 'host'

  return (
    <Container>
      <div>
        <Button
          padding="p-2"
          className="rounded-full hover:shadow-md mb-4"
          backgroundColor="bg-white hover:bg-blue-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon aria-hidden="true" className="w-5 h-5" />Atrás
        </Button>
      </div>
      <h3 className="mb-4 text-3xl font-medium">Compartiendo mazo</h3>
      {isHost ? <SharedDeckHost /> : <SharedDeckGuest />}
    </Container>
  )
}

function SharedDeckHost() {
  const socket = useSocket()
  const shareLink = window.location.href.replace('role=host', 'role=guest')
  const { id } = useParams()
  const [decks] = useLocalStorage(DECKS_KEY, [])
  const localDeck = decks.find(d => d.id === id)
  const [saveCount, setSaveCount] = useState(0)

  useEffect(() => {
    if (socket && localDeck) {
      socket.emit('deck:share', localDeck)
      socket.on('deck:saved', () => setSaveCount(count => count + 1))

      return () => {
        socket.off('deck:saved')
        socket.emit('deck:unshare', id)
      }
    }
  }, [socket])

  if (!socket) {
    return null
  }

  if (!localDeck) {
    return (
      <div>
        <p>Mazo no encontrado</p>
      </div>
    )
  }

  return (
    <div>
      <CopyLink label="Enlace para compartir" link={shareLink} />
      <div className="flex flex-col space-y-6 items-center justify-center text-center px-3 py-6 mt-4 border border-white rounded-xl">
        <p className="text-xl font-medium">{localDeck.name}</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Stack className="w-8 h-8 text-white" />
            <p className="text-lg font-medium">{localDeck.whiteCards.length} blancas</p>
          </div>
          <div className="flex items-center gap-1">
            <Stack className="w-8 h-8 text-gray-900" />
            <p className="text-lg font-medium">{localDeck.blackCards.length} negras</p>
          </div>
        </div>
        <p className="text-lg">
          Guardado por {saveCount} {saveCount === 1 ? 'usuario' : 'usuarios'}
        </p>
      </div>
      <p className="mt-4">Mantén esta página abierta para compartir el mazo</p>
    </div>
  )
}

function SharedDeckGuest() {
  const socket = useSocket()
  const { id } = useParams()
  const [remoteDeck, setRemoteDeck] = useState(null)
  const [loading, setLoading] = useState(true)
  const [decks, setDecks] = useLocalStorage(DECKS_KEY, [])
  const [saved, setSaved] = useState(decks.some(d => d.id === id))

  useEffect(() => {
    if (socket && !remoteDeck) {
      socket.emit('deck:request', id)
      socket.once('deck:response', deck => {
        setRemoteDeck(deck)
        setLoading(false)
      })
    }
  }, [socket])

  function saveDeck() {
    socket.emit('deck:saved', id)
    setDecks(decks.concat(remoteDeck))
    setSaved(true)
  }

  if (loading || !socket) {
    return (
      <div>
        <p>Cargando mazo compartido ...</p>
      </div>
    )
  }

  if (!remoteDeck) {
    return (
      <div>
        <p>Mazo no encontrado</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6 items-center justify-center text-center px-3 py-6 mt-4 border border-white rounded-xl">
      <p className="text-xl font-medium">{remoteDeck.name}</p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <Stack className="w-8 h-8 text-white" />
          <p className="text-lg font-medium">{remoteDeck.whiteCards.length} blancas</p>
        </div>
        <div className="flex items-center gap-1">
          <Stack className="w-8 h-8 text-gray-900" />
          <p className="text-lg font-medium">{remoteDeck.blackCards.length} negras</p>
        </div>
      </div>
      {saved ? (
        <p className="mt-8">Ya tienes este mazo</p>
      ) : (
        <Button className="mt-12 font-semibold" onClick={saveDeck}>
          Guardar mazo
        </Button>
      )}
    </div>
  )
}
