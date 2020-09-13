const Game = require('./game')

class GameError extends Error {
  constructor (code, msg) {
    super(msg)
    this.code = code
  }
}

const ERRORS = {
  GAME_404: 'GAME_NOT_FOUND',
  CARD_404: 'CARD_NOT_FOUND'
}

const db = {
  games: {},
  hasGame (id) {
    return !!this.games[id]
  },
  createGame (firstPlayerId) {
    const game = new Game(firstPlayerId)
    this.games[game.id] = game
    return this.games[game.id]
  },
  shuffleGame (id) {
    const game = this.getGame(id)
    return game.shuffle()
  },
  getGame (id) {
    if (!this.hasGame(id)) {
      throw new GameError(ERRORS.GAME_404, `Game "${id}" not found`)
    }
    return this.games[id]
  },
  editGame ({ id, ...data }) {
    const game = this.getGame(id)
    return game.edit(data)
  },
  addPlayer (gameId, player) {
    const game = this.getGame(gameId)
    return game.addPlayer(player)
  },
  removePlayer (gameId, playerId) {
    const game = this.getGame(gameId)
    game.removePlayer(playerId)
    if (game.players.length == 0) {
      delete this.games[gameId]
    }
    return this.games[gameId]
  },
  removePlayerAll (playerId) {
    for (const key in this.games) {
      this.removePlayer(key, playerId)
    }
  },
  drawBlackCard (gameId) {
    const game = this.getGame(gameId)
    return game.drawBlackCard()
  },
  drawWhiteCards (gameId, playerId) {
    const game = this.getGame(gameId)
    return game.drawWhiteCards(playerId)
  },
  playWhiteCard (gameId, cardId, playerId) {
    const game = this.getGame(gameId)
    return game.playWhiteCard(cardId, playerId)
  },
  revealCard (gameId, cardId) {
    const game = this.getGame(gameId)
    const result = game.revealCard(cardId)
    if (!result) {
      throw new GameError(ERRORS.CARD_404, `Card for player "${playerId}" not found in the white cards played this round`)
    }
    return result
  },
  setRoundWinner (gameId, playerId, whiteCardId, blackCardId) {
    const game = this.getGame(gameId)
    return game.setRoundWinner(playerId, whiteCardId, blackCardId)
  }
}

module.exports = { db, ERRORS, GameError }
