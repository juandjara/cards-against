import React, { useState, useRef } from 'react'
import useTutorial from '../services/useTutorial'
import Button from '../components/Button'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import styled from 'styled-components'

const TutorialStyles = styled(Dialog)`
  border-radius: 8px;
  min-width: max(51vw, 320px);
  
  h3 {
    font-size: 18px;
    margin-top: -4px;
    margin-bottom: 16px;
  }

  > p {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 1rem;
  }

  .checkbox {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 24px;
    margin-bottom: 32px;
    margin-left: -4px;

    input {
      width: 16px;
      height: 16px;
    }

    span {
      margin-left: 4px;
    }
  }
`

export default function Tutorial () {
  const [flag, setFlag] = useTutorial()
  const [isOpen, setIsOpen] = useState(true)
  const [dontshow, setDontshow] = useState(false)
  const buttonRef = useRef()

  function close () {
    if (dontshow) {
      setFlag(true)
    }
    setIsOpen(false)
  }

  if (flag) {
    return null
  }

  return (
    <TutorialStyles isOpen={isOpen} aria-label="¿Como se juega?"
      onDismiss={close} initialFocusRef={buttonRef}>
      <h3>¿Como se juega?</h3>
      <p>
        Los jugadores envian sus cartas arrastrandolas a la zona central o pulsando sobre ellas.
      </p>
      <p>
        Cuando todos los jugadores hayan enviado sus cartas, el Juez las va revelando una a una pulsando sobre ellas
      </p>
      <p>
        Cuando todas las cartas estén reveladas, el Juez deberá escoger la carta ganadora.
        El jugador que haya enviado la carta ganadora sera recompensado con un punto.
      </p>
      <p>
        Para el caso de una carta con 2 respuestas, la carta que envias primero es la que se lee primero.
      </p>
      <label className="checkbox">
        <input type="checkbox" checked={dontshow} onChange={ev => setDontshow(ev.target.checked)} />
        <span>No volver a mostrar</span>
      </label>
      <Button ref={buttonRef} onClick={close}>Vale</Button>
    </TutorialStyles>
  )
}
