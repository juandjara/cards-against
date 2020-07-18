module.exports = function (socket, io, db) {
  socket.on('user:id-request', (callback) => callback({
    id: socket.id,
    name: socket.handshake.query.name
  }))

  socket.on('game:new', () => {
    const game = db.createGame(socket.id)
    io.to(socket.id).emit('game:new', game)
  })
  
  socket.on('game:edit', (data) => {
    const room = `game-${data.id}`
    try {
      const game = db.editGame(data)
      io.to(room).emit('game:edit', game)
    } catch (err) {
      console.error(`[users.socket.js] error editing game ${data.id}: `, err)
      io.to(socket.id).emit('error', err)
    }
  })

  socket.on('game:join', ({gameId, user}) => {
    const room = `game-${gameId}`
    socket.join(room, () => {
      try {
        socket.room = room
        const game = db.addPlayer(gameId, user)
        io.to(room).emit('game:edit', game)
      } catch (err) {
        console.error(`[users.socket.js] error joining ${gameId}: `, err)
        io.to(socket.id).emit('error', err)
      }
    })
  })

  socket.on('game:leave', gameId => {
    const room = `game-${gameId}`
    socket.leave(room, () => {
      try {
        const game = db.removePlayer(gameId, socket.id)
        socket.to(room).emit('game:edit', game)
      } catch (err) {
        console.error(`[users.socket.js] error leaving ${gameId}: `, err)
        io.to(socket.id).emit('error', err)
      }
    })
  })

  socket.on('game:shuffle', gameId => {
    const room = `game-${gameId}`
    try {
      const game = db.shuffleGame(gameId)
      io.to(room).emit('game:edit', game)
    } catch (err) {
      console.error(`[users.socket.js] error editing game ${gameId}: `, err)
      io.to(socket.id).emit('error', err)
    }
  })

  socket.on('game:draw-black-card', gameId => {
    const room = `game-${gameId}`
    try {
      const game = db.drawBlackCard(gameId)
      io.to(room).emit('game:edit', game)
    } catch (err) {
      console.error(`[users.socket.js] error editing game ${gameId}: `, err)
      io.to(socket.id).emit('error', err)
    }
  })

  socket.on('game:draw-white-cards', gameId => {
    const room = `game-${gameId}`
    try {
      const game = db.drawWhiteCards(gameId, socket.id)
      io.to(room).emit('game:edit', game)
    } catch (err) {
      console.error(`[users.socket.js] error editing game ${gameId}: `, err)
      io.to(socket.id).emit('error', err)
    }
  })

  socket.on('game:play-white-card', ({ gameId, cardId }) => {
    const room = `game-${gameId}`
    try {
      const game = db.playWhiteCard(gameId, cardId, socket.id)
      io.to(room).emit('game:edit', game)
    } catch (err) {
      console.error(`[users.socket.js] error editing game ${gameId}: `, err)
      io.to(socket.id).emit('error', err)
    }
  })

  socket.on('disconnect', () => {
    try {
      for (const key in db.games) {
        let game = db.games[key]
        if (game.players.some(p => p.id === socket.id)) {
          game = db.removePlayer(key, socket.id)
          io.to(`game-${key}`).emit('game:edit', game)
        }
      }
    } catch (err) {
      console.error(`[users.socket.js] error on disconnect: `, err)
      io.to(socket.id).emit('error', err)
    }
  })
}