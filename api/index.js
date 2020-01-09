const http = require("http")
const express = require("express")
const socketIo = require("socket.io")
const helmet = require('helmet')
const cors = require('cors')
const pkg = require('./package.json')

const port = process.env.PORT || 5000
const app = express()
const httpServer = http.createServer(app)
const io = socketIo(httpServer, { origins: '*:*' })

const userSocketHandler = require('./socketHandlers/users.socket')

app.use(helmet())
app.use(cors())

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
  userSocketHandler(socket)
})

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
