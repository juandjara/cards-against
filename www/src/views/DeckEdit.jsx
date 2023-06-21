import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import Container from '@/components/Container'
import GameCard from '@/components/GameCard'
import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
import Modal from '@/components/Modal'
import { ArrowLeftIcon, PencilAltIcon, XIcon } from '@heroicons/react/solid'
import { Plus, Stack, Trash } from 'phosphor-react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { AnimatePresence, motion } from 'framer-motion'
import { useAlert } from '@/components/Alert'

function decodeHtml(html) {
  var el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

function handleStopClick(fn) {
  return ev => {
    ev.preventDefault()
    ev.stopPropagation()
    fn()
  }
}

function EditTools({ type, selection, onNew, onEdit, onDelete, onClear }) {
  if (selection.length === 0) {
    return (
      <Button
        type="button"
        onClick={handleStopClick(onNew)}
        className="flex items-center space-x-2 pl-2 pr-3 my-2"
        textColor={type === 'black' ? 'text-white' : 'text-black'}
        backgroundColor={type === 'black' ? 'bg-black hover:bg-gray-800' : 'bg-white hover:bg-gray-100'}
      >
        <Plus weight="bold" className="w-4 h-4" />
        <p>Nueva carta</p>
      </Button>
    )
  }

  return (
    <div className="flex space-x-2 items-center my-2" style={{ marginLeft: 0 }}>
      <button
        title="Eliminar selección"
        aria-label="Eliminar selección"
        className="p-1 rounded-xl hover:bg-white hover:bg-opacity-25"
        onClick={handleStopClick(onClear)}
      >
        <XIcon className="w-4 h-4" />
      </button>
      <p className="font-semibold">
        {selection.length} seleccionado{selection.length === 1 ? '' : 's'}
      </p>
      <Button
        type="button"
        onClick={handleStopClick(onEdit)}
        disabled={selection.length > 1}
        className="flex items-center space-x-2 pl-2 pr-3"
      >
        <PencilAltIcon weight="fill" className="w-4 h-4" />
        <p>Editar</p>
      </Button>
      <Button
        type="button"
        onClick={handleStopClick(onDelete)}
        color="red"
        className="flex items-center space-x-2 pl-2 pr-3"
      >
        <Trash weight="fill" className="w-4 h-4" />
        <p>Eliminar</p>
      </Button>
    </div>
  )
}

function CardGroup({ type, cards, setCards }) {
  const label = type === 'white' ? 'Blancas' : 'Negras'
  const [selection, setSelection] = useState([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [newCard, setNewCard] = useState({
    pick: 1,
    text: ''
  })

  function selectCard(card) {
    const newSelection = cardIsSelected(card) ? selection.filter(c => c !== card) : selection.concat(card)
    setSelection(newSelection)
  }

  function updateFormField(ev, key) {
    setNewCard(card => ({ ...card, [key]: ev.target.value }))
  }

  function openEditForm(card) {
    const selectedNewCard = type === 'white' ? { pick: 1, text: card } : card || { pick: 1, text: '' }
    setNewCard(selectedNewCard)
    setShowEditForm(true)
  }

  function deleteCards(cardsToDelete) {
    setCards(cards => cards.filter(c => cardsToDelete.indexOf(c) === -1))
    setSelection([])
  }

  function closeModal() {
    if (!newCard.text) {
      setShowEditForm(false)
      return
    }

    const selectedCard = selection[0]
    const selectionIndex = cards.indexOf(selectedCard)
    const newCardContent = type === 'white' ? newCard.text : newCard
    setCards(cards => {
      if (selectionIndex > -1) {
        const copy = cards.slice()
        copy[selectionIndex] = newCardContent
        return copy
      } else {
        return cards.concat(newCardContent)
      }
    })
    setShowEditForm(false)
    setSelection([])
  }

  function cardIsSelected(card) {
    return selection.indexOf(card) !== -1
  }

  return (
    <>
      <Modal show={showEditForm} onClose={closeModal} title="Editar carta">
        <div className="space-y-6 mt-6">
          {type === 'black' && (
            <Input
              id="new-card-pick"
              label="Nº cartas de respuesta"
              type="number"
              labelColor="text-gray-500"
              value={newCard.pick}
              onChange={ev => updateFormField(ev, 'pick')}
            />
          )}
          <div>
            <label className="text-gray-500 mb-1 block text-sm font-medium" htmlFor="new-card-text">
              Texto
            </label>
            <textarea
              id="new-card-text"
              rows="5"
              value={newCard.text}
              onChange={ev => updateFormField(ev, 'text')}
              className="shadow-sm block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
            />
          </div>
        </div>
      </Modal>
      <header className="flex flex-wrap items-center gap-2 pt-6 px-2">
        <Stack
          weight="fill"
          className={classNames('w-7 h-7', {
            'text-white': type === 'white',
            'text-black': type === 'black'
          })}
        />
        <span className="text-lg font-semibold flex-grow">
          {cards.length} {label}
        </span>
        <EditTools
          type={type}
          selection={selection}
          onNew={() => openEditForm(null)}
          onEdit={() => openEditForm(selection[0])}
          onDelete={() => deleteCards(selection)}
          onClear={() => setSelection([])}
        />
      </header>
      <div style={{ height: 222 }} className="overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <div className="flex items-start gap-3 p-1 my-1">
            <AnimatePresence>
              {cards.map(card => (
                <GameCard
                  key={type === 'white' ? card : card.text}
                  type={type}
                  text={decodeHtml(type === 'white' ? card : card.text)}
                  className={classNames('text-left flex-shrink-0 hover:bg-gray-50 focus:outline-none', {
                    'ring-4 ring-blue-500': cardIsSelected(card)
                  })}
                  as={motion.div}
                  badge={type === 'white' ? null : card.pick}
                  onClick={() => selectCard(card)}
                  initial={{ x: 200, opacity: 0, width: 0 }}
                  animate={{ x: 0, opacity: 1, width: '' }}
                  exit={{ x: -200, width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ touchAction: 'pan-x' }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

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
  }

  function deleteDeck() {
    if (!window.confirm('¿Estas seguro de que quieres borrar este mazo?')) {
      return
    }

    const decks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')
    const newDecks = decks.filter(d => d.id !== id)

    localStorage.setItem(DECKS_KEY, JSON.stringify(newDecks))
    alert({ type: 'success', text: 'Mazo eliminado correctamente' })
    navigate('/decks')
  }

  return (
    <Container maxw="container">
      <form className="py-6" onSubmit={handleSubmit}>
        <header className="flex items-center gap-3">
          <div>
            <Button
              padding="p-2"
              className="rounded-full hover:shadow-md"
              backgroundColor="bg-white hover:bg-blue-50"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          </div>
          <h3 className="flex-grow text-3xl font-medium">Editando</h3>
          <div className="max-w-xs">
            <Input id="name" type="text" value={title} onChange={ev => setTitle(ev.target.value)} required />
          </div>
        </header>
        <div className="flex justify-end gap-3 mt-3 mb-6">
          {id !== 'new' && (
            <Button color="red" onClick={deleteDeck}>
              Eliminar
            </Button>
          )}
          <PrimaryButton type="submit">Guardar</PrimaryButton>
        </div>
        <CardGroup type="white" cards={whiteCards} setCards={setWhiteCards} />
        <CardGroup type="black" cards={blackCards} setCards={setBlackCards} />
      </form>
    </Container>
  )
}
