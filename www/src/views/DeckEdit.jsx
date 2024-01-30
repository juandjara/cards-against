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

function getDeck(id) {
  let decks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')
  const deck = decks.find(d => d.id === id)
  if (deck) {
    return deck
  }

  const name = deck ? deck.name : `Mazo ${decks.length + 1}`
  return {
    id: nanoid(),
    name,
    whiteCards: [],
    blackCards: [],
    disabledWhites: [],
    disabledBlacks: []
  }
}

export default function DeckEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [editingCard, setEditingCard] = useState(null)
  const alert = useAlert()

  const [deck, setDeck] = useState(() => getDeck(id))
  const { name, whiteCards, blackCards, disabledWhites, disabledBlacks } = deck

  // load deck from localStorage when id changes
  useEffect(() => {
    const deck = getDeck(id)
    // eslint-disable-next-line no-console
    console.log('Deck found in localStorage', deck)
    setDeck(deck)
  }, [id])

  function setDeckAndSave(deck) {
    setDeck(deck)
    saveDeck(deck)
  }

  const setName = name => setDeck({ ...deck, name })
  const setWhiteCards = cards => setDeckAndSave({ ...deck, whiteCards: cards })
  const setBlackCards = cards => setDeckAndSave({ ...deck, blackCards: cards })
  const setDisabledWhites = cards => setDeckAndSave({ ...deck, disabledWhites: cards })
  const setDisabledBlacks = cards => setDeckAndSave({ ...deck, disabledBlacks: cards })

  function handleSubmit(ev) {
    ev.preventDefault()
    saveDeck(deck)
  }

  function saveDeck(deck) {
    const decks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')
    const newDecks = id === 'new' ? decks.concat(deck) : decks.map(d => (d.id === id ? deck : d))

    localStorage.setItem(DECKS_KEY, JSON.stringify(newDecks))
    alert({ type: 'success', text: 'Mazo guardado correctamente' })
    if (id === 'new') {
      navigate(`/decks/${deck.id}`)
    }
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
            <ArrowLeftIcon aria-hidden="true" className="w-5 h-5" />Atrás
          </Button>
        </div>
        <h3 className="flex-grow text-3xl font-medium">Editando mazo</h3>
      </header>
      <form onSubmit={handleSubmit} className="flex items-center gap-3 my-6">
        <div className="max-w-sm w-full">
          <Input id="name" type="text" value={name} onChange={ev => setName(ev.target.value)} required />
        </div>
        <PrimaryButton type="submit">Guardar</PrimaryButton>
      </form>
      <CardEditGroup
        type="white"
        disabledCards={disabledWhites}
        setDisabledCards={setDisabledWhites}
        cards={whiteCards}
        setCards={setWhiteCards}
        onEdit={card => openEditForm(card, 'white')}
      />
      <CardEditGroup
        type="black"
        disabledCards={disabledBlacks}
        setDisabledCards={setDisabledBlacks}
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
