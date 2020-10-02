import React from 'react';
import {Router} from '@reach/router'
import PrivateRoute from './components/PrivateRoute'
import Main from './pages/Main'
import Home from './pages/Home'
import Settings from './pages/Settings'
import DeckEdit from './pages/DeckEdit'
import Game from './pages/Game'
import NewGame from './pages/NewGame'
import WaitRoom from './pages/WaitRoom'
import styled from 'styled-components'
import {useTranslations} from "./components/Localise";
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
  const {translations} = useTranslations()

  if (!translations) {
    return <FullScreen className="fullscreen"><Spinner/></FullScreen>;
  }

  return (
    <StyledRoot className="router">
      <PrivateRoute as={Main} path="/">
        <Home default/>
        <Settings path="settings"/>
        <DeckEdit path="decks/:deckid"/>
        <NewGame path="newgame"/>
        <WaitRoom path="wait/:gameId"/>
        <Game path="game/:gameId"/>
      </PrivateRoute>
    </StyledRoot>
  );
}

export default App;
