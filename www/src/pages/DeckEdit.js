import React, { useState } from 'react'
import Input from '../components/Input'
import styled from 'styled-components'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";
import WhiteCardsIcon from '../components/icons/CardsOutlineIcon'
import BlackCardsIcon from '../components/icons/CardsIcon'
import AddIcon from '../components/icons/AddIcon'

const DeckEditStyles = styled.form`
  input {
    max-width: 280px;
    margin-bottom: 1.5rem;
  }
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

  textarea {
    margin-bottom: 1.5rem;
    font: inherit;
    padding-top: 4px;
    height: auto;
  }
`

const CardListStyles = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px;
  margin: 0;
  margin-left: -24px;
  li {
    padding: 8px 12px;
    width: 250px;
    height: 250px;
    border-radius: 8px;
    border: 3px solid #000;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    transition: transform 250ms ease-in-out 0ms;
    line-height: 1.8;
    margin-left: 24px;
    margin-bottom: 24px;
    font-weight: bold;
    ${props => props.black ? `
      background-color: #222;
      border-color: #fff;
      color: white;
    ` : ''}

    &:hover {
      transform: scale(1.05);
    }

    &.add-card {
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 96px;
        height: 96px;
      }
    }
  }
`

function CardList ({ black }) {
  const cards = ['Aqui hay una carta', 'Aqui hay otra']
  return (
    <CardListStyles black={black}>
      {cards.map(c => (<li key={c}>{c}</li>))}
      <li className="add-card">
        <AddIcon />
      </li>
    </CardListStyles>
  )
}

export default function DeckEdit ({ deckid }) {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  return (
    <DeckEditStyles>
      <h2>Crear mazo</h2>
      <Input 
        required
        type="text"
        name="deckName"
        value={name}
        onChange={ev => setName(ev.target.value)}
        placeholder="Nombre del mazo" />
      <Input 
        as="textarea"
        name="deckDescription"
        value={desc}
        rows={3}
        onChange={ev => setDesc(ev.target.value)}
        placeholder="Descripcion del mazo" />
      <Tabs>
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
            <CardList black />
          </TabPanel>
          <TabPanel>
            <CardList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </DeckEditStyles>
  )
}
