const constants = require('../../constants')
const { ROTATE_NEXT, ROTATE_WINNER, WIN_ALL_CARDS, WIN_N_ROUNDS, WIN_N_POINTS, MIN_BLACK_CARDS, MIN_WHITE_CARDS } =
  constants

// code from here: https://javascript.info/task/shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    let t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
}

function createID() {
  return Math.random()
    .toString(36)
    .toUpperCase()
    .replace(/[^A-Z]+/g, '')
    .substr(0, 4);
}

class Round {
  constructor() {
    this.host = null
    this.winner = null
    this.blackCard = null
    this.whiteCards = []
  }

  addWhiteCard(card, player) {
    this.whiteCards.push({ card, player, hidden: true })
  }

  revealWhiteCards(player) {
    for (const card of this.whiteCards) {
      if (card.player === player) {
        card.hidden = false
      }
    }
  }

  removePlayedCards (player) {
    this.whiteCards = this.whiteCards.filter(c => c.player !== player)
  }

  finish (winner) {
    this.winner = winner
    this.whiteCards = this.whiteCards.filter(c => c.player === winner)
  }
}

class Game {
  constructor({ deck, rotation, winCondition, maxPoints, maxRounds }) {
    const id = createID()
    const data = {
      id,
      deck,
      rotation,
      winCondition,
      players: [],
      started: false,
      finished: false,
      cardsPerHand: 5,
      maxPoints,
      maxRounds,
      finishedRounds: [],
      round: new Round()
    }
    Object.assign(this, data)
    return this
  }

  edit(data) {
    Object.assign(this, data)
    return this
  }

  addPlayer(player) {
    this.players.push({
      id: player.id,
      name: player.name,
      cards: [],
      points: 0
    })
    return this
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId)
    this.round.removePlayedCards(playerId)
    if (this.players.length && this.round.host === playerId) {
      this.round.host = this.players[0].id
    }
    return this
  }

  start() {
    shuffle(this.deck.blackCards)
    shuffle(this.deck.whiteCards)
    this.started = true
    this.startRound()

    return this
  }

  startRound() {
    this.round = new Round()
    this.checkWinCondition()
    this.selectNewHost()
    this.drawBlackCard()
    for (const player of this.players) {
      this.drawWhiteCards(player.id)
    }
  }

  finishRound(winnerPlayerId) {
    const player = this.players.find(p => p.id === playerId)
    player.points++
    this.round.finish(winnerPlayerId)
    this.finishedRounds.push(this.round)
    this.startRound()
    return this
  }

  getLastFinishedRound () {
    return this.finishedRounds[this.finishedRounds.length - 1]
  }

  selectNewHost() {
    const lastRound = this.getLastFinishedRound()
    if (!lastRound) {
      this.round.host = this.players[0].id
      return
    }

    if (this.rotation === ROTATE_WINNER) {
      this.round.host = lastRound.winner
    }
    if (this.rotation === ROTATE_NEXT) {
      this.players.forEach((p, i) => {
        if (p.id === lastRound.winner) {
          let nextIndex = i + 1
          if (nextIndex >= this.players.length) {
            nextIndex = 0
          }
          const nextPlayer = this.players[nextIndex]
          this.round.host = nextPlayer.id
        }
      })
    }
  }

  checkWinCondition() {
    if (this.winCondition === WIN_ALL_CARDS) {
      if (this.deck.blackCards.every(c => this.usedCards.has(c))) {
        this.gameOver()
      }
    }
    if (this.winCondition === WIN_N_ROUNDS) {
      if (this.finishedRounds.length >= this.maxRounds) {
        this.gameOver()
      }
    }
    if (this.winCondition === WIN_N_POINTS) {
      this.finishedRounds.push(this.round)
      this.start
      const higherPoints = Math.max(...this.players.map(p => p.points))
      if (higherPoints >= this.maxPoints) {
        this.gameOver()
      }
    }
  }

  gameOver() {
    this.finished = true
    return this
  }

  drawBlackCard() {
    const card = this.deck.blackCards.find(c => !this.usedCards.has(c))
    this.usedCards.add(card)
    this.round.blackCard = card
    return this
  }

  drawWhiteCards(playerId) {
    const player = this.players.find(p => p.id === playerId)
    const numCardsMissing = this.cardsPerHand - player.cards.length
    let newCards = this.deck.whiteCards.filter(c => !this.usedCards.has(c)).slice(0, numCardsMissing)
    if (newCards.length < numCardsMissing) {
      this.recoverUsedWhiteCards()
      newCards = this.deck.whiteCards.filter(c => !this.usedCards.has(c)).slice(0, numCardsMissing)
    }
    for (const card of newCards) {
      player.cards.push(card)
      this.usedCards.add(card)
    }
    return this
  }

  recoverUsedWhiteCards() {
    const whiteCardsInUse = this.round.whiteCards.map(c => c.card)
    for (const card of this.deck.whiteCards) {
      if (whiteCardsInUse.indexOf(card) === -1 && this.usedCards.has(card)) {
        this.usedCards.delete(card)
      }
    }
    shuffle(this.deck.whiteCards)
  }

  playWhiteCard(card, playerId) {
    this.round.addWhiteCard(card, playerId)
    return this
  }

  revealCard(playerId) {
    this.round.revealCard(playerId)
    return this
  }
}

module.exports = Game
