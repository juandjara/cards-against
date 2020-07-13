import React, { useRef } from 'react'
import styled from 'styled-components'
import uuid from 'uuid/v4'
import { navigate } from '@reach/router'

import useDecks from '../services/useCards'
import NewDeckForm from '../components/deck-edit/NewDeckForm'
import CardLists from '../components/deck-edit/CardLists'

import IconArrowLeft from '../components/icons/IconArrowLeft'

const DeckEditStyles = styled.div`
  margin-top: 2rem;
  position: relative;

  .title {
    margin: 0;
    margin-top: 1.5rem;
  }
  .description {
    margin: 0;
  }

  > header {
    padding-left: 48px;
  }

  .back-btn {
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    position: absolute;
    top: 12px;
    left: 0;
    color: #868686;

    svg {
      width: 36px;
      height: 36px;
    }
  }

  @media (max-width: 45rem) {
    .title {
      font-size: 18px;
    }
    .description {
      font-size: 14px;
    }
    .back-btn {
      top: 8px;
    }
  }

  .new-deck-form {  
    input {
      max-width: 280px;
      margin-bottom: 1.5rem;
    }
    textarea {
      margin-bottom: 1.5rem;
      font: inherit;
      padding-top: 4px;
      height: 132px;
      resize: none;
    }

    .cancel-btn {
      background: none;
      border: none;
      &:hover, &:focus {
        text-decoration: underline;
      }
    }
  }
`

export default function DeckEdit ({ deckid }) {
  const deckIsNew = deckid === 'new'
  const [decks, setDecks] = useDecks()
  const deck = decks[deckid] || {}
  const idRef = useRef(deck.id || uuid())
  const id = idRef.current

  function editDeck ({ name, description }) {
    setDecks({ ...decks, [id]: { id, name, description, cards: deck.cards || [] } })
    navigate(`/decks/${id}`)
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

  if (deckIsNew) {
    return (
      <DeckEditStyles>
        <NewDeckForm onSubmit={editDeck} />
      </DeckEditStyles>
    )
  }

  return (
    <DeckEditStyles>
      <button className="back-btn" onClick={() => window.history.back()}>
        <IconArrowLeft />
      </button>
      <header>
        <NewDeckForm deck={deck} onSubmit={editDeck} />
        {/* <h2 className="title">{deck.name}</h2>
        <p className="description">{deck.description}</p> */}
      </header>
      <CardLists
        cards={deck.cards.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))}
        addCard={addCard}
        removeCard={removeCard}
        editCard={editCard} />
    </DeckEditStyles>
  )
}
