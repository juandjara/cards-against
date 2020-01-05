import React, { useState, useReducer, useEffect } from 'react';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm'

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

function App() {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [socket, setSocket] = useState(null)
  const [users, dispatchUserAction] = useReducer(userReducer, [])

  const handleSubmit = ({ name, room }) => {
    setName(name)
    setRoom(room)
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
      socket.emit('user:list-request', room)
    })
    socket.on('user:list-request', receiver => {
      socket.emit('user:list-response', { receiver, sender: { name, room } })
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
  }, [socket, name, room])

  if (name && room) {
    return (
      <div style={{padding: '1rem'}}>
        <p>Welcome <strong>{name}</strong> to room <strong>{room}</strong></p>
        <p>People in this room</p>
        <ul>
          {users.map(u => (
            <li key={u.id}>
              {u.name}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <LoginForm onSubmit={handleSubmit} />
  );
}

export default App;
