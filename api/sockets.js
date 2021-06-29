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

  handleMessage('game:join', ({ gameId, user }) => {
    const room = `game-${gameId}`
    socket.join(room)
    const game = db.getGame(gameId).addPlayer(user)
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

  handleMessage('game:draw-black-card', (gameId) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).drawBlackCard()
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:draw-white-cards', (gameId) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).drawWhiteCards(socket.id)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:play-white-card', ({ gameId, card }) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).playWhiteCard(card, socket.id)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:reveal-card', ({ gameId, card }) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).revealCard(card)
    io.to(room).emit('game:edit', game)
  })

  handleMessage('game:set-round-winner', ({ gameId, player, whiteCard, blackCard }) => {
    const room = `game-${gameId}`
    const game = db.getGame(gameId).setRoundWinner(player, whiteCard, blackCard)
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
        game = db.getGame(gameid).removePlayer(socket.id)
        io.to(`game-${gameid}`).emit('game:edit', game)
      }
      if (game.players.length === 0) {
        db.removeGame(game)
      }
    }
  })
}
