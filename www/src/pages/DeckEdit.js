import React, { useRef } from 'react'
import styled from 'styled-components'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";
import WhiteCardsIcon from '../components/icons/CardsOutlineIcon'
import BlackCardsIcon from '../components/icons/CardsIcon'
import useDecks from '../services/useCards'
import uuid from 'uuid/v4'
import { navigate } from '@reach/router'
import CardList from '../components/deck-edit/CardList'
import NewDeckForm from '../components/deck-edit/NewDeckForm'

const DeckEditStyles = styled.div`
  h2 {
    margin: 1rem 0;
  }
  > form {  
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

const CardTabsStyle = styled(Tabs)`
  margin-top: 2rem;
  [data-reach-tab-list] {
    background: transparent;
    border-bottom: 1px solid;
    border-color: #dee2e6;
    [data-reach-tab] {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding: 8px 16px;
      color: #007bff;
      display: flex;
      align-items: center;
      span {
        margin-left: 6px;
      }
      &:hover:not([data-selected]) {
        color: #0056b3;
      }
      &::-moz-focus-inner {
        outline: 0;
        border: none;
      }
    }
    [data-selected] {
      border: 1px solid #dee2e6;
      border-bottom-color: transparent;
      margin-bottom: -1px;
      background-color: white;
      color: inherit;
    }
  }
  [data-reach-tab-panel] {
    padding-top: 1rem;
  }
`

function CardTabs ({ cards, addCard, removeCard, editCard }) {
  const whiteCards = cards.filter(c => c.type === 'white')
  const blackCards = cards.filter(c => c.type === 'black')
  return (
    <CardTabsStyle>
      <TabList>
        <Tab>
          <BlackCardsIcon />
          <span>Preguntas</span>
        </Tab>
        <Tab>
          <WhiteCardsIcon />
          <span>Respuestas</span>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CardList type="black" cards={blackCards}
            addCard={addCard}
            editCard={editCard}
            removeCard={removeCard} />
        </TabPanel>
        <TabPanel>
          <CardList type="white" cards={whiteCards}
            addCard={addCard}
            editCard={editCard}
            removeCard={removeCard} />
        </TabPanel>
      </TabPanels>
    </CardTabsStyle>
  )
}

export default function DeckEdit ({ deckid }) {
  const editMode = deckid === 'new'
  const [decks, setDecks] = useDecks()
  const deck = decks[deckid] || {}
  const idRef = useRef(deck.id || uuid())
  const id = idRef.current

  function createNewDeck ({ name, description }) {
    setDecks({ ...decks, [id]: { id, name, description, cards: [] } })
    navigate(`/decks/${id}`)
  }
  function addCard (newCard) {
    setDecks({ ...decks, [id]: { ...deck, cards: deck.cards.concat(newCard) } })
  }
  function editCard (card) {
    setDecks({ ...decks, [id]: { ...deck, cards: deck.cards.map(c => c.id === card.id ? card : c) } })
  }
  function removeCard (cardid) {
    setDecks({ ...decks, [id]: { ...deck, cards: deck.cards.filter(c => c.id !== cardid) } })
  }
  
  return (
    <DeckEditStyles>
      {editMode ? (
        <NewDeckForm onSubmit={createNewDeck} />
      ) : (
        <div>
          <h2>{deck.name}</h2>
          <p>{deck.description}</p>
          <CardTabs cards={deck.cards}
            addCard={addCard}
            removeCard={removeCard}
            editCard={editCard} />
        </div>
      )}
    </DeckEditStyles>
  )
}
