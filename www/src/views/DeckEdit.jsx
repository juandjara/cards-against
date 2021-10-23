import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/Button'
import Container from '@/components/Container'
import GameCard from '@/components/GameCard'
import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
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

function EditTools({ selection, onNew, onEdit, onDelete }) {
  if (selection.length === 0) {
    return (
      <Button type="button" onClick={onNew} className="flex items-center space-x-2 pl-2 pr-3">
        <Plus weight="bold" className="w-4 h-4" />
        <p>Nueva carta</p>
      </Button>
    )
  }

  return (
    <>
      <p className="font-semibold">
        {selection.length} seleccionado{selection.length === 1 ? '' : 's'}
      </p>
      <Button type="button" onClick={onEdit} disabled={selection.length > 1} className="flex items-center space-x-2 pl-2 pr-3">
        <PencilAltIcon weight="fill" className="w-4 h-4" />
        <p>Editar</p>
      </Button>
      <Button type="button" onClick={onDelete} color="red" className="flex items-center space-x-2 pl-2 pr-3">
        <Trash weight="fill" className="w-4 h-4" />
        <p>Eliminar</p>
      </Button>
    </>
  )
}

export default function DeckEdit() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '' })
  const [whiteSelection, setWhiteSelection] = useState([])
  const [blackSelection, setBlackSelection] = useState([])

  function selectWhiteCard(card) {
    const isSelected = whiteSelection.indexOf(card) !== -1
    const newSelection = isSelected ? whiteSelection.filter(c => c !== card) : whiteSelection.concat(card)
    setWhiteSelection(newSelection)
  }

  function selectBlackCard(card) {
    const isSelected = blackSelection.indexOf(card) !== -1
    const newSelection = isSelected ? blackSelection.filter(c => c !== card) : blackSelection.concat(card)
    setBlackSelection(newSelection)
  }

  function getCardClass(card, selection) {
    const animation = 'hover:shadow-lg hover:scale-105 transform-gpu transition'
    const selected = selection.indexOf(card) !== -1
    const extra = selected ? 'ring-4 ring-blue-500' : ''

    return `${animation} ${extra}`
  }

  function openEditForm(card, selection) {
    // TODO
  }

  function deleteCards(cards) {
    // TODO
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
      <form className="space-y-10 py-6">
        <div className="max-w-xs">
          <Input id="name" label="Título" />
        </div>
        <div className="space-y-8">
          <p className="text-xl border-b border-white">Cartas</p>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  as="header"
                  className="sticky w-full top-0 z-10 bg-gray-500 p-2 rounded-lg flex items-center space-x-3 mb-2"
                >
                  <ChevronRightIcon className={classNames('w-6 h-6', { 'transform rotate-90': open })} />
                  <Stack weight="fill" className="text-white w-8 h-8" />
                  <span className="text-lg font-semibold">
                    Blancas - <small className="text-sm font-bold">{deck.whiteCards.length}</small>
                  </span>
                  <div className="flex-grow"></div>
                  <EditTools
                    selection={whiteSelection}
                    onNew={() => openEditForm(null, whiteSelection)}
                    onEdit={card => openEditForm(card, whiteSelection)}
                    onDelete={cards => deleteCards(cards, whiteSelection)}
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  <ul className="my-6 grid gap-5 grid-cols-fill-52 place-content-center">
                    {deck.whiteCards.map((card, i) => (
                      <li key={i} onClick={() => selectWhiteCard(card)}>
                        <GameCard className={getCardClass(card, whiteSelection)} type="white" text={decodeHtml(card)} />
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  as="header"
                  className="sticky w-full top-0 z-10 bg-gray-500 p-2 rounded-lg flex items-center space-x-3 mb-2"
                >
                  <ChevronRightIcon className={classNames('w-6 h-6', { 'transform rotate-90': open })} />
                  <Stack weight="fill" className="text-gray-900 w-8 h-8" />
                  <span className="text-lg font-semibold">
                    Negras - <span className="text-sm font-bold">{deck.blackCards.length}</span>
                  </span>
                  <div className="flex-grow"></div>
                  <EditTools
                    selection={blackSelection}
                    onNew={() => openEditForm(null, blackSelection)}
                    onEdit={card => openEditForm(card, blackSelection)}
                    onDelete={cards => deleteCards(cards, blackSelection)}
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  <ul className="my-6 grid gap-5 grid-cols-fill-52 place-content-center">
                    {deck.blackCards.map((card, i) => (
                      <li key={i} onClick={() => selectBlackCard(card)}>
                        <GameCard
                          type="black"
                          className={getCardClass(card, blackSelection)}
                          text={decodeHtml(card.text)}
                          badge={card.pick}
                        />
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="border-b border-white my-8" />
        <PrimaryButton>Guardar</PrimaryButton>
      </form>
    </Container>
  )
}
