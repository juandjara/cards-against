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

io.on('connection', socket => {
  userSocketHandler(socket, io)
})

app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description
  })
})

function getRooms () {
  const rooms = io.sockets.adapter.rooms
  return Object.keys(rooms)
    .filter(key => key.startsWith('public-'))
    .map(key => {
      const r = rooms[key]
      return {
        name: key.replace('public-', ''),
        users: Object.keys(r.sockets)
      }
    })
}

app.get('/rooms', (req, res) => {
  res.json(getRooms())
})

app.get('/rooms/:room/', (req, res) => {
  const roomname = req.params.room
  const room = getRooms().find(r => r.name === roomname)
  if (!room) {
    res.status(404).json({ error: `room '${roomname}' not found` })
  } else {
    res.json(room)
  }
})

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
