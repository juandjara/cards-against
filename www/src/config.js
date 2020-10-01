export default {
  api: process.env.NODE_ENV === 'production'
    ? 'https://cards-against-api-socket.herokuapp.com'
    : 'http://localhost:5000',
  NAME_KEY: 'cards-against-username',
  DATA_KEY: 'cards-against-data',
  TUTORIAL_KEY: 'cards-against-tutorial',
  LANGUAGE_KEY: 'cards-against-language',
  rotationOptions: [
    { value: 'next-in-list', label: 'rules.next_in_list' },
    { value: 'winner', label: 'rules.last_round_winner' }
  ],
  availableLanguages: [
    {value: 'es', label: 'Español'},
    {value: 'en', label: 'English'},
  ]
}
