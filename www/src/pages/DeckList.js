import React from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import { Link } from '@reach/router'
import useDecks from '../services/useCards'

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
  const [_decks] = useDecks()
  const decks = Object.values(_decks)
  return (
    <DeckListStyles>
      <header>
        <h2>Mis cartas</h2>
        <Link to="/decks/new">
          <Button>Crear mazo</Button>
        </Link>
      </header>
      {decks.length === 0 ? (
        <p>No tienes ningún mazo aún</p>
      ) : (
        <ul>
          {decks.map(d => (
            <li key={d.id}>
              <Link to={`/decks/${d.id}`}>{d.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </DeckListStyles>
  )
}
