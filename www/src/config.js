export default {
  api: process.env.NODE_ENV === 'production' ? 'https://cards-against.fly.dev' : 'http://localhost:5000'
}
