module.exports = function (socket, io, db) {
  const { name } = socket.handshake.query
  socket.on('user:id-request', (callback) => callback({ id: socket.id, name }))
  socket.on('game:create', gamedata => {
    const game = db.createGame({ ...gamedata, owner: socket.id })
    socket.emit('game:created', game)
  })
  socket.on('user:join', ({game, user}) => {
    const room = `game-${game}`
    socket.join(room, () => {
      try {
        db.addPlayer(game, user)
        socket.to(room).emit('user:joined', user)
      } catch (err) {
        console.error(`[users.socket.js] error joining ${game}: `, err)
        socket.to(socket.id).emit('error', err)
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