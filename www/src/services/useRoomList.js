import { useReducer } from "react"
import useSocketMessage from './useSocketMessage'
import useUserList from "./useUserList"

function roomReducer (state = [], { type, payload }) {
  switch (type) {
    case 'set':
      return payload
    case 'join':
      const existing = state.find(r => r.name === payload.room)
      return existing
        ? state.map(
            r => r.name === payload.room
              ? ({ ...r, users: Array.from(new Set(r.users.concat(payload.id))) })
              : r
          )
        : state.concat({ name: payload.room, users: [ payload.id ] })
    case 'leave':
      return state.map(r => ({ ...r, users: r.users.filter(u => u !== payload.id) }))
    default:
      return state
  }
}

export default function useRoomList () {
  const users = useUserList()
  const [rooms, dispatch] = useReducer(roomReducer, [])

  useSocketMessage('user:joined', user => {
    dispatch({ type: 'join', payload: user })
  })

  useSocketMessage('user:left', id => {
    dispatch({ type: 'leave', payload: { id } })
  })

  function setRooms (rooms) {
    dispatch({ type: 'set', payload: rooms })
  }
  
  const data = rooms.map(r => ({
    ...r,
    users: r.users.map(id => users[id]).filter(Boolean)
  }))

  return [data, setRooms]
}