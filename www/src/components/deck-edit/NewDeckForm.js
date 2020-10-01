import React, { useState } from 'react'
import InputStyles from '../Input'
import Button from '../Button'
import styled from 'styled-components'
import  {useTranslations} from "../Localise";

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
  const {getTranslation} = useTranslations()
  function handleSubmit (ev) {
    ev.preventDefault()
    onSubmit({ name, description })
  }

  return (
    <DeckFormStyles className="new-deck-form" onSubmit={handleSubmit}>
      <h2>  {getTranslation("views.deck_manager.title")}</h2>
      <label htmlFor="deckName">{getTranslation("views.deck_manager.name")}</label>
      <InputStyles
        required
        type="text"
        name="deckName"
        value={name}
        onChange={ev => setName(ev.target.value)}
        placeholder={getTranslation("views.deck_manager.name_placeholder", undefined)} />
      <label htmlFor="deckDescription">{getTranslation("views.deck_manager.description")}</label>
      <InputStyles
        as="textarea"
        name="deckDescription"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
        placeholder={getTranslation("views.deck_manager.description_placeholder", undefined)} />
      <Button>{getTranslation("buttons.save")}</Button>
      <Button className="cancel-btn"
        onClick={() => window.history.back()}
        type="button">{getTranslation("buttons.cancel")}</Button>
    </DeckFormStyles>
  )
}
