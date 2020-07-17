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
  playWhiteCard (gameId, playerId, cardId) {
    const game = this.getGame(gameId)
    return game.playWhiteCard(playerId, cardId)
  }
}

module.exports = { db, ERRORS, GameError }
