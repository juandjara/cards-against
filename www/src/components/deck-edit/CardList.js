import React, { Fragment, useState } from 'react'
import uuid from 'uuid/v4'
import styled from 'styled-components'
import CardAddIcon from '../icons/CardAddIcon'
import Button from '../Button'
import CardForm from './CardForm'
import CloseIcon from '../icons/CloseIcon'
import EditIcon from '../icons/EditIcon'
import CardActionsStyle from './CardActionsStyle'

const CardListStyles = styled.ul`
  list-style: none;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 4px;
  margin: 0;
  margin-left: -24px;
  li {
    position: relative;
  }
  .card {
    width: 240px;
    height: 240px;
    border-radius: 4px;
    border: 2px solid #000;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
    transition: transform 250ms ease-in-out 0ms;
    margin-left: 16px;
    ${props => props.black ? `
      background-color: #222;
      border-color: #fff;
      color: white;
    ` : ''}

    p {
      margin: 0;
      padding: 12px 14px;
      font-size: 20px;
      line-height: 1.4;
      font-weight: bold;
      word-break: break-word;
      hyphens: auto;
    }
  }
  .add-card-btn {
    margin-top: 36px;
    margin-left: 16px;
    padding: 4px 12px;
    height: 40px;
    display: flex;
    align-items: center;
    > p {
      margin-left: 4px;
    }
  }
`

export default function CardList ({ type, cards, removeCard, addCard, editCard }) {
  const blackStyle = type === 'black'
  const [cardInEdit, setCardInEdit] = useState(null)

  function handleAdd (card) {
    addCard(card)
    setCardInEdit(null)
  }
  function handleEdit (card) {
    editCard(card)
    setCardInEdit(null)
  }
  function handleDelete (card) {
    const confirmation = window.confirm('¿Seguro que quieres borrar esta carta?')
    if (!confirmation) {
      return
    }
    removeCard(card.id)
  }

  return (
    <CardListStyles black={blackStyle}>
      {cards.map(card => (
        <li key={card.id}>
          {cardInEdit === card.id ? (
            <CardForm 
              initialValue={card.text}
              onSubmit={text => handleEdit({ ...card, text })}
              onCancel={() => setCardInEdit(null)} />
          ) : (
            <Fragment>
              <CardActionsStyle>
                <button title="Editar" onClick={() => setCardInEdit(card.id)}><EditIcon /></button>
                <button title="Borrar" onClick={() => handleDelete(card)}><CloseIcon /></button>
              </CardActionsStyle>
              <div className="card">
                <p>{card.text}</p>
              </div>
            </Fragment>
          )}  
        </li>
      ))}
      {cardInEdit === 'new' ? (
        <CardForm 
          onSubmit={text => handleAdd({ text, type, id: uuid() })}
          onCancel={() => setCardInEdit(null)} />
      ) : (
        <Button
          className="add-card-btn"
          onClick={() => setCardInEdit("new")} 
          aria-label="añadir carta">
          <CardAddIcon />
          <p>Añadir carta</p>
        </Button>
      )}
    </CardListStyles>
  )
}

