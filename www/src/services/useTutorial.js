import { useState, useEffect } from "react";
import config from '../config'

export default function useTutorial () {
  const initial = JSON.parse(localStorage.getItem(config.TUTORIAL_KEY) || false)
  const [flag, setFlag] = useState(initial)

  useEffect(() => {
    localStorage.setItem(config.TUTORIAL_KEY, flag)
  }, [flag])

  return [flag, setFlag]
}
