const http = require("http")
const express = require("express")
const socketIo = require("socket.io")
const pkg = require('./package.json')

const port = process.env.PORT || 5000
const app = express()
const httpServer = http.createServer(app)
const io = socketIo(httpServer)

app.get('/', (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description
  })
})

app.get('/rooms', (req, res) => {
  res.json(io.sockets.adapter.rooms)
})

app.get('/rooms/:room/', (req, res) => {
  const roomname = req.params.room
  const room = io.sockets.adapter.rooms[roomname]
  if (!room) {
    res.status(404).json({ error: `room '${roomname}' not found` })
  } else {
    res.json(room)
  }
})

io.on('connection', socket => {
  console.log('new client connected')
  const {name, room} = socket.handshake.query
  if (room) {
    socket.join(room)
    io.to(room).emit('user:joined', { id: socket.id, name, room })
  }

  socket.on('disconnect', () => {
    console.log('client disconnected')
    socket.broadcast.emit('user:left', socket.id)
  })
  socket.on('user:list-request', room => {
    socket.to(room).emit('user:list-request', socket.id)
  })
  socket.on('user:list-response', ({ receiver, sender }) => {
    socket.to(receiver).emit('user:list-response', ({ ...sender, id: socket.id }))
  })
})

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
