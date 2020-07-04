import React from 'react';
import { Router } from '@reach/router'
import PrivateRoute from './components/PrivateRoute'
import Main from './pages/Main'
import RoomSelect from './pages/RoomSelect'
import DeckList from './pages/DeckList'
import DeckEdit from './pages/DeckEdit'
import Room from './pages/Room'
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
        <RoomSelect default />
        <DeckList path="decks" />
        <DeckEdit path="decks/:deckid" />
        <Room path="room/:roomid" />
      </PrivateRoute>
    </StyledRoot>
  );
}

export default App;
