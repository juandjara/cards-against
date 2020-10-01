import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Button from '../Button'
import Input from '../Input'
import IconClose from '../icons/IconClose'
import WhiteIconCards from '../icons/IconWhiteCards'
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
    border: none;

    &:focus {
      box-shadow: 0 0 0 3px rgba(19,133,229,0.3);
    }
  }

  .top-right {
    position: absolute;
    top: 0;
    right: 0;

    .close-btn {
      background: none;
      border: none;
      padding: 8px;
      height: 40px;
      cursor: pointer;
      border-radius: 0 8px 0 8px;
      display: block;
      margin-left: auto;
  
      &:hover, &:focus {
        background-color: #f2f2f2;
      }
    }
  
    .n-of-answers {
      padding: 12px 16px;
      font-size: 12px;
      color: var(--colorMidHigh);

      .value {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      input {
        max-width: 64px;
        margin-right: 8px;
        margin-bottom: 4px;
      }

      svg {
        margin-left: 4px;
      }
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
  const [answers, setAnswers] = useState(card.answers || 1)
  const inputRef = useRef()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  function handleSubmit (ev) {
    ev.preventDefault()
    ev.stopPropagation()
    onSave({ ...card, text, answers })
  }

  return (
    <CardFormStyle className={className}>
      <CardStyles className={card.type}>
        <Input
          required
          ref={inputRef}
          as="textarea"
          name={`card-input-${card.id}`}
          value={text}
          onChange={ev => setText(ev.target.value)}
          placeholder={placeholder} />
      </CardStyles>
      <div className="top-right">
        <button type="button" className="close-btn" onClick={onCancel}>
          <IconClose />
        </button>
        {card.type === 'black' && (<div className="n-of-answers">
          <div className="value">
            <Input type="number" min="1" value={answers} onChange={ev => setAnswers(ev.target.value)} />
            <WhiteIconCards />
          </div>
          <p>Nº de respuestas</p>
        </div>)}
      </div>
      <div className="actions">
        <Button className="save-btn" type="submit" disabled={!text} onClick={handleSubmit}>
          <span>Guardar</span>
        </Button>
        {card.id && (<Button type="button" className="delete-btn" onClick={onRemove}>
          <span>Eliminar</span>
        </Button>)}
      </div>
    </CardFormStyle>
  )
}