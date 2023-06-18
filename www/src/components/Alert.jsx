import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSocket } from '@/lib/SocketProvider'

const DEFAULT_DELAY = 5000

function getAlertColor(type) {
  if (type === 'info') {
    return 'blue'
  }
  if (type === 'warning') {
    return 'yellow'
  }
  if (type === 'success') {
    return 'green'
  }
  return 'red'
}

const AlertContext = createContext()

export function useAlert() {
  const setAlert = useContext(AlertContext)
  return ({ text, type }) => setAlert({ text, type })
}

export default function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null)
  return (
    <AlertContext.Provider value={setAlert}>
      <Alert alert={alert} setAlert={setAlert} />
      {children}
    </AlertContext.Provider>
  )
}

function Alert({ alert, setAlert }) {
  const socket = useSocket()

  useEffect(() => {
    function onError(msg) {
      setAlert({
        text: `PUM! Algo se ha roto!! \n${msg}`,
        type: 'error'
      })
    }
    function onDisconnect() {
      setAlert({
        text: 'Se ha perdido la conexion con el servidor',
        type: 'warning'
      })
    }
    function onReconnect() {
      setAlert({
        text: 'Recuperada la conexion con el servidor',
        type: 'success'
      })
    }

    if (socket) {
      socket.on('error', onError)
      socket.on('disconnect', onDisconnect)
      socket.on('reconnect', onReconnect)
      socket.on('alert', ({ text, color }) => setAlert({ text, color: color || 'blue' }))
    }

    return () => {
      if (socket) {
        socket.off('error', onError)
        socket.off('disconnect', onDisconnect)
        socket.off('reconnect', onReconnect)
        socket.off('alert')
      }
    }
  }, [socket])

  useEffect(() => {
    let id
    if (alert) {
      id = window.setTimeout(() => setAlert(null), DEFAULT_DELAY)
    }
    return () => window.clearTimeout(id)
  }, [alert, setAlert])

  const alertText = typeof alert === 'string' ? alert : alert && alert.text
  const alertType = alert?.type || 'error'
  const color = getAlertColor(alertType)

  // styles taken from here: https://tailwindcomponents.com/component/alert-component-with-tailwind-css
  return (
    alert && (
      <div
        className={`z-20 animation-alert fixed top-0 left-1/2 transform -translate-x-1/2 w-3/4 xl:w-2/4 max-w-xl mt-6 p-4 rounded-md bg-${color}-100 text-base flex items-center`}
      >
        <span className="sr-only">{alertType}:</span>
        <span className={`text-${color}-700 whitespace-pre-line`}>{alertText}</span>
      </div>
    )
  )
}
