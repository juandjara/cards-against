const Game = require('./game')

class ApiError extends Error {
  constructor (status, msg) {
    super(msg)
    this.status = status
  }
}

const db = {
  games: {},
  hasGame (id) {
    return !!this.games[id]
  },
  createGame (data) {
    const game = new Game(data)
    this.games[game.id] = game
    return game
  },
  getGame (id) {
    if (!this.hasGame(id)) {
      throw new ApiError(404, `Game with ID '${id}' not found`)
    }
    return this.games[id]
  },
  removeGame (game) {
    delete this.games[game.id]
  },
  revealCard (gameId, cardId) {
    const result = this.getGame(gameId).revealCard(cardId)
    if (!result) {
      throw new ApiError(404, `Card for player "${playerId}" not found in the white cards played this round`)
    }
    return result
  }
}

module.exports = { db, ApiError }
