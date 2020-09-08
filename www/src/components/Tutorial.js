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
    margin-bottom: 12px;
  }

  > p {
    font-weight: 500;
  }

  .checkbox {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 8px;
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

export default function Tutorial ({ flagKey, title, text }) {
  const [flag, setFlag] = useTutorial(flagKey)
  const [open, setOpen] = useState(true)
  const [dontshow, setDontshow] = useState(false)
  const buttonRef = useRef()

  function close () {
    if (dontshow) {
      setFlag(false)
    }
    setOpen(false)
  }

  if (!flag) {
    return null
  }

  return (
    <TutorialStyles aria-label={title} isOpen={open} initialFocusRef={buttonRef}>
      <h3>{title}</h3>
      <p>{text}</p>
      <label className="checkbox">
        <input type="checkbox" checked={dontshow} onChange={ev => setDontshow(ev.target.checked)} />
        <span>No volver a mostrar</span>
      </label>
      <Button ref={buttonRef} onClick={close}>Vale</Button>
    </TutorialStyles>
  )
}
