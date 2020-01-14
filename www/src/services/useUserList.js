import { useReducer, useEffect } from "react"
import useSocketMessage from './useSocketMessage'

function userReducer (state = [], { type, payload }) {
  switch (type) {
    case 'add':
      return state.concat(payload)
    case 'remove':
      return state.filter(u => u.id !== payload.id)
    default:
      return state
  }
}

export default function useUserList (socket) {
  const [users, dispatch] = useReducer(userReducer, [])

  useEffect(() => {
    if (socket) {
      socket.emit('user:list-request')
    }
  }, [socket])
  useSocketMessage(socket, 'user:list-response', user => {
    console.log('[useUserList] user:list-response', user)
    dispatch({ type: 'add', payload: user })
  })
  useSocketMessage(socket, 'user:joined', user => {
    console.log('[useUserList] user:joined', user)
    dispatch({ type: 'add', payload: user })
  })
  useSocketMessage(socket, 'user:left', id => {
    console.log('[useUserList] user:left', id)
    dispatch({ type: 'remove', payload: { id }})
  })

  return users
}