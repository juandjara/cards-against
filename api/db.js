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
  createGame ({ id, name, rotation, deck, owner }) {
    this.games[id] = {
      id, name, rotation, deck, owner, players: []
    }
    return this.games[id]
  },
  getGame (id) {
    if (!this.hasGame(id)) {
      throw new GameError(ERRORS.GAME_404, `Game ${id} not found`)
    }
    return this.games[id]
  },
  addPlayer (game, player) {
    this.getGame(game).players.push(player)
  },
  removePlayer (id) {
    for (const key in this.games) {
      this.games[key].players = this.games[key].players.filter(p => p.id !== id)
      if (this.games[key].players.length === 0) {
        delete this.games[key]
      }
    }
  }
}

module.exports = { db, ERRORS, GameError }
