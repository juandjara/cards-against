export default {
  api:
    process.env.NODE_ENV === 'production' ? 'https://cards-against-api-socket.herokuapp.com' : 'http://localhost:5000'
}
