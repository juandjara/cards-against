// code from here: https://javascript.info/task/shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    let t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
}

function createID () {
  return Math.random()
    .toString(36)
    .toUpperCase()
    .replace(/[^A-Z]+/g, '')
    .substr(0, 4);
}

class Game {
  constructor (firstUserId) {
    const id = createID()
    const data = {
      id,
      rotation: 'winner',
      deck: null,
      players: [],
      shuffled: false,
      cardsPerHand: 5,
      round: {
        reader: firstUserId,
        cards: {
          black: null,
          white: []
        }
      }
    }
    Object.assign(this, data)
    return this    
  }

  edit (data) {
    Object.assign(this, data)
    return this
  }

  addPlayer (player) {
    this.players.push({
      id: player.id,
      name: player.name,
      cards: []
    })
    return this
  }

  removePlayer (userId) {
    this.players = this.players.filter(p => p.id !== userId)
    return this
  }

  shuffle () {
    shuffle(this.deck.cards)
    this.shuffled = true
    return this
  }

  drawBlackCard () {
    const card = this.deck.cards.find(c => c.type === 'black' && !c.used)
    card.used = true
    this.round.cards.black = card
    return this
  }

  drawWhiteCards (playerId) {
    const player = this.players.find(p => p.id === playerId)
    const numCards = this.cardsPerHand - player.cards.length
    const cards = this.deck.cards.filter(c => c.type === 'white' && !c.used)
      .slice(0, numCards)
      .map(c => {
        c.used = true
        return c
      })
    player.cards = cards
    return this
  }
}

module.exports = Game
