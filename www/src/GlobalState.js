import React, { createContext, useState } from 'react'

export const Context = createContext()

export function GlobalStateProvider({ children }) {
  const context = useState({
    socket: null,
    currentUser: null,
    alerts: []
  })
  
  return (
    <Context.Provider value={context}>{children}</Context.Provider>
  )
}
