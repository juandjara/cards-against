import { useState, useEffect } from "react";
import config from '../config'

export default function useDecks () {
  const initial = JSON.parse(localStorage.getItem(config.DATA_KEY) || '{}')
  const [cards, setCards] = useState(initial)

  useEffect(() => {
    localStorage.setItem(config.DATA_KEY, JSON.stringify(cards))
  }, [cards])

  return [cards, setCards]
}