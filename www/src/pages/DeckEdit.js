import React, { useRef } from 'react'
import styled from 'styled-components'
import uuid from 'uuid/v4'
import { navigate } from '@reach/router'

import useDecks from '../services/useDecks'
import NewDeckForm from '../components/deck-edit/NewDeckForm'
import CardLists from '../components/deck-edit/CardLists'

const DeckEditStyles = styled.div`
  margin-top: 2rem;
`

export default function DeckEdit ({ deckid }) {
  const deckIsNew = deckid === 'new'
  const [decks, setDecks] = useDecks()
  const deck = decks[deckid] || {}
  const idRef = useRef(deck.id || uuid())
  const id = idRef.current

  function editDeck ({ name, description, redirect = true }) {
    setDecks({ ...decks, [id]: { id, name, description, cards: deck.cards || [] } })
    if(redirect) navigate(`/decks/${id}`)
  }
  function addCard (newCard) {
    newCard = { ...newCard, id: uuid(), created_at: Date.now() }
    setDecks({ ...decks, [id]: { ...deck, cards: deck.cards.concat(newCard) } })
  }
  function editCard (card) {
    setDecks({ ...decks, [id]: { ...deck, cards: deck.cards.map(c => c.id === card.id ? card : c) } })
  }
  function removeCard (cardid) {
    setDecks({ ...decks, [id]: { ...deck, cards: deck.cards.filter(c => c.id !== cardid) } })
  }

  return (
    <DeckEditStyles className="deck-edit">
      <NewDeckForm deck={deck} onSubmit={editDeck} />
      {!deckIsNew && (
        <CardLists
          cards={deck.cards.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))}
          addCard={addCard}
          removeCard={removeCard}
          editCard={editCard} />
      )}
    </DeckEditStyles>
  )
}
