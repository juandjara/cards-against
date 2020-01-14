import { useEffect } from "react";

export default function useSocketMessage (socket, key, handler, deps = []) {
  useEffect(() => {
    if (socket) socket.on(key, handler)
    return () => {
      if (socket) socket.off(key, handler)
    }
  }, [socket, ...deps])
}