import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import useGlobalSlice from '../services/useGlobalSlice'
import config from '../config'
import IconUser from './icons/IconUser'
import DeckIcon from './icons/DeckIcon'
import CloseIcon from './icons/CloseIcon'
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";

const HeaderStyles = styled.header`
  border-bottom: 1px solid var(--colorModerate);

  h1 {
    margin: 0;
    padding: .5rem 1rem;
    font-family: var(--fontDisplay), sans-serif;
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
    }
  }

  [data-reach-menu-button] {
    position: absolute;
    top: 10px;
    right: 10px;
    margin: 4px;
    padding: 4px;
    font-weight: bold;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding-left: 16px;
    padding-right: 12px;
    border-radius: 4px;
    background: transparent;
    border: none;
    cursor: pointer;
    span {
      margin-right: 12px;
      font-weight: 600;
    }

    &:hover, &:focus {
      /* background-color: hsla(80, 10%, 100%, 0.2); */
      background-color: white;
    }
  }

  @media (max-width: 45rem) {
    h1 {
      font-size: 24px;
    }
    .menu-toggle {
      right: 4px;
      top: 6px;
      padding: 4px;
      span {
        display: none;
      }
    }
  }
`

const MenuListStlyes = styled(MenuList)`
  padding: 12px 0;
  border-radius: 2px;

  .username {
    margin: 0 16px 12px 0;
    text-align: right;
    font-size: 16px;
    font-weight: 600;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 6px 16px;

    span {
      margin-left: 8px;
    }

    &[data-selected] {
      background: var(--colorPrimary);
    }
  }
`

export default function Header () {
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')

  function logout () {
    localStorage.removeItem(config.NAME_KEY)
    setCurrentUser(null)
  }

  return (
    <HeaderStyles>
      <h1>
        <Link to="/">Cartas contra la web</Link>
      </h1>
      {currentUser && (
        <Menu>
          <MenuButton className="menu-toggle">
            <span>{currentUser.name}</span>
            <IconUser />
          </MenuButton>
          <MenuListStlyes>
            <p className="username">{currentUser.name}</p>
            <MenuLink className="menu-item" as={Link} to="/decks">
              <DeckIcon />
              <span>Mis cartas</span>
            </MenuLink>
            <MenuItem className="menu-item" onSelect={() => logout()}>
              <CloseIcon />
              <span>Cerrar sesión</span>
            </MenuItem>
          </MenuListStlyes>
        </Menu>
      )}
    </HeaderStyles>
  )
}
