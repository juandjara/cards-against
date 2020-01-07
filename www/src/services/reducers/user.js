export default function userReducer (state = [], action) {
  switch (action.type) {
    case 'add':
      if (state.find(u => u.id === action.payload.id)) {
        return state.map(u => u.id === action.payload.id ? action.payload : u)
      }
      return state.concat(action.payload)
    case 'remove':
      return state.filter(u => u.id !== action.payload)
    default:
      return state
  }
}