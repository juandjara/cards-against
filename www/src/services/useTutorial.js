import { useState, useEffect } from "react";
import config from '../config'

export default function useTutorial (key) {
  const initial = JSON.parse(localStorage.getItem(config.TUTORIALS_KEY) || '{}')
  const [flags, setFlags] = useState(initial)

  useEffect(() => {
    localStorage.setItem(config.TUTORIALS_KEY, JSON.stringify(flags))
  }, [flags])

  // NOTE: tutorial flags are active by default
  const flag = flags[key] === false ? false : true
  const setFlag = (value) => setFlags({ ...flags, [key]: value })

  return [flag, setFlag]
}
