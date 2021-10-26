import React from 'react'
import { Routes as BrowserRoutes, Route } from 'react-router-dom'
import Home from '@/views/Home'
import CreateGame from '@/views/CreateGame'
import JoinGame from '@/views/JoinGame'
import PlayGame from '@/views/PlayGame'
import Guide from '@/views/Guide'
import PublicGames from '@/views/PublicGames'
import DeckList from '@/views/DeckList'
import DeckEdit from './views/DeckEdit'
import ShareDeck from './views/ShareDeck'

export default function Routes() {
  return (
    <BrowserRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/publicgames" element={<PublicGames />} />
      <Route path="/newgame" element={<CreateGame />} />
      <Route path="/join/:id" element={<JoinGame />} />
      <Route path="/game/:id" element={<PlayGame />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/decks" element={<DeckList />} />
      <Route path="/decks/:id" element={<DeckEdit />} />
      <Route path="/decks/share/:id" element={<ShareDeck />} />
    </BrowserRoutes>
  )
}
