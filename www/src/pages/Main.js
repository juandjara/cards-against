import React, { Fragment, useEffect } from 'react'
import Header from '../components/Header'
import useGlobalSlice from '../services/useGlobalSlice'

export default function Main ({ children }) {
  const [socket] = useGlobalSlice('socket')
  useEffect(() => {
    socket.on('error', error => {
      alert('[socket.io] Error from socket', error)
    })
    socket.on('disconnect', () => {
      alert('disconnected from server')
    })
    socket.on('reconnect', () => {
      alert('connected again')
    })

    return () => {
      socket.off('error')
      socket.off('disconnect')
      socket.off('reconnect')
    }
  }, [])
  
  return (
    <Fragment>
      <Header></Header>
      <main className="main-content">{children}</main>
    </Fragment>
  )
}
