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

io.on('connection', socket => {
  console.log('new client connected')
  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
