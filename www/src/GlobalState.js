import React, { createContext, useState, useContext, useEffect } from 'react'

const Context = createContext()

// TODO: separate concepts "room" and "game"
// room just holds a room name and a group of users
// game holds data for the current game being played
// this way there is a 1:1 relation between game and room
// and you can change the game (cards set, rotation mode, etc)
// without leaving the room

export function GlobalStateProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  
  useEffect(() => {
    if (socket) {
      socket.on('user:list-request', id => {
        socket.emit('user:list-response', { receiver: id, sender: currentUser })
      })
    }
    return () => {
      if (socket) socket.off('user:list-request')
    }
  }, [socket])

  const context = {
    socket, setSocket,
    currentRoom, setCurrentRoom,
    currentUser, setCurrentUser
  }
  
  return (
    <Context.Provider value={context}>{children}</Context.Provider>
  )
}

export function useGlobalState () {
  return useContext(Context)
}

