const context = import.meta.glob('../assets/*.json')

export default async function loadAllDecks() {
  const promises = Object.keys(context).map(key => context[key]())
  return Promise.all(promises)
}
