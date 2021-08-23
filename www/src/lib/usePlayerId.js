import { nanoid } from 'nanoid'
import { useMemo } from 'react'

const PLAYER_ID_KEY = 'CCW_PLAYER_ID'

export default function usePlayerId() {
  return useMemo(() => {
    let id = window.localStorage.getItem(PLAYER_ID_KEY)
    if (!id) {
      id = nanoid()
      window.localStorage.setItem(PLAYER_ID_KEY, id)
    }

    return id
  }, [])
}
