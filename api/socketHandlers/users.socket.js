module.exports = function (socket, io) {
  const { name } = socket.handshake.query
  socket.on('disconnect', () => {
    socket.broadcast.emit('user:left', socket.id)
  })
  socket.on('user:join', ({ name, room }) => {
    const roomId = `public-${room}`
    socket.join(roomId, () => {
      io.to(roomId).emit('user:joined', { id: socket.id, name, roomId })
    })
  })
  socket.on('user:id-request', (callback) => callback({ id: socket.id, name }))
  socket.on('user:list-request', room => {
    socket.to(room).emit('user:list-request', socket.id)
  })
  socket.on('user:list-response', ({ receiver, sender }) => {
    socket.to(receiver).emit('user:list-response', ({ ...sender, id: socket.id }))
  })
}