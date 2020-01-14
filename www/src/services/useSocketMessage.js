import { useEffect } from "react";
import { useGlobalState } from "../GlobalState";

export default function useSocketMessage (key, handler) {
  const { socket } = useGlobalState()
  useEffect(() => {
    if (socket) socket.on(key, handler)
    return () => {
      if (socket) socket.off(key, handler)
    }
  }, [socket])
}