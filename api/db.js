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
  createGame ({ id, owner }) {
    this.games[id] = {
      id,
      rotation: 'winner',
      deck: null,
      players: [],
      owner
    }
    return this.games[id]
  },
  getGame (id) {
    if (!this.hasGame(id)) {
      throw new GameError(ERRORS.GAME_404, `Game ${id} not found`)
    }
    return this.games[id]
  },
  editGame ({ id, ...data }) {
    console.log('editGame ', id, data)
    const game = this.getGame(id)
    this.games[id] = { ...game, ...data }
    return this.games[id]
  },
  addPlayer (gameId, player) {
    const game = this.getGame(gameId)
    game.players.push(player)
    return game
  },
  removePlayer (gameId, userId) {
    const game = this.getGame(gameId)
    game.players = game.players.filter(p => p.id !== userId)
    if (game.players.length == 0) {
      delete this.games[gameId]
    }
    return this.games[gameId]
  },
  removePlayerAll (userId) {
    for (const key in this.games) {
      this.removePlayer(key, userId)
    }
  }
}

module.exports = { db, ERRORS, GameError }
