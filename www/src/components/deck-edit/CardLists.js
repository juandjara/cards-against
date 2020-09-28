import React, { useState } from 'react'
import styled from 'styled-components'
import Portal from '@reach/portal'
import WhiteIconCards from '../icons/IconWhiteCards'
import BlackIconCards from '../icons/IconBlackCards'
import Button from '../Button'
import CardForm from './CardForm'
import CardStyles from './CardStyles'
import classnames from 'classnames'
import Localise, {parseTranslation} from "../Localise";
import useGlobalSlice from "../../services/useGlobalSlice";

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

  &.readonly {
    header {
      padding-bottom: 0;
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

    .card {
      position: relative;
      margin-top: 16px;
      margin-bottom: 8px;

      & + .card {
        margin-left: -12px;
      }

      .answers {
        position: absolute;
        bottom: 12px;
        right: 12px;
        width: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 12px;
        font-size: 14px;
        color: var(--colorTop);
        background: white;
      }
    }
  }
`

export default function CardLists ({
  cards = [],
  addCard = () => {},
  editCard = () => {},
  removeCard = () => {},
  editable = true
}) {
  const whiteCards = cards.filter(c => c.type === 'white')
  const blackCards = cards.filter(c => c.type === 'black')
  const [selectedCard, setSelectedCard] = useState(null)
  const [translations] = useGlobalSlice('translations')

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
    const confirmation = window.confirm(parseTranslation("views.card_form.delete_confirm", undefined, translations))
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
    <CardListsStyle className={classnames('card-lists', { readonly: !editable })}>
      {editable && selectedCard && (
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
          <BlackIconCards />
          <span><Localise node="general.n_questions" variables={{N: blackCards.length}} /></span>
        </header>
        {editable && (<Button type="button" onClick={() => setSelectedCard({ type: 'black', text: '' })}><Localise node="buttons.new_card" /></Button>)}
        <ul>
          {blackCards.map(card => (
            <CardStyles
              key={card.id}
              as="li"
              className="card black selectable"
              onClick={() => setSelectedCard(card)}>
              <span>{card.text}</span>
              {card.answers > 1 && (<div className="answers">{card.answers}</div>)}
            </CardStyles>
          ))}
        </ul>
      </section>
      <section>
        <header>
          <WhiteIconCards />
          <span><Localise node="general.n_answers" variables={{N: whiteCards.length}} /></span>
        </header>
        {editable && (<Button type="button" onClick={() => setSelectedCard({ type: 'white', text: '' })}><Localise node="buttons.new_card" /></Button>)}
        <ul>
          {whiteCards.map(card => (
            <CardStyles
              key={card.id}
              as="li"
              className="card white selectable"
              onClick={() => setSelectedCard(card)}>
              {card.text}
            </CardStyles>
          ))}
        </ul>
      </section>
    </CardListsStyle>
  )
}
