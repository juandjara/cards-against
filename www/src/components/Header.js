import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { useGlobalState } from '../GlobalState'
import config from '../config'
import PersonIcon from './icons/PersonIcon'
import DeckIcon from './icons/DeckIcon'
import CloseIcon from './icons/CloseIcon'
import Button from './Button'
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";

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
  [data-reach-menu-button] {
    position: absolute;
    top: 0;
    right: 0;
    margin: 4px;
    padding: 4px;
    font-weight: bold;
  }
  .menu-toggle {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 8px;
    padding-right: 12px;
    span {
      margin-left: 8px;
    }
  }
`

const MenuListStlyes = styled(MenuList)`
  padding: 12px 0;
  border-radius: 2px;
  .menu-item {
    display: flex;
    align-items: center;
    padding: 6px 16px;
    span {
      margin-left: 8px;
    }
  }
`

const MenuButtonStyles = Button.withComponent(MenuButton)

export default function Header () {
  const { currentUser, setCurrentUser } = useGlobalState()

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
          <MenuButtonStyles className="menu-toggle">
            <PersonIcon />
            <span>{currentUser.name}</span>
          </MenuButtonStyles>
          <MenuListStlyes>
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
