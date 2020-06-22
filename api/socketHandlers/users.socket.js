module.exports = function (socket, io, db) {
  socket.on('user:id-request', (callback) => callback({
    id: socket.id,
    name: socket.handshake.query.name
  }))
  socket.on('game:create', gamedata => {
    const game = db.createGame({ ...gamedata, owner: socket.id })
    socket.broadcast.emit('game:created', game)
  })
  socket.on('user:join', ({game, user}) => {
    const room = `game-${game}`
    socket.join(room, () => {
      try {
        db.addPlayer(game, user)
        socket.broadcast.emit('user:joined', {game, user})
      } catch (err) {
        console.error(`[users.socket.js] error joining ${game}: `, err)
        socket.emit('error', err)
      }
    })
  })
  socket.on('user:leave', () => {
    db.removePlayer(socket.id)
    socket.broadcast.emit('user:left', socket.id)
  })
  socket.on('disconnect', () => {
    db.removePlayer(socket.id)
    socket.broadcast.emit('user:left', socket.id)
  })
}