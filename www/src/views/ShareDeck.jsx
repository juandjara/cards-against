import React, { useEffect, useState } from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { useNavigate, useParams, useLocation } from 'react-router'
import useLocalStorage from '@/lib/useLocalStorage'
import { DECKS_KEY } from './DeckEdit'
import { Copy, Stack } from 'phosphor-react'
import { useSocket } from '@/lib/SocketProvider'

export default function ShareDeck() {
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
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
      </div>
      <h3 className="mb-4 text-3xl font-medium">Compartir mazo</h3>
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
      <CopyLinkUI className="my-6" link={shareLink} />

      <div className="flex flex-col items-center justify-center h-96 mt-4 border border-white rounded-xl">
        <p className="text-xl">
          Compartiendo mazo <strong>{localDeck.name}</strong>
        </p>
        <div className="flex items-center space-x-6 mt-4 mb-4">
          <div className="flex items-center space-x-2">
            <Stack className="w-8 h-8 text-white" />
            <p className="text-xl font-bold">{localDeck.whiteCards.length}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Stack className="w-8 h-8 text-gray-900" />
            <p className="text-xl font-bold">{localDeck.blackCards.length}</p>
          </div>
        </div>
        <p className="mt-6 text-lg">
          Guardado {saveCount} {saveCount === 1 ? 'vez' : 'veces'}
        </p>
        <p className="mt-8">
          Mantén esta página abierta para compartir el mazo <strong>{localDeck.name}</strong>
        </p>
      </div>
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
    <div className="flex flex-col items-center justify-center h-96 mt-4 border border-white rounded-xl">
      <p className="text-xl">
        Mazo compartido <strong>{remoteDeck.name}</strong>
      </p>
      <div className="flex items-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <Stack className="w-8 h-8 text-white" />
          <p className="text-xl font-bold">{remoteDeck.whiteCards.length}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Stack className="w-8 h-8 text-gray-900" />
          <p className="text-xl font-bold">{remoteDeck.blackCards.length}</p>
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

function CopyLinkUI({ link, ...props }) {
  function copyLink() {
    navigator.clipboard.writeText(link).then(() => {
      alert('Enlace copiado al portapapeles')
    })
  }

  return (
    <div {...props}>
      <p className="mb-1 text-sm text-gray-200 font-medium">Enlace para compartir</p>
      <div className="flex">
        <pre className="py-2 pl-3 px-5 -mr-2 bg-white text-gray-700 rounded-l-md">
          <code>{link}</code>
        </pre>
        <Button
          title="Copiar enlace"
          className="rounded-r-md"
          backgroundColor="bg-white"
          textColor="text-gray-500 hover:text-blue-500"
          padding="p-2"
          onClick={copyLink}
        >
          <Copy width={24} height={24} />
        </Button>
      </div>
    </div>
  )
}
