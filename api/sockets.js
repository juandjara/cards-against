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

  handleMessage('game:edit', (data) => {
    const room = `game-${data.id}`
    const game = db.editGame(data)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:join', ({ gameId, user }) => {
    const room = `game-${gameId}`
    socket.join(room)
    const game = db.addPlayer(gameId, user)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:leave', (gameId) => {
    const room = `game-${gameId}`
    socket.leave(room)
    const game = db.removePlayer(gameId, socket.id)
    socket.to(room).emit('game:edit', game)
  })

  handleMessage('game:shuffle', (gameId) => {
    const room = `game-${gameId}`
    const game = db.shuffleGame(gameId)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:draw-black-card', (gameId) => {
    const room = `game-${gameId}`
    const game = db.drawBlackCard(gameId)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:draw-white-cards', (gameId) => {
    const room = `game-${gameId}`
    const game = db.drawWhiteCards(gameId, socket.id)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:play-white-card', ({ gameId, cardId }) => {
    const room = `game-${gameId}`
    const game = db.playWhiteCard(gameId, cardId, socket.id)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:reveal-card', ({ gameId, cardId }) => {
    const room = `game-${gameId}`
    const game = db.revealCard(gameId, cardId)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:set-round-winner', ({ gameId, player, whiteCard, blackCard }) => {
    const room = `game-${gameId}`
    const game = db.setRoundWinner(gameId, player, whiteCard, blackCard)
    socket.to(room).emit('game:show-round-winner', {
      player: game.players.find(p => p.id === player),
      whiteCard: game.deck.cards.find(c => c.id === whiteCard),
      blackCard: game.deck.cards.find(c => c.id === blackCard)
    })
    io.to(room).emit('game:edit', game)
    io.to(room).emit('alert', { text: 'Comienza una nueva ronda' })
  })

  handleMessage('disconnect', () => {
    for (const gameid in db.games) {
      let game = db.games[gameid]
      if (game.players.some(p => p.id === socket.id)) {
        game = db.removePlayer(gameid, socket.id)
        io.to(`game-${gameid}`).emit('game:edit', game)
      }
      if (game.players.length === 0) {
        db.removeGame(game)
      }
    }
  })
}
