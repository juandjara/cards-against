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
  shuffleGame (id) {
    const game = this.getGame(id)
    return game.shuffle()
  },
  getGame (id) {
    if (!this.hasGame(id)) {
      throw new ApiError(404, `Game with ID '${id}' not found`)
    }
    return this.games[id]
  },
  editGame ({ id, ...data }) {
    const game = this.getGame(id)
    return game.edit(data)
  },
  removeGame (game) {
    delete this.games[game.id]
  },
  addPlayer (gameId, player) {
    const game = this.getGame(gameId)
    return game.addPlayer(player)
  },
  removePlayer (gameId, playerId) {
    const game = this.getGame(gameId)
    return game.removePlayer(playerId)
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
      throw new ApiError(404, `Card for player "${playerId}" not found in the white cards played this round`)
    }
    return result
  },
  setRoundWinner (gameId, playerId, whiteCardId, blackCardId) {
    const game = this.getGame(gameId)
    return game.setRoundWinner(playerId, whiteCardId, blackCardId)
  }
}

module.exports = { db, ApiError }
