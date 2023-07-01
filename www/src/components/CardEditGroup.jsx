import cx from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { Stack } from 'phosphor-react'
import React, { useState } from 'react'
import GameCard from './GameCard'
import EditTools from './CardEditTools'

function decodeHtml(html) {
  var el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

export default function CardEditGroup({ type, disabledCards = [], setDisabledCards, cards = [], setCards, onEdit }) {
  const label = type === 'white' ? 'Blancas' : 'Negras'
  const [selection, setSelection] = useState([])

  function selectCard(card) {
    const newSelection = cardIsSelected(card) ? selection.filter(c => c !== card) : selection.concat(card)
    setSelection(newSelection)
  }

  function deleteCards(cardsToDelete) {
    setCards(cards => cards.filter(c => cardsToDelete.indexOf(c) === -1))
    setSelection([])
  }

  function cardIsSelected(card) {
    return selection.indexOf(card) !== -1
  }

  function handleEdit(card) {
    onEdit(card)
    setSelection([])
  }

  function handleDisable() {
    const selectionIndexes = selection.map(c => cards.indexOf(c))
    const oldDisabled = disabledCards.filter(c => selectionIndexes.indexOf(c) === -1)
    const newDisabled = selectionIndexes.filter(c => disabledCards.indexOf(c) === -1)
    const indexes = [...oldDisabled, ...newDisabled]
    setDisabledCards(indexes)
    setSelection([])
  }

  return (
    <>
      <header className="flex flex-wrap items-center gap-2 pt-6 md:px-2">
        <Stack
          weight="fill"
          className={cx('w-7 h-7', {
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
          onNew={() => handleEdit(null)}
          onEdit={() => handleEdit(selection[0])}
          onDelete={() => deleteCards(selection)}
          onClear={() => setSelection([])}
          onDisable={handleDisable}
        />
      </header>
      <div style={{ height: cards.length ? 222 : undefined }} className="overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <div className="flex items-start gap-3 p-1 my-1">
            <AnimatePresence>
              {cards.map((card, index) => (
                <GameCard
                  key={type === 'white' ? card : card.text}
                  type={type}
                  text={decodeHtml(type === 'white' ? card : card.text)}
                  className={cx('text-left flex-shrink-0 hover:bg-gray-50 focus:outline-none', {
                    'ring-4 ring-blue-500': cardIsSelected(card)
                  })}
                  as={motion.div}
                  badge={type === 'white' ? null : card.pick}
                  onClick={() => selectCard(card)}
                  initial={{ x: 200, opacity: 0, width: 0 }}
                  animate={{ x: 0, opacity: disabledCards.includes(index) ? 0.5 : 1, width: '' }}
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
