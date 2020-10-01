export default {
  api: process.env.NODE_ENV === 'production'
    ? 'https://cards-against-api-socket.herokuapp.com'
    : 'http://localhost:5000',
  NAME_KEY: 'cards-against-username',
  DATA_KEY: 'cards-against-data',
  TUTORIAL_KEY: 'cards-against-tutorial',
  rotationOptions: [
    { value: 'winner', label: 'El ganador de la ultima ronda' },
    { value: 'next-in-list', label: 'El siguiente jugador de la lista' }
  ]
}