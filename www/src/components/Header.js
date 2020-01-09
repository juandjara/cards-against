import React from 'react'
import styled from 'styled-components'

const HeaderStyles = styled.header`
  text-align: center;
  h1 {
    margin: 0;
    padding: 1rem;
  }
`

export default function Header () {
  return (
    <HeaderStyles>
      <h1>Cards Against Web</h1>
    </HeaderStyles>
  )
}
