import { useState } from "react";
import useSocketMessage from './useSocketMessage'

export default function useCurrrentUser (socket) {
  const [currentUser, setCurrentUser] = useState(null)
  useSocketMessage(socket, 'user:list-request', id => {
    socket.emit('user:list-response', { receiver: id, sender: currentUser })
  }, [currentUser])
  return [currentUser, setCurrentUser]
}
