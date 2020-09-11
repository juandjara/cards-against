import React from 'react'
import styled from 'styled-components'
import CloseIcon from './icons/CloseIcon'
import Button from './Button'
import CardStyles from './deck-edit/CardStyles'

import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'

const WinningModalStyles = styled(Dialog)`
  position: relative;
  border-radius: 8px;
  min-width: max(51vw, 320px);

  h3 {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 24px;
    font-weight: 500;
    text-align: center;
  }

  .card-pair {
    display: flex;
    justify-content: center;
    align-items: center;

    div + div {
      margin-left: 8px;
    }
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
    border-radius: 8px;
    display: block;
    margin-left: auto;

    &:hover, &:focus {
      background-color: #f2f2f2;
    }
  }

  .confirm-btn {
    display: block;
    margin: 16px auto 0 auto;
  }
`

export default function WinningModal ({ blackCard, whiteCard, showConfirm = true, onClose, onConfirm }) {
  if (!blackCard || !whiteCard) {
    return null
  }
  return (
    <WinningModalStyles aria-label="Elegir carta ganadora" onDismiss={onClose} className="winning-modal">
      <Button className="close-btn" onClick={onClose}>
        <CloseIcon />
      </Button>
      <h3>¿Elegir esta combinaci&oacute;n como ganadora?</h3>
      <div className="card-pair">
        <CardStyles className="black">{blackCard.text}</CardStyles>
        <CardStyles className="white">{whiteCard.text}</CardStyles>
      </div>
      {showConfirm && <Button onClick={onConfirm} className="confirm-btn">Confirmar</Button>}
    </WinningModalStyles>
  )
}
