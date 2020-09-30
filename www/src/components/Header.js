import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import useGlobalSlice from '../services/useGlobalSlice'
import IconCog from './icons/IconCog'
import IconArrowLeft from './icons/IconArrowLeft'
import Localise from "./Localise";

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
      margin-right: 4px;
      border-radius: 8px;
      height: 32px;
      color: var(--colorHigh);
      transition: background-color 0.25s;

      &:hover, &:focus {
        background-color: white;
      }

      &.home {
        padding: 0;
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
      <h1><Localise node="general.app_name" /></h1>
      {currentUser && (
        <div className="right">
          <Link to="/" className="link home" title="Menu principal" aria-label="Menu principal">
            <IconArrowLeft width="32" height="32" />
          </Link>
          <Link to="/settings" className="link settings" title="Ajustes" aria-label="Ajustes">
            <IconCog />
          </Link>
          <p className="username">{currentUser.name}</p>
        </div>
      )}
    </HeaderStyles>
  )
}
