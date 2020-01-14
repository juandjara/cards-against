import React, { createContext, useState, useContext } from 'react'
import useUserList from './services/useUserList'
import useCurrentUser from './services/useCurrentUser'

const Context = createContext()

function getRooms (users) {
  const rooms = {}
  for (const user of users) {
    if (user.room) {
      rooms[user.room] = rooms[user.room] || []
      rooms[user.room].push(user)
    }
  }
  return Object.entries(rooms)
}

export function GlobalStateProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [currentUser, setCurrentUser] = useCurrentUser(socket)
  const users = useUserList(socket)
  const rooms = getRooms(users)

  const context = {
    socket, setSocket,
    currentUser, setCurrentUser,
    users, rooms
  }
  
  return (
    <Context.Provider value={context}>{children}</Context.Provider>
  )
}

export function useGlobalState () {
  return useContext(Context)
}

