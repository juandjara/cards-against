import React, { createContext, useContext, useEffect, useState } from 'react'
import config from '@/config'
import io from 'socket.io-client'

const SocketContext = createContext()

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!socket) {
      const socket = io(config.api)
      setSocket(socket)
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export function useSocket() {
  return useContext(SocketContext)
}
