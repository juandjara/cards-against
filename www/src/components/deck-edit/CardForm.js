import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../Button'
import Input from '../Input'
import CloseIcon from '../icons/CloseIcon'
import CardStyles from './CardStyles'

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

export default function CardForm ({ 
  card, className,
  onSave, onCancel, onRemove,
  placeholder = 'Texto de la carta'
}) {
  const [text, setText] = useState(card.text)

  function handleSubmit (ev) {
    ev.preventDefault()
    ev.stopPropagation()
    onSave({ ...card, text })
  }

  return (
    <CardFormStyle className={className}>
      <CardStyles className={card.type}>
        <Input
          required
          as="textarea"
          name={`card-input-${card.id}`}
          value={text}
          onChange={ev => setText(ev.target.value)}
          placeholder={placeholder} />
      </CardStyles>
      <button type="button" className="close-btn" onClick={onCancel}>
        <CloseIcon />
      </button>
      <div className="actions">
        {card.id && (<Button type="button" className="delete-btn" onClick={onRemove}>
          <span>Eliminar</span>
        </Button>)}
        <Button className="save-btn" type="submit" disabled={!text} onClick={handleSubmit}>
          <span>Guardar</span>
        </Button>
      </div>
    </CardFormStyle>
  )
}