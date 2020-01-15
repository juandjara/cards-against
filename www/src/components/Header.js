import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { useGlobalState } from '../GlobalState'
import config from '../config'
import menuIcon from '../assets/person_outline.svg'
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
    display: flex;
    margin: 4px;
    padding: 4px;
    font-weight: bold;
    align-items: center;
    span {
      margin-right: 8px;
    }
    img {
      cursor: pointer;
    }
  }
`

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
          <MenuButton>
            <span>{currentUser.name}</span>
            <img
              title="Cerrar sesión"
              src={menuIcon} alt="logout" />
          </MenuButton>
          <MenuList>
            <MenuLink as={Link} to="/cards">Mis cartas</MenuLink>
            <MenuItem onSelect={() => logout()}>Cerrar sesión</MenuItem>
          </MenuList>
        </Menu>
      )}
    </HeaderStyles>
  )
}
