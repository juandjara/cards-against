import React, { useState } from 'react'
import styled from 'styled-components'
import Portal from '@reach/portal'
import WhiteCardsIcon from '../icons/CardsOutlineIcon'
import BlackCardsIcon from '../icons/CardsIcon'
import Button from '../Button'
import CardForm from './CardForm'
import CardStyles from './CardStyles'

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
    box-shadow: 0px 15px 35px hsla(0, 0%, 0%, 0.25);
    background: linear-gradient(to left, #fafafa 0%, #eaeaea 100%);
    width: calc(100vmin - 32px);
    max-width: 400px;
  }
`

const CardListsStyle = styled.main`
  margin: 24px 0;
  max-width: calc(100vw - 24px);

  section {
    padding: 12px 0;
  }

  header {
    color: var(--colorPrimary);
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

    li + li {
      margin-left: -12px;
    }
  }
`

export default function CardLists ({
  cards = [],
  addCard = () => {},
  editCard = () => {},
  removeCard = () => {}
}) {
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
    <CardListsStyle className="card-lists">
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
          <span>{blackCards.length} Preguntas</span>
        </header>
        <Button type="button" onClick={() => setSelectedCard({ type: 'black', text: '' })}>Nueva carta</Button>
        <ul>
          {blackCards.map(card => (
            <CardStyles
              key={card.id}
              as="li"
              className="black translate-y"
              onClick={() => setSelectedCard(card)}>
              {card.text}
            </CardStyles>
          ))}
        </ul>
      </section>
      <section>
        <header>
          <WhiteCardsIcon />
          <span>{whiteCards.length} Respuestas</span>
        </header>
        <Button type="button" onClick={() => setSelectedCard({ type: 'white', text: '' })}>Nueva carta</Button>
        <ul>
          {whiteCards.map(card => (
            <CardStyles 
              key={card.id}
              as="li"
              className="white translate-y"
              onClick={() => setSelectedCard(card)}>
              {card.text}
            </CardStyles>
          ))}
        </ul>
      </section>
    </CardListsStyle>
  )
}