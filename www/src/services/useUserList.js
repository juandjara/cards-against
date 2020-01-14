import { useReducer, useEffect } from "react"
import { useGlobalState } from "../GlobalState"
import useSocketMessage from './useSocketMessage'

function userReducer (state = {}, action) {
  switch (action.type) {
    case 'set':
      return action.payload
    case 'add':
      return { ...state, ...action.payload }
    case 'remove':
      const key = action.payload
      delete state[key]
      return state
    default:
      return state
  }
}

export default function useUserList () {
  const { socket, currentUser } = useGlobalState()
  const initial = { [currentUser.id]: currentUser }
  const [users, dispatch] = useReducer(userReducer, initial)
  useEffect(() => {
    if (socket) {
      socket.emit('user:list-request')
    }
  }, [socket])
  useSocketMessage('user:list-response', user => {
    dispatch({ type: 'add', payload: user })
  })
  useSocketMessage('user:joined', user => {
    dispatch({ type: 'add', payload: user })
  })
  useSocketMessage('user:left', id => {
    dispatch({ type: 'remove', payload: id })
  })

  return users
}