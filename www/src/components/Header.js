import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { useGlobalState } from '../GlobalState'
import config from '../config'

const HeaderStyles = styled.header`
  text-align: center;
  h1 {
    margin: 0;
    padding: 1rem;
  }
  a {
    color: inherit;
    text-decoration: none;
    outline: 0;
    &::-moz-focus-inner {
      outline: 0;
      border: none;
    }
    &:focus {
      text-decoration: underline;
      text-decoration-color: blue;
    }
  }
  .user {
    position: absolute;
    top: 0;
    right: 0;
  }
`

export default function Header () {
  const { currentUser, setCurrentUser } = useGlobalState()

  function logout () {
    localStorage.removeItem(config.NAME_KEY)
    setCurrentUser(null)
  }

  return (
    <HeaderStyles>
      <h1>
        <Link to="/">Cards Against Web</Link>
      </h1>
      {currentUser && (
        <div className="user">
          <span>{currentUser.name}</span>
          <button onClick={() => logout()}>X</button>
        </div>
      )}
    </HeaderStyles>
  )
}
