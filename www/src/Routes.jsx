import React from 'react'
import { Routes as BrowserRoutes, Route } from 'react-router-dom'
import Home from '@/views/Home'
import DeckList from '@/views/DeckList'
import CreateGame from '@/views/CreateGame'
import JoinGame from '@/views/JoinGame'
import PlayGame from '@/views/PlayGame'
import Guide from './views/Guide'

export default function Routes() {
  return (
    <BrowserRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/decks" element={<DeckList />} />
      <Route path="/newgame" element={<CreateGame />} />
      <Route path="/join/:id" element={<JoinGame />} />
      <Route path="/game/:id" element={<PlayGame />} />
      <Route path="/guide" element={<Guide />} />
    </BrowserRoutes>
  )
}
