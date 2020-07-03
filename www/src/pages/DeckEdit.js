import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import WhiteCardsIcon from '../components/icons/CardsOutlineIcon'
import BlackCardsIcon from '../components/icons/CardsIcon'
import useDecks from '../services/useCards'
import uuid from 'uuid/v4'
import { navigate } from '@reach/router'
import NewDeckForm from '../components/deck-edit/NewDeckForm'
import CloseIcon from '../components/icons/CloseIcon'
import Input from '../components/Input'
import Button from '../components/Button'
import Portal from '@reach/portal'
import IconArrowLeft from '../components/icons/IconArrowLeft'

const CardListsStyle = styled.main`
  margin: 24px 0;

  section {
    padding: 12px 0;
  }

  header {
    color: #007bff;
    padding: 12px 4px;

    svg {
      vertical-align: bottom;
    }

    span {
      margin-left: 8px;
    }
  }

  ul {
    list-style: none;
    padding: 4px;
    margin: 0;

    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    overflow: auto;
  }
`

const PortalStyles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;

  .portal-content {
    border: solid 1px hsla(0, 0%, 0%, 0.25);
    border-radius: 8px;
    box-shadow: 0px 2px 10px hsla(0, 0%, 0%, 0.25);
    background: linear-gradient(to left, #fafafa 0%, #eaeaea 100%);
    width: calc(100vmin - 32px);
    max-width: 400px;
  }
`

function CardLists ({ cards, addCard, removeCard, editCard }) {
  const whiteCards = cards.filter(c => c.type === 'white')
  const blackCards = cards.filter(c => c.type === 'black')
  const [selectedCard, setSelectedCard] = useState(null)

  function handleSave (card) {
    if (card.id) {
      editCard(card)
    } else {
      addCard(card)
    }
    closePortal()
  }

  function closePortal () {
    setSelectedCard(null)
  }

  function handleRemove () {
    const confirmation = window.confirm('¿Seguro que quieres borrar esta carta?')
    if (!confirmation) {
      return
    }
    removeCard(selectedCard.id)
    closePortal()
  }

  function handlePortalClick (ev) {
    const el = document.querySelector('.portal-content')
    if (!el.contains(ev.target)) {
      closePortal()
    }
  }

  return (
    <CardListsStyle>
      {selectedCard && (
        <Portal>
          <PortalStyles onClick={handlePortalClick} className="portal-backdrop">
            <CardForm
              className="portal-content"
              card={selectedCard}
              onSave={handleSave}
              onRemove={handleRemove}
              onCancel={closePortal} />
          </PortalStyles>
        </Portal>
      )}
      <section>
        <header>
          <BlackCardsIcon />
          <span>Preguntas</span>
        </header>
        <Button onClick={() => setSelectedCard({ type: 'black', text: '' })}>Nueva carta</Button>
        <ul>
          {blackCards.map(card => (
            <CardStyles 
              key={card.id}
              className="black"
              onClick={() => setSelectedCard(card)}>
              <p>{card.text}</p>
            </CardStyles>
          ))}
        </ul>
      </section>
      <section>
        <header>
          <WhiteCardsIcon />
          <span>Respuestas</span>
        </header>
        <Button onClick={() => setSelectedCard({ type: 'white', text: '' })}>Nueva carta</Button>
        <ul>
          {whiteCards.map(card => (
            <CardStyles 
              key={card.id}
              className="white"
              onClick={() => setSelectedCard(card)}>
              <p>{card.text}</p>
            </CardStyles>
          ))}
        </ul>
      </section>
    </CardListsStyle>
  )
}

const CardStyles = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  margin-top: 16px;
  margin-bottom: 8px; 
  padding: 12px 16px;
  padding-bottom: 24px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 16px;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0, 0.25);
  transition: transform 0.25s ease;
  font-weight: bold;
  z-index: 1;
  transform-style: preserve-3d;

  &.white {
    border-color: #333;
    background-color: white;
    color: #333;
  }

  &.black {
    border-color: white;
    background-color: #333;
    color: white;
  }

  &:hover {
    transform: translateY(-12px);
  }

  & + li {
    margin-left: -12px;
  }

  p {
    margin: 0;
  }
`

const CardFormStyle = styled.form`
  padding: 16px 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;

  ${CardStyles} {
    padding: 0;
    margin: 0;
    &:hover {
      transform: none;
    }
  }

  textarea {
    font: inherit;
    margin: 0;
    padding: 12px 16px 24px 16px;
    height: 100%;
    resize: none;
    background-color: inherit;
    color: inherit;
    border-radius: inherit;
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    padding: 8px;
    height: 40px;
    cursor: pointer;
    border-radius: 0 8px 0 8px;

    &:hover, &:focus {
      background-color: #f2f2f2;
    }
  }

  .actions {
    margin-top: 12px;
  }

  .delete-btn {
    background: none;
    border: none;
    &:hover, &:focus {
      text-decoration: underline;
    }
  }
`

function CardForm ({ 
  card, className,
  onSave, onCancel, onRemove,
  placeholder = 'Texto de la carta'
}) {
  const [text, setText] = useState(card.text)

  function handleSubmit (ev) {
    ev.preventDefault()
    onSave({ ...card, text })
  }

  return (
    <CardFormStyle className={className}>
      <CardStyles as="div" className={card.type}>
        <Input
          required
          as="textarea"
          name={`card-input-${card.id}`}
          value={text}
          onChange={ev => setText(ev.target.value)}
          placeholder={placeholder} />
      </CardStyles>
      <button className="close-btn" type="button" onClick={onCancel}>
        <CloseIcon />
      </button>
      <div className="actions">
        {card.id && (<Button className="delete-btn"type="button" onClick={onRemove}>
          <span>Eliminar</span>
        </Button>)}
        <Button className="save-btn" type="submit" disabled={!text} onClick={handleSubmit}>
          <span>Guardar</span>
        </Button>
      </div>
    </CardFormStyle>
  )
}

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
  }
`

export default function DeckEdit ({ deckid }) {
  const deckIsNew = deckid === 'new'
  const [decks, setDecks] = useDecks()
  const deck = decks[deckid] || {}
  const idRef = useRef(deck.id || uuid())
  const id = idRef.current

  function createNewDeck ({ name, description }) {
    setDecks({ ...decks, [id]: { id, name, description, cards: [] } })
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
        <NewDeckForm onSubmit={createNewDeck} />
      </DeckEditStyles>
    )
  }

  return (
    <DeckEditStyles>
      <button className="back-btn" onClick={() => window.history.back()}>
        <IconArrowLeft />
      </button>
      <header>
        <h2 className="title">{deck.name}</h2>
        <p className="description">{deck.description}</p>
      </header>
      <CardLists
        cards={deck.cards.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))}
        addCard={addCard}
        removeCard={removeCard}
        editCard={editCard} />
    </DeckEditStyles>
  )
}
