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
  }
`

export default function Header () {
  return (
    <HeaderStyles>
      <Link to="/">
        <h1>Cards Against Web</h1>
      </Link>
    </HeaderStyles>
  )
}
