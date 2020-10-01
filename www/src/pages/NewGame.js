import React, {useState} from 'react'
import styled from 'styled-components'
import RadioGroup from '../components/RadioGroup'
import CardLists from '../components/deck-edit/CardLists'
import Select from 'react-select'
import {Link} from '@reach/router'
import useDecks from '../services/useDecks'
import Button from '../components/Button'
import useGlobalSlice from '../services/useGlobalSlice'
import config from '../config'

import IconAdd from '../components/icons/IconAdd'
import IconViewVisible from '../components/icons/IconViewVisible'
import IconViewHidden from '../components/icons/IconViewHidden'
import {useTranslations} from "../components/Localise";

const NewGameStyles = styled.form`
  max-width: 960px;
  margin: 0 auto;
  margin-bottom: 3rem;
  padding: 1em 0;

  h2 {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .input-block {
    margin-bottom: 32px;
    > label {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
      display: block;
      color: var(--colorMedium);
    }
    select {
      display: block;
    }
  }

  .radio-group {
    display: block;
    min-width: 260px;
  }

  .select-container {
    max-width: 260px;
  }

  .select-actions {
    display: flex;
    align-items: center;
    margin-top: 8px;
    .action {
      display: flex;
      align-items: center;
      text-align: left;
      padding: 0;
      border: 0;
      background: none;
      color: var(--colorPrimary);
      margin-right: 16px;
      font-size: 12px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      svg {
        margin-right: 2px;
        width: 20px;
        height: 20px;
      }
    }
  }

  .card-lists {
    max-width: calc(100vw - 24px);
  }

  .cancel-btn {
    background: none;
    border: none;
    &:hover, &:focus {
      text-decoration: underline;
    }
  }
`

function decodeCardText(text) {
  const el = document.createElement('textarea')
  el.innerHTML = text
  return el.value
}

function processStaticDeck(deck) {
  return {
    id: deck.id,
    name: deck.name,
    description: deck.description,
    cards: [
      ...deck.blackCards.map((c, i) => ({answers: c.pick, text: decodeCardText(c.text), id: String(i), type: 'black'})),
      ...deck.whiteCards.map((c, i) => ({text: decodeCardText(c), id: String(i), type: 'white'}))
    ]
  }
}

const jsonContext = require.context('../assets/decks/', false, /\.json$/)
const staticDecks = jsonContext.keys().map(key => {
  const json = jsonContext(key)
  return processStaticDeck(json)
})

function mapDeckOpt(deck) {
  return {
    ...deck,
    label: deck.name,
    value: deck.id
  }
}

export default function NewGame({navigate}) {
  const [socket] = useGlobalSlice('socket')
  const [rotation, setRotation] = useState('winner')
  const [deck, setDeck] = useState()
  const [deckVisible, setDeckVisible] = useState(false)
  const [decksTree] = useDecks()
  const {getTranslation} = useTranslations()
  const decks = Object.values(decksTree)

  const rotationOptions = config.rotationOptions.map(item => ({...item, label: getTranslation(item.label)}));
  const deckOptions = [
    {label: getTranslation("decks.groups.original"), options: staticDecks.map(mapDeckOpt)},
    {label: getTranslation("decks.groups.custom"), options: decks.map(mapDeckOpt)}
  ]

  const formIsValid = deck && rotation

  function handleSubmit(ev) {
    ev.preventDefault()
    socket.emit('game:new')
    socket.once('game:new', game => {
      socket.emit('game:edit', {...game, rotation, deck})
      navigate(`/wait/${game.id}`)
    })
  }

  // TODO: add radio-groups and number inputs to customize the
  // num of max cards per player hand and the gameover condition

  return (
    <NewGameStyles onSubmit={handleSubmit} className="new-game">
      <h2>{getTranslation("views.new_game.title")}</h2>
      <div className="input-block">
        <label>{getTranslation("views.new_game.choose_judge")}</label>
        <RadioGroup
          required
          name="rotation"
          value={rotation}
          onChange={setRotation}
          options={rotationOptions}
        />
      </div>
      <div className="input-block">
        <label id="deck-select-label">{getTranslation("views.new_game.choose_deck")}</label>
        <Select
          required
          value={deck}
          onChange={setDeck}
          placeholder={getTranslation("buttons.select")}
          className="select-container"
          options={deckOptions}/>
        <footer className="select-actions">
          <Link to="/decks/new" className="action">
            <IconAdd/>
            <span>{getTranslation("buttons.new_deck")}</span>
          </Link>
          {deck && (
            <button type="button" className="action" onClick={() => setDeckVisible(!deckVisible)}>
              {deckVisible ? <IconViewHidden/> : <IconViewVisible/>}
              <span>{getTranslation(deckVisible ? 'buttons.hide_cards' : 'buttons.show_cards')}</span>
            </button>
          )}
        </footer>
      </div>
      {deckVisible && (<div className="input-block">
        <CardLists
          cards={deck.cards.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))}
          editable={false}/>
      </div>)}
      <div className="actions">
        <Button disabled={!formIsValid} type="submit">{getTranslation("buttons.new_game")}</Button>
        <Button className="cancel-btn"
                onClick={() => window.history.back()}
                type="button">{getTranslation("buttons.cancel")}</Button>
      </div>
    </NewGameStyles>
  )
}
