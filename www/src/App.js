import React from 'react';
import { Router } from '@reach/router'
import PrivateRoute from './components/PrivateRoute'
import RoomSelect from './pages/RoomSelect'

function App() {
  return (
    <div className="App">
      <Router style={{ minHeight: '100vh' }}>
        <PrivateRoute as={RoomSelect} path="/" />
      </Router>
    </div>
  );
}

export default App;
