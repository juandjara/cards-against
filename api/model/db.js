const Game = require('./game')
const { Redis } = require('ioredis')

class ApiError extends Error {
  constructor (status, msg) {
    super(msg)
    this.status = status
  }
}

const EXPIRATION_TIME = 60 * 60 * 24 * 7 // 1 week

/**
 * Create a redis instance only for the duration of the function call
 * @param {(r: Redis) => Promise} fn 
 * @returns {Promise} result of fn
 */
async function useRedis(fn) {
  const redis = new Redis(
    process.env.REDIS_URL,
    { family: 6, reconnectOnError: 2 }
  )
  redis.on('error', err => {
    console.error('Redis error: ', err)
  })
  const result = await fn(redis)
  await redis.quit()
  return result
}

function assertDelete(n, message = 'Resouce was not deleted correctly') {
  if (n !== 1) {
    throw new ApiError(404, message)
  }
}

const db = {
  async getAll () {
    const games = await useRedis(async r => {
      const ids = await r.smembers('games')
      if (ids.length === 0) {
        return []
      }
      return r.mget(...ids.map(id => `game:${id}`))
    })
    return games.filter(Boolean).map(g => JSON.parse(g))
  },
  async createGame (data) {
    const game = new Game(data)
    await useRedis(r => {
      r.setex(`game:${game.id}`, EXPIRATION_TIME, JSON.stringify(game.toJSON()))
      r.sadd('games', game.id)
    })
    return game
  },
  async getGame (id) {
    const game = await useRedis(r => r.get(`game:${id}`))
    if (!game) {
      throw new ApiError(404, `Game with ID '${id}' not found`)
    }
    return Game.fromJSON(JSON.parse(game))
  },
  async updateGame (id, updateFn) {
    const newGame = await useRedis(async r => {
      const game = await r.get(`game:${id}`)
      if (!game) {
        throw new ApiError(404, `Game with ID '${id}' not found`)
      }
      const parsedGame = Game.fromJSON(JSON.parse(game))
      const newGame = updateFn(parsedGame)
      await r.setex(`game:${id}`, EXPIRATION_TIME, JSON.stringify(newGame.toJSON()))
      return newGame
    })
    return newGame
  },
  async removeGame (game) {
    await useRedis(async r => {
      assertDelete(await r.del(`game:${game.id}`), `del failed for game '${game.id}'`)
      assertDelete(await r.srem('games', game.id), `srem failed for game '${game.id}'`)
    })
  },
  async getDeck (id) {
    const deck = await useRedis(r => r.get(`deck:${id}`))
    return JSON.parse(deck)
  },
  async createDeck ({ id, host, data }) {
    await useRedis(r => r.setex(`deck:${id}`, EXPIRATION_TIME, JSON.stringify({ host, data })))
  },
  async removeDeck (id) {
    await useRedis(async r => {
      assertDelete(await r.del(`deck:${id}`), `del failed for deck '${id}'`)
    })
  }
}

module.exports = { db, ApiError }
