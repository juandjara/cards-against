import React, { useState, useRef } from 'react'
import useTutorial from '../services/useTutorial'
import Button from './Button'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import styled from 'styled-components'
import {useTranslations} from "./Localise";

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

export default function TutorialModal () {
  const [flag, setFlag] = useTutorial()
  const [isOpen, setIsOpen] = useState(true)
  const [dontshow, setDontshow] = useState(false)
  const {getTranslation} = useTranslations();
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

  const title = getTranslation("view.tutorial.title")

  return (
    <TutorialStyles isOpen={isOpen} aria-label={title}
      onDismiss={close} initialFocusRef={buttonRef}>
      <h3>{title}</h3>
      <div className="tutorial-guide" dangerouslySetInnerHTML={{__html: getTranslation("views.tutorial.game_guide")}}/>
      <label className="checkbox">
        <input type="checkbox" checked={dontshow} onChange={ev => setDontshow(ev.target.checked)} />
        <span>{getTranslation("buttons.dont_show_again")}</span>
      </label>
      <Button ref={buttonRef} onClick={close}>{getTranslation("buttons.ok")}</Button>
    </TutorialStyles>
  )
}
