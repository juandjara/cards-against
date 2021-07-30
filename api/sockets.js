module.exports = function (socket, io, db) {
  function handleMessage (key, listener) {
    socket.on(key, (data) => {
      try {
        listener(data)
      } catch (err) {
        const msg = `error on "${key}" listener: ${err.message}`
        console.error(`[sockets.js] ${msg}`)
        io.to(socket.id).emit('error', msg)
      }
    })
  }

  handleMessage('game:new', (data) => {
    const game = db.createGame(data)
    io.to(socket.id).emit('game:new', game)
  })

  handleMessage('game:edit', ({ id, ...data }) => {
    const room = `game-${id}`
    const game = db.getGame(id).edit(data)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:join', ({ gameId, name }) => {
    const room = `game-${gameId}`
    socket.join(room)
    const game = db.getGame(gameId).addPlayer({ id: socket.id, name })
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:leave', (gameId) => {
    const room = `game-${gameId}`
    socket.leave(room)
    const game = db.getGame(gameId).removePlayer(socket.id)
    socket.to(room).emit('game:edit', game)
  })

  handleMessage('game:start', (gameId) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).start()
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:play-white-cards', ({ gameId, cards }) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).playWhiteCards(cards, socket.id)
    io.to(room).emit('game:edit', game)
    io.to(room).emit('game:cards-played', cards)
  })

  handleMessage('game:discard-white-card', ({ gameId, card }) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).discardWhiteCard(card, socket.id)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:reveal-card', ({ gameId, playerId }) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).revealCard(playerId)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:finish-round', ({ gameId, winnerPlayerId }) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId)
    io.to(room).emit('game:edit', game.finishRound(winnerPlayerId))
    setTimeout(() => {
      io.to(room).emit('game:round-winner', game.getLastFinishedRound())
    }, 500)
  })

  handleMessage('disconnect', () => {
    for (const gameid in db.games) {
      let game = db.games[gameid]
      if (game.players.some(p => p.id === socket.id)) {
        game = db.getGame(gameid).removePlayer(socket.id)
        io.to(`game-${gameid}`).emit('game:edit', game)
      }
      if (game.players.length === 0) {
        db.removeGame(game)
      }
    }
  })
}
