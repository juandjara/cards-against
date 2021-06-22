import React, { createContext, useContext, useEffect, useRef } from 'react'
import config from '@/config'
import io from 'socket.io-client'

const SocketContext = createContext()

export function SocketProvider({ children }) {
  const socket = useRef(null)

  useEffect(() => {
    socket.current = io(config.api)
  }, [])

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
