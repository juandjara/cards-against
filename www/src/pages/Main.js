import React, { Fragment, useEffect } from 'react'
import Header from '../components/Header'
import Alerts from '../components/Alerts'
import useGlobalSlice from '../services/useGlobalSlice'
import { navigate } from '@reach/router'

export default function Main ({ children }) {  
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  
  useEffect(() => {
    function onDisconnect () {
      if (currentUser.game) {
        setCurrentUser({ ...currentUser, game: null })
        navigate('/')
      }
    }
    function onReconnect () {
      setCurrentUser({ ...currentUser, id: socket.id })
    }

    socket.on('disconnect', onDisconnect)
    socket.on('reconnect', onReconnect)

    return () => {
      socket.off('disconnect', onDisconnect)
      socket.off('reconnect', onReconnect)
    }
    // eslint-disable-next-line
  }, [socket])

  return (
    <Fragment>
      <Alerts />
      <Header />
      <main className="main-content">{children}</main>
    </Fragment>
  )
}
