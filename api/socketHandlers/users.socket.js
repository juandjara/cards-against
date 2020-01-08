module.exports = function (socket) {
  const { name } = socket.handshake.query
  socket.on('disconnect', () => {
    socket.broadcast.emit('user:left', socket.id)
  })
  socket.on('user:join', ({ name, room }) => {
    socket.join(room)
    io.to(room).emit('user:joined', { id: socket.id, name, room })
    io.rooms[room].public = true
  })
  socket.on('user:id-request', () => socket.emit('user:id-response', { id: socket.id, name }))
  socket.on('user:list-request', room => {
    socket.to(room).emit('user:list-request', socket.id)
  })
  socket.on('user:list-response', ({ receiver, sender }) => {
    socket.to(receiver).emit('user:list-response', ({ ...sender, id: socket.id }))
  })
}