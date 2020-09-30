import React, {useEffect} from 'react';
import { Router } from '@reach/router'
import PrivateRoute from './components/PrivateRoute'
import Main from './pages/Main'
import Home from './pages/Home'
import Settings from './pages/Settings'
import DeckEdit from './pages/DeckEdit'
import Game from './pages/Game'
import NewGame from './pages/NewGame'
import WaitRoom from './pages/WaitRoom'
import styled from 'styled-components'
import useGlobalSlice from "./services/useGlobalSlice";
import config from "./config";
import {fetchTranslation} from "./components/Localise";
import Spinner from "./components/Spinner";

const StyledRoot = styled(Router)`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;

  .main-content {
    padding: 0 12px;
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
  }
`

const FullScreen = styled.div`
position: absolute;
width: 100%;
height: 100%;
`

function App() {
  const [translations, setTranslations] = useGlobalSlice('translations')
  const [language, setLanguage] = useGlobalSlice('language')

  const languageFromLS = localStorage.getItem(config.LANGUAGE_KEY);
  let fallbackLanguage = config.availableLanguages[0];
  try {
    fallbackLanguage = JSON.parse(languageFromLS) || fallbackLanguage;
  } catch (ignore) {}

  useEffect(() => {
    if(language) {
      fetchTranslation(language.value).then(translation => {
        if(translation) {
          localStorage.setItem(config.LANGUAGE_KEY, JSON.stringify(language))
          setTranslations(translation);
        }
      }).catch(error => {
        console.error('Error fetching translations:', error);
        setTranslations({});
      })
    }
    // eslint-disable-next-line
  }, [language])

  useEffect(() => {
    setLanguage(fallbackLanguage);
    // eslint-disable-next-line
  }, [])

  if(!translations) {
    return <FullScreen className="fullscreen"><Spinner /></FullScreen>;
  }

  return (
    <StyledRoot className="router">
      <PrivateRoute as={Main} path="/">
        <Home default />
        <Settings path="settings" />
        <DeckEdit path="decks/:deckid" />
        <NewGame path="newgame" />
        <WaitRoom path="wait/:gameId" />
        <Game path="game/:gameId" />
      </PrivateRoute>
    </StyledRoot>
  );
}

export default App;
