import React from 'react';
import { Router } from '@reach/router'
import PrivateRoute from './components/PrivateRoute'
import Main from './pages/Main'
import RoomSelect from './pages/RoomSelect'
import DeckList from './pages/DeckList'
import DeckEdit from './pages/DeckEdit'
import Room from './pages/Room'

function App() {
  return (
    <Router>
      <PrivateRoute as={Main} path="/">
        <RoomSelect default />
        <DeckList path="decks" />
        <DeckEdit path="decks/:deckid" />
        <Room path="room/:roomid" />
      </PrivateRoute>
    </Router>
  );
}

export default App;
