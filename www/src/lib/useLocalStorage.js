import { useEffect, useState } from 'react'

function getValue(key) {
  const saved = localStorage.getItem(key)

  // TODO: remove after some time
  if (saved === 'null') {
    localStorage.removeItem(key)
    return null
  }

  try {
    const parsed = JSON.parse(saved)
    return parsed
  } catch (e) {
    return saved
  }
}

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(getValue(key) || defaultValue)

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
