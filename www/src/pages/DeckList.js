import React from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import { Link } from '@reach/router'

const DeckListStyles = styled.div`
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
        <Link to="/decks/new">
          <Button>Crear mazo</Button>
        </Link>
      </header>
      <p>No tienes ningún mazo aún</p>
    </DeckListStyles>
  )
}
