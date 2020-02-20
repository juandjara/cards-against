import React from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import { Link } from '@reach/router'
import useDecks from '../services/useCards'
import WhiteCardsIcon from '../components/icons/CardsOutlineIcon'
import BlackCardsIcon from '../components/icons/CardsIcon'

const DeckListStyles = styled.div`
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      margin: 12px 0;
    }
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      padding: 12px 4px;
      & + li {
        border-top: 1px solid #ccc;
      }
      svg {
        margin: 0 8px;
      }
      > span {
        min-width: 30px;
      }
      a {
        margin-left: 8px;
      }
    }
  }
`

export default function DeckList () {
  const [_decks] = useDecks()
  const decks = Object.values(_decks)
  return (
    <DeckListStyles>
      <header>
        <h2>Mis mazos</h2>
        <Link to="/decks/new">
          <Button>Crear mazo</Button>
        </Link>
      </header>
      {decks.length === 0 ? (
        <p>No tienes ningún mazo aún</p>
      ) : (
        <ul>
          {decks.map(d => ({
            ...d,
            no_white: d.cards.filter(c => c.type === 'white').length,
            no_black: d.cards.filter(c => c.type === 'black').length
          })).map(d => (
            <li key={d.id}>
              <BlackCardsIcon /><span>{d.no_black}</span>
              <WhiteCardsIcon /><span>{d.no_white}</span>
              <Link to={`/decks/${d.id}`}>
                {d.name}
              </Link>{' '}
            </li>
          ))}
        </ul>
      )}
    </DeckListStyles>
  )
}
