import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'

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
`

export default function Header () {
  return (
    <HeaderStyles>
      <h1>
        <Link to="/">Cards Against Web</Link>
      </h1>
    </HeaderStyles>
  )
}
