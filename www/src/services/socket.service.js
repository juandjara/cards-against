import io from 'socket.io-client'

export default {
  socket: null,
  connect (url) {
    this.socket = io(url)
  }
}
