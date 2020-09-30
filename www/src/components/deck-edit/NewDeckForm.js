import React, { useState } from 'react'
import InputStyles from '../Input'
import Button from '../Button'
import styled from 'styled-components'
import Localise, {parseTranslation} from "../Localise";
import useGlobalSlice from "../../services/useGlobalSlice";

const DeckFormStyles = styled.form`
  label {
    font-size: 12px;
    color: var(--colorMidHigh);
    display: block;
    margin-bottom: 4px;
  }

  input {
    margin-bottom: 1.5rem;
  }

  textarea {
    margin-bottom: 1.5rem;
    font: inherit;
    padding-top: 4px;
    height: 80px;
    resize: none;
  }

  input, textarea {
    max-width: 320px;
  }

  .cancel-btn {
    background: none;
    border: none;
    &:hover, &:focus {
      text-decoration: underline;
    }
  }
`

export default function NewDeckForm ({ deck = {}, onSubmit }) {
  const [name, setName] = useState(deck.name || '')
  const [description, setDescription] = useState(deck.description || '')
  const [translations] = useGlobalSlice('translations')
  function handleSubmit (ev) {
    ev.preventDefault()
    onSubmit({ name, description })
  }

  return (
    <DeckFormStyles className="new-deck-form" onSubmit={handleSubmit}>
      <h2><Localise node="views.deck_manager.title" /></h2>
      <label htmlFor="deckName"><Localise node="views.deck_manager.name" /></label>
      <InputStyles
        required
        type="text"
        name="deckName"
        value={name}
        onChange={ev => setName(ev.target.value)}
        placeholder={parseTranslation("views.deck_manager.name_placeholder", undefined, translations)} />
      <label htmlFor="deckDescription"><Localise node="views.deck_manager.description" /></label>
      <InputStyles
        as="textarea"
        name="deckDescription"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
        placeholder={parseTranslation("views.deck_manager.description_placeholder", undefined, translations)} />
      <Button><Localise node="buttons.save" /></Button>
      <Button className="cancel-btn"
        onClick={() => window.history.back()}
        type="button"><Localise node="buttons.cancel" /></Button>
    </DeckFormStyles>
  )
}
