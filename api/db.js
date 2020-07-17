const Game = require('./game')

class GameError extends Error {
  constructor (code, msg) {
    super(msg)
    this.code = code
  }
}

const ERRORS = {
  GAME_404: 'GAME_NOT_FOUND'
}

const db = {
  games: {},
  hasGame (id) {
    return !!this.games[id]
  },
  createGame (firstUserId) {
    const game = new Game(firstUserId)
    this.games[game.id] = game
    return this.games[game.id]
  },
  shuffleGame (id) {
    const game = this.getGame(id)
    return game.shuffle()
  },
  getGame (id) {
    if (!this.hasGame(id)) {
      throw new GameError(ERRORS.GAME_404, `Game ${id} not found`)
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
  removePlayer (gameId, userId) {
    const game = this.getGame(gameId)
    game.removePlayer(userId)
    if (game.players.length == 0) {
      delete this.games[gameId]
    }
    return this.games[gameId]
  },
  removePlayerAll (userId) {
    for (const key in this.games) {
      this.removePlayer(key, userId)
    }
  },
  drawBlackCard (gameId) {
    const game = this.getGame(gameId)
    return game.drawBlackCard()
  },
  drawWhiteCards (gameId, userId) {
    const game = this.getGame(gameId)
    return game.drawWhiteCards(userId)
  }
}

module.exports = { db, ERRORS, GameError }
