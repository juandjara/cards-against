import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import Container from '@/components/Container'
import GameCard from '@/components/GameCard'
import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
import Modal from '@/components/Modal'
import { ArrowLeftIcon, ChevronRightIcon, PencilAltIcon, XIcon } from '@heroicons/react/solid'
import { Plus, Stack, Trash } from 'phosphor-react'
import { Disclosure } from '@headlessui/react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'

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

function EditTools({ selection, onNew, onEdit, onDelete, onClear }) {
  if (selection.length === 0) {
    return (
      <Button type="button" onClick={handleStopClick(onNew)} className="flex items-center space-x-2 pl-2 pr-3 my-2">
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
    const isSelected = selection.indexOf(card) !== -1
    const newSelection = isSelected ? selection.filter(c => c !== card) : selection.concat(card)
    setSelection(newSelection)
  }

  function getCardClass(card) {
    const animation = 'hover:shadow-lg hover:scale-105 transform-gpu transition'
    const selected = selection.indexOf(card) !== -1
    const extra = selected ? 'ring-4 ring-blue-500' : ''

    return `${animation} ${extra}`
  }

  function update(ev, key) {
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
              onChange={ev => update(ev, 'pick')}
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
              onChange={ev => update(ev, 'text')}
              className="shadow-sm block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
            />
          </div>
        </div>
      </Modal>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              as="header"
              className="cursor-pointer flex flex-wrap items-center w-full sticky top-0 z-10 space-x-3 mb-2 py-2 px-3 bg-gray-500 rounded-lg"
            >
              <ChevronRightIcon className={classNames('w-6 h-6', { 'transform rotate-90': open })} />
              <Stack
                weight="fill"
                className={classNames('w-8 h-8', type === 'white' ? 'text-white' : 'text-gray-900')}
              />
              <span className="text-lg font-semibold">
                {label} - <small className="text-sm font-bold">{cards.length}</small>
              </span>
              <div className="flex-grow"></div>
              <EditTools
                selection={selection}
                onNew={() => openEditForm(null)}
                onEdit={() => openEditForm(selection[0])}
                onDelete={() => deleteCards(selection)}
                onClear={() => setSelection([])}
              />
            </Disclosure.Button>
            <Disclosure.Panel>
              <ul className="my-6 grid gap-5 grid-cols-fill-52 place-content-center">
                {cards.map((card, i) => (
                  <li key={i} onClick={() => selectCard(card)}>
                    <GameCard
                      className={getCardClass(card)}
                      type={type}
                      badge={type === 'white' ? null : card.pick}
                      text={decodeHtml(type === 'white' ? card : card.text)}
                    />
                  </li>
                ))}
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  )
}

export const DECKS_KEY = 'CCW_DECKS'

export default function DeckEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [whiteCards, setWhiteCards] = useState([])
  const [blackCards, setBlackCards] = useState([])

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
    navigate('/decks')
  }

  function deleteDeck() {
    if (!window.confirm('¿Estas seguro de que quieres borrar este mazo?')) {
      return
    }

    const decks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')
    const newDecks = decks.filter(d => d.id !== id)

    localStorage.setItem(DECKS_KEY, JSON.stringify(newDecks))
    navigate('/decks')
  }

  return (
    <Container maxw="container">
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
      <h3 className="mb-3 text-3xl font-medium">Editor de mazos</h3>
      <form className="space-y-10 py-6" onSubmit={handleSubmit}>
        <div className="max-w-xs">
          <Input
            id="name"
            type="text"
            label="Título"
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            required
          />
        </div>
        <div className="space-y-8">
          <p className="text-xl border-b border-white pb-1 pl-1">Cartas</p>
          <CardGroup type="white" cards={whiteCards} setCards={setWhiteCards} />
          <CardGroup type="black" cards={blackCards} setCards={setBlackCards} />
        </div>
        <div className="border-b border-white my-8" />
        <div className="flex justify-between">
          <PrimaryButton type="submit">Guardar</PrimaryButton>
          {id !== 'new' && (
            <Button color="red" className="ml-4" onClick={deleteDeck}>
              Eliminar
            </Button>
          )}
        </div>
      </form>
    </Container>
  )
}
