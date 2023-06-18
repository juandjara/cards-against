const Game = require('./game')
const { Redis } = require('ioredis')

const redis = new Redis(
  process.env.REDIS_URL,
  { family: 6 }
)

class ApiError extends Error {
  constructor (status, msg) {
    super(msg)
    this.status = status
  }
}

const db = {
  async getAll () {
    const ids = await redis.smembers('games')
    if (ids.length === 0) {
      return []
    }

    const games = await redis.mget(...ids.map(id => `game:${id}`))
    return games.filter(Boolean).map(g => JSON.parse(g))
  },
  async createGame (data) {
    const game = new Game(data)
    await redis.set(`game:${game.id}`, JSON.stringify(game.toJSON()))
    await redis.sadd('games', game.id)
    return game
  },
  async getGame (id) {
    const game = await redis.get(`game:${id}`)
    if (!game) {
      throw new ApiError(404, `Game with ID '${id}' not found`)
    }
    return Game.fromJSON(JSON.parse(game))
  },
  async updateGame (id, updateFn) {
    const game = await db.getGame(id)
    const newGame = updateFn(game)
    await redis.set(`game:${game.id}`, JSON.stringify(newGame.toJSON()))
    return newGame
  },
  async removeGame (game) {
    await redis.del(`game:${game.id}`)
    await redis.srem('games', game.id)
  }
}

module.exports = { db, ApiError }
