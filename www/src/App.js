import React from 'react';
import { Router } from '@reach/router'
import PrivateRoute from './components/PrivateRoute'
import Main from './pages/Main'
import RoomSelect from './pages/RoomSelect'
import RoomEdit from './pages/RoomEdit';

function App() {
  return (
    <Router>
      <PrivateRoute as={Main} path="/">
        <RoomSelect default />
        <RoomEdit path="roomedit" />
      </PrivateRoute>
    </Router>
  );
}

export default App;
