import React from 'react'
import { useGlobalState } from '../GlobalState'
import NameSelect from '../pages/NameSelect'

export default function PrivateRoute ({ as: Comp, ...props }) {
  const { currentUser } = useGlobalState()
  return currentUser 
    ? <Comp {...props} />
    : <NameSelect />
}
