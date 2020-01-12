import React, { createContext, useState, useContext, useEffect } from 'react'

const Context = createContext()

export function GlobalStateProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [socket, setSocket] = useState(null)
  const [room, setRoom] = useState(null)
  const context = { 
    currentUser, setCurrentUser,
    socket, setSocket,
    room, setRoom
  }
  return (
    <Context.Provider value={context}>{children}</Context.Provider>
  )
}

export function useGlobalState () {
  return useContext(Context)
}

export function useSocketEvent(key, handler) {
  const { socket } = useGlobalState()
  useEffect(() => {
    socket.on(key, handler)
    return () => {
      socket.off(key, handler)
    }
  }, [])
}

