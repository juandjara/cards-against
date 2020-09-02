import React from 'react';
import { Router } from '@reach/router'
import PrivateRoute from './components/PrivateRoute'
import Main from './pages/Main'
import Home from './pages/Home'
import DeckList from './pages/DeckList'
import DeckEdit from './pages/DeckEdit'
import GameConfig from './pages/GameConfig'
import Game from './pages/Game'
import styled from 'styled-components'

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

function App() {
  return (
    <StyledRoot className="router">
      <PrivateRoute as={Main} path="/">
        <Home default />
        <DeckList path="settings" />
        <DeckEdit path="decks/:deckid" />
        <GameConfig path="config/:gameId" />
        <Game path="game/:gameId" />
      </PrivateRoute>
    </StyledRoot>
  );
}

export default App;
