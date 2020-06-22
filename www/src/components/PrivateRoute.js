import React from 'react'
import NameSelect from '../pages/NameSelect'
import useGlobalSlice from '../services/useGlobalSlice'

export default function PrivateRoute ({ as: Comp, ...props }) {
  const [currentUser] = useGlobalSlice('currentUser')
  return currentUser 
    ? <Comp {...props} />
    : <NameSelect />
}
