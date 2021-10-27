import { DECKS_KEY } from '@/views/DeckEdit'

const context = import.meta.glob('../assets/*.json')

export default async function loadAllDecks() {
  const promises = Object.keys(context).map(key => context[key]())
  const baseDecks = await Promise.all(promises)
  const savedDecks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')

  return baseDecks.concat(savedDecks)
}
