import React, { useState } from 'react'
import Input from '../components/Input'
import styled from 'styled-components'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";
import WhiteCardsIcon from '../components/icons/CardsOutlineIcon'
import BlackCardsIcon from '../components/icons/CardsIcon'

const DeckEditStyles = styled.form`
  input {
    max-width: 280px;
    margin: 1.5rem 0;
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
`

export default function DeckEdit ({ deckid }) {
  const [name, setName] = useState("")
  return (
    <DeckEditStyles>
      <Input 
        required
        type="text"
        name="deckName"
        value={name}
        onChange={ev => setName(ev.target.value)}
        placeholder="Nombre del mazo" />
      <Tabs>
        <TabList>
          <Tab>
            <WhiteCardsIcon />
            <span>Cartas blancas</span>
          </Tab>
          <Tab>
            <BlackCardsIcon />
            <span>Cartas negras</span>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>Lista de cartas blancas</p>
          </TabPanel>
          <TabPanel>
            <p>Lista de cartas negras</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </DeckEditStyles>
  )
}
