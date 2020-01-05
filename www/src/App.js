import React, { useState, useReducer, useEffect } from 'react';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'

function userReducer (state = [], action) {
  switch (action.type) {
    case 'add':
      if (state.find(u => u.id === action.payload.id)) {
        return state.map(u => u.id === action.payload.id ? action.payload : u)
      }
      return state.concat(action.payload)
    case 'remove':
      return state.filter(u => u.id !== action.payload)
    default:
      return state
  }
}

function getCurrentUser (id, users) {
  return users.find(u => u.id === id)
}

function App() {
  const [id, setId] = useState(null)
  const [socket, setSocket] = useState(null)
  const [users, dispatchUserAction] = useReducer(userReducer, [])
  const currentUser = getCurrentUser(id, users)

  const handleSubmit = ({ name, room }) => {
    const socket = io(`localhost:5000?room=${room}&name=${name}`)
    window.socket = socket
    setSocket(socket)
  }

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.off() // removes all '.on' events
    socket.on('connect', () => {
      socket.emit('user:id-request')
      socket.once('user:id-response', id => {
        setId(id)
      })
    })

    if (currentUser) {
      socket.emit('user:list-request', currentUser.room)
    }

    socket.on('user:list-request', receiver => {
      socket.emit('user:list-response', { receiver, sender: currentUser })
    })
    socket.on('user:list-response', user => {
      dispatchUserAction({ type: 'add', payload: user })
    })
    socket.on('user:joined', user => {
      console.log('user joined', user)
      dispatchUserAction({ type: 'add', payload: user })
    })
    socket.on('user:left', id => {
      console.log('user left', id)
      dispatchUserAction({ type: 'remove', payload: id })
    })
  }, [socket, currentUser])

  if (!currentUser) {
    return <LoginForm onSubmit={handleSubmit} />
  }

  return (
    <div style={{padding: '1rem'}}>
      <p>Welcome <strong>{currentUser.name}</strong> to room <strong>{currentUser.room}</strong></p>
      <UserList users={users} />
    </div>
  )  
}

export default App;
