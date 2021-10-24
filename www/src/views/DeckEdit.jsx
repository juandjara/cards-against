import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/Button'
import Container from '@/components/Container'
import GameCard from '@/components/GameCard'
import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
import Modal from '@/components/Modal'
import { ArrowLeftIcon, ChevronRightIcon, PencilAltIcon } from '@heroicons/react/solid'
import { Plus, Stack, Trash } from 'phosphor-react'
import deck from '@/assets/CAH-es-set.json'
import { Disclosure } from '@headlessui/react'
import classNames from 'classnames'

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

function EditTools({ selection, onNew, onEdit, onDelete }) {
  if (selection.length === 0) {
    return (
      <Button type="button" onClick={handleStopClick(onNew)} className="flex items-center space-x-2 pl-2 pr-3 my-2">
        <Plus weight="bold" className="w-4 h-4" />
        <p>Nueva carta</p>
      </Button>
    )
  }

  return (
    <div className="flex space-x-2 items-center my-2">
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

function CardGroup({ type, deck }) {
  const cards = type === 'white' ? deck.whiteCards : deck.blackCards
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
    // TODO
    setShowEditForm(true)
  }

  function deleteCards(cards) {
    // TODO
  }

  function closeModal() {
    setShowEditForm(false)
  }

  return (
    <>
      <Modal show={showEditForm} onClose={closeModal} title="Editar carta">
        <div>
          <Input
            id="new-card-pick"
            label="Pick"
            type="number"
            value={newCard.pick}
            onChange={ev => update(ev, 'pick')}
          />
          <Input
            id="new-card-text"
            label="Texto"
            type="text"
            value={newCard.text}
            onChange={ev => update(ev, 'text')}
          />
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
                onEdit={card => openEditForm(card)}
                onDelete={cards => deleteCards(cards)}
              />
            </Disclosure.Button>
            <Disclosure.Panel>
              <ul className="my-6 grid gap-5 grid-cols-fill-52 place-content-center">
                {cards.map((card, i) => (
                  <li key={i} onClick={() => selectCard(card)}>
                    <GameCard
                      className={getCardClass(card)}
                      type="white"
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

export default function DeckEdit() {
  const navigate = useNavigate()

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
      <form className="space-y-10 py-6">
        <div className="max-w-xs">
          <Input id="name" label="Título" />
        </div>
        <div className="space-y-8">
          <p className="text-xl border-b border-white">Cartas</p>
          <CardGroup type="white" deck={deck} />
          <CardGroup type="black" deck={deck} />
        </div>
        <div className="border-b border-white my-8" />
        <PrimaryButton>Guardar</PrimaryButton>
      </form>
    </Container>
  )
}
