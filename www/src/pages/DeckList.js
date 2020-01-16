import React from 'react'
import styled from 'styled-components'
import Button from '../components/Button'

const DeckListStyles = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      margin: 12px 0;
    }
  }
`

export default function DeckList () {
  return (
    <DeckListStyles>
      <header>
        <h2>Mis cartas</h2>
        <Button>Crear mazo</Button>
      </header>
      <p>No tienes ningún mazo aún</p>
    </DeckListStyles>
  )
}
