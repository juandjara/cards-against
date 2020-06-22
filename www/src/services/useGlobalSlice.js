import { Context } from '../GlobalState'
import { useContext } from 'react'

export default function useGlobalSlice (key) {
  const [context, setContext] = useContext(Context)
  const slice = context[key]
  const setSlice = data => setContext(context => ({ ...context, [key]: data }))
  return [slice, setSlice]
}
