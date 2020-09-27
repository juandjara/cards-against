import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import styled from 'styled-components'
import useGlobalSlice from '../services/useGlobalSlice'
import Header from '../components/Header'
import Button from '../components/Button'
import Input from '../components/Input'
import config from '../config'
import Select from "react-select";
import Localise, {parseTranslation} from "../components/Localise";

const NameSelectStyle = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr; 

  .name-form {
    align-self: center;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h2 {
      font-size: 24px;
      line-height: 32px;
      font-weight: 500;
      margin: 0;
    }

    .input-group {
      display: flex;
      align-items: stretch;
      justify-content: center;
      margin: 12px 0;
    }
    
    .input-block {
      min-width: 10%;
    }

    input {
      margin-right: -4px;
    }

    button {
      border-radius: 0 4px 4px 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
`

async function fetchTranslation (langCode = 'es') {
  let response = await fetch(`${process.env.PUBLIC_URL}/locales/${langCode}.json`)
  if(response) return await response.json();
  return {}
}


export default function NameSelect () {
  /* eslint-disable no-unused-vars */
  const [socket, setSocket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [language, setLanguage] = useGlobalSlice('language')
  const [translations, setTranslations] = useGlobalSlice('translations')

  /* eslint-enable no-unused-vars */
  const nameFromLS = localStorage.getItem(config.NAME_KEY) || ''
  const languageFromLS = localStorage.getItem(config.LANGUAGE_KEY);
  let fallbackLanguage = config.availableLanguages[0];
  try {
    fallbackLanguage = JSON.parse(languageFromLS);
  } catch (ignore) {}

  const [name, setName] = useState(nameFromLS)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  const {availableLanguages} = config

  function handleSubmit (ev) {
    ev.preventDefault()
    connect(name)
  }

  function connect(name) {
    const socket = io(`${config.api}?name=${name}`)
    setLoading(true)
    socket.once('connect', () => {
      socket.emit('user:id-request', (user) => {
        setLoading(false)
        setSocket(socket)
        setCurrentUser(user)
        localStorage.setItem(config.NAME_KEY, name)
      })
    })
  }

  useEffect(() => {
    if(language) {
      const fetch = async () => {
        const translation = await fetchTranslation(language.value)
        if(translation) {
          localStorage.setItem(config.LANGUAGE_KEY, JSON.stringify(language))
          setTranslations(translation);
        }
      }

      fetch();
    }
  }, [language, setTranslations])

  useEffect(() => {
    if (nameFromLS) {
      connect(nameFromLS)
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
    console.log('Fallback Language:', fallbackLanguage, languageFromLS)
    setLanguage(fallbackLanguage);
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return (
      <NameSelectStyle className="name-select">
        <Header />
        <div className="name-form">
          <h2>Cargando ...</h2>
        </div>
      </NameSelectStyle>
    )
  }

  if (nameFromLS) {
    return null
  }

  return (
    <NameSelectStyle className="name-select">
      <Header />
      <form className="name-form" onSubmit={handleSubmit}>
        <h2><Localise node="views.name_select.header" /></h2>
        <div className="input-group">
          <Input
            ref={inputRef}
            required
            type="text"
            name="name"
            value={name}
            onChange={ev => setName(ev.target.value.trim())}
            placeholder={parseTranslation("views.name_select.input_name_placeholder", null, translations)} />
          <Button type="submit"><Localise node="general.buttons.join" /></Button>
        </div>
        <div className="input-block">
          <label id="deck-select-label"><Localise node="general.language" /></label>
          <Select
              required
              value={language}
              onChange={setLanguage}
              className="select-container"
              options={availableLanguages} />
        </div>
      </form>
    </NameSelectStyle>
  )
}
