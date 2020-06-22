import React, { createContext, useState } from 'react'

export const Context = createContext()

export function GlobalStateProvider({ children }) {
  const context = useState({
    socket: null,
    currentUser: null
  })
  
  return (
    <Context.Provider value={context}>{children}</Context.Provider>
  )
}
