import { DECKS_KEY } from '@/views/DeckEdit'

const context = import.meta.glob('../assets/*.json')

function clearDeck(deck) {
  const { whiteCards, blackCards, disabledWhites = [], disabledBlacks = [] } = deck
  const filteredWhite = whiteCards.filter((card, idx) => !disabledWhites.includes(idx))
  const filteredBlack = blackCards.filter((card, idx) => !disabledBlacks.includes(idx))
  return {
    ...deck,
    whiteCards: filteredWhite,
    blackCards: filteredBlack
  }
}

export default async function loadAllDecks() {
  const promises = Object.keys(context).map(key => context[key]())
  const baseDecks = await Promise.all(promises)
  const savedDecks = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]')

  return baseDecks.concat(savedDecks).map(clearDeck)
}
