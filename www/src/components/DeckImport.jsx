import React from 'react'
import Button from './Button'
import { useAlert } from './Alert'
import { nanoid } from 'nanoid'

export default function DeckImport({ onImport }) {
  const showAlert = useAlert()

  function toggleImport() {
    document.getElementById('import-deck')?.click()
  }

  function importDeck(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function (e) {
      const { deck, error } = formatDeck(e.target.result)
      if (!error) {
        onImport(deck)
        showAlert({ type: 'success', text: 'Mazo importado correctamente' })
      } else {
        showAlert({ type: 'error', text: error })
      }
    }
    reader.readAsText(file)
  }

  function formatDeck(deckFileText) {
    let deck
    try {
      deck = JSON.parse(deckFileText)
      if (!deck) {
        return {
          error: 'El archivo esta vacio'
        }
      }
    } catch (e) {
      return {
        error: 'Error al leer el archivo'
      }
    }

    const whiteCards = deck.whiteCards || deck.white
    const blackCards = deck.blackCards || deck.black
    const name = deck.name || deck.title

    if (!name || !whiteCards || !blackCards) {
      // eslint-disable-next-line no-console
      console.log(deck)
      return {
        error: 'El archivo no tiene el formato correcto'
      }
    }

    const formatted = {
      id: nanoid(),
      name: deck.name,
      whiteCards: whiteCards.map(c => (typeof c === 'string' ? c : c.text)),
      blackCards: blackCards.map(c => ({ text: c.text, pick: c.pick }))
    }
    return { deck: formatted }
  }

  return (
    <>
      <Button color="blue" onClick={toggleImport}>
        Importar mazo
      </Button>
      <input type="file" id="import-deck" className="hidden" onChange={importDeck} />
    </>
  )
}
