import React, { createContext, useReducer } from 'react'
import reducer from './reducers'

const initialState = {}
export const Context = createContext(initialState)

export default function Store (props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={[ state, dispatch ]}>
      {props.children}
    </Context.Provider>
  )
}

