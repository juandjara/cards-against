import React from 'react'
import styled from 'styled-components'
import IconClose from './icons/IconClose'
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
    text-align: center;
  }

  .card-pair {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .card {
      margin: 8px;
    }
  }

  .close-btn {
    position: absolute;
    top: 4px;
    right: 4px;
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

export default function WinningModal ({ blackCard, whiteCard, playerIsReader = true, onClose, onConfirm }) {
  if (!blackCard || !whiteCard) {
    return null
  }
  return (
    <WinningModalStyles aria-label="Elegir carta ganadora" onDismiss={onClose} className="winning-modal">
      <Button className="close-btn" onClick={onClose}>
        <IconClose />
      </Button>
      <h3>{playerIsReader ? '¿Elegir esta combinación como ganadora?' : 'Y la victoria es para...'}</h3>
      <div className="card-pair">
        <CardStyles className="card black">{blackCard.text}</CardStyles>
        <CardStyles className="card white">{whiteCard.text}</CardStyles>
      </div>
      {playerIsReader && <Button onClick={onConfirm} className="confirm-btn">Confirmar</Button>}
    </WinningModalStyles>
  )
}
