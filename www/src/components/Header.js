import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import useGlobalSlice from '../services/useGlobalSlice'
import IconCog from './icons/IconCog'

const HeaderStyles = styled.header`
  border-bottom: 1px solid var(--colorModerate);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0;
    padding: .5rem 1rem;
    font-family: var(--fontDisplay), sans-serif;
  }

  .right {
    display: flex;
    align-items: center;
    margin-right: 1rem;

    .username {
      font-weight: 600;
      font-size: 14px;
    }

    .link {
      padding: 4px;
      margin-left: 8px;
      border-radius: 8px;
      height: 32px;

      &:hover {
        background-color: white;
      }

      svg {
        fill: var(--colorHigh);
      }
    }
  }

  @media (max-width: 45rem) {
    h1 {
      font-size: 24px;
    }

    .right {
      margin-right: 8px;
    }

    .username {
      display: none;
    }
  }
`

export default function Header () {
  const [currentUser] = useGlobalSlice('currentUser')

  return (
    <HeaderStyles>
      <h1>Cartas contra la web</h1>
      {currentUser && (
        <div className="right">
          <p className="username">{currentUser.name}</p>
          <Link title="Ajustes" aria-label="Ajustes" className="link" to="/settings"><IconCog /></Link>
        </div>
      )}
    </HeaderStyles>
  )
}
