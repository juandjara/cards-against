import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { nanoid } from 'nanoid'
import { AnimatePresence } from 'framer-motion'
import { useAlert } from '@/components/Alert'
import CardEditForm from '@/components/CardEditForm'
import CardEditGroup from '@/components/CardEditGroup'

export const DECKS_KEY = 'CCW_DECKS'

export default function DeckEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState(() => {
    let decks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')
    const deck = decks.find(d => d.id === id)
    return deck ? deck.name : `Mazo ${decks.length + 1}`
  })

  const [whiteCards, setWhiteCards] = useState([])
  const [blackCards, setBlackCards] = useState([])
  const [editingCard, setEditingCard] = useState(null)
  const alert = useAlert()

  useEffect(() => {
    if (id && id !== 'new') {
      const decks = JSON.parse(localStorage.getItem(DECKS_KEY) || [])
      const deck = decks.find(d => d.id === id)
      if (deck) {
        setTitle(deck.name)
        setWhiteCards(deck.whiteCards)
        setBlackCards(deck.blackCards)
      }
    }
  }, [])

  function handleSubmit(ev) {
    ev.preventDefault()
    saveDeck()
  }

  function saveDeck() {
    let decks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')
    const currentDeck = {
      id,
      name: title,
      whiteCards,
      blackCards
    }

    if (id === 'new') {
      currentDeck.id = nanoid()
      decks.push(currentDeck)
    } else {
      decks = decks.map(d => (d.id === id ? currentDeck : d))
    }

    localStorage.setItem(DECKS_KEY, JSON.stringify(decks))
    alert({ type: 'success', text: 'Mazo guardado correctamente' })
    navigate(`/decks/${currentDeck.id}`)
  }

  function openEditForm(card, type) {
    // when adding a new card
    let index = -1

    // when editing an existing card
    if (card) {
      if (type === 'white') {
        index = whiteCards.indexOf(card)
      }
      if (type === 'black') {
        index = blackCards.indexOf(card)
      }
    }
    setEditingCard({ card, type, index })
  }

  function handleCardEdit({ text, pick }) {
    if (editingCard.type === 'white') {
      const newCards = [...whiteCards]
      if (editingCard.index === -1) {
        newCards.push(text)
      } else {
        newCards[editingCard.index] = text
      }
      setWhiteCards(newCards)
    }
    if (editingCard.type === 'black') {
      const newCards = [...blackCards]
      if (editingCard.index === -1) {
        newCards.push({ text, pick })
      } else {
        newCards[editingCard.index] = { text, pick }
      }
      setBlackCards(newCards)
    }
    setEditingCard(null)
    saveDeck()
  }

  return (
    <Container maxw="container">
      <header className="flex items-center gap-4 mb-6">
        <div>
          <Button
            type="button"
            padding="p-2"
            className="rounded-full hover:shadow-md"
            backgroundColor="bg-white hover:bg-blue-50"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
        </div>
        <h3 className="flex-grow text-3xl font-medium">Editando mazo</h3>
      </header>
      <form onSubmit={handleSubmit} className="flex items-center gap-3 my-6">
        <div className="max-w-sm w-full">
          <Input id="name" type="text" value={title} onChange={ev => setTitle(ev.target.value)} required />
        </div>
        <PrimaryButton type="submit">Guardar</PrimaryButton>
      </form>
      <CardEditGroup
        type="white"
        cards={whiteCards}
        setCards={setWhiteCards}
        onEdit={card => openEditForm(card, 'white')}
      />
      <CardEditGroup
        type="black"
        cards={blackCards}
        setCards={setBlackCards}
        onEdit={card => openEditForm(card, 'black')}
      />
      <AnimatePresence>
        {editingCard && (
          <CardEditForm
            type={editingCard.type}
            card={editingCard.card}
            onEdit={handleCardEdit}
            onClose={() => setEditingCard(null)}
          />
        )}
      </AnimatePresence>
    </Container>
  )
}
