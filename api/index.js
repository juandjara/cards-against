const PORT = process.env.PORT || 5000

const http = require("http")
const express = require("express")
const { Server: SocketServer } = require("socket.io")
const helmet = require('helmet')
const cors = require('cors')
const pkg = require('./package.json')
const { db } = require('./model/db')
// const decks = require('./model/decks')

const app = express()
const httpServer = http.createServer(app)
const io = new SocketServer(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } })

const socketsHandler = require('./sockets')
io.on('connection', socket => {
  socketsHandler(socket, io, db)
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

// app.get('/rooms', (req, res) => {
//   const rooms = [...io.sockets.adapter.rooms.entries()].map(entry => ({
//     key: entry[0],
//     value: [...entry[1]]
//   }))
//   res.json(rooms)
// })

app.get('/games', async (req, res) => {
  try {
    const games = await db.getAll()
    res.json(games)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

app.get('/games/:id', async (req, res) => {
  const id = req.params.id
  try {
    const game = await db.getGame(id)
    res.json(game)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

app.delete('/games/:id', async (req, res) => {
  const id = req.params.id
  try {
    await db.removeGame(id)
    res.json({ message: `Game ${id} deleted` })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// TODO: add global error handler and use this to wrap async functions
function wrapAsync (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
