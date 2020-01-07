import user from './user'

function combineReducers (reducers) {
  return function (state, action) {
    const newState = {}
    for (const key in reducers) {
      if (reducers.hasOwnProperty(key)) {
        const reducer = reducers[key]
        newState[key] = reducer(state[key], action)
      }
    }
    return newState
  }
}

const rootReducer = combineReducers({ user })
export default rootReducer
