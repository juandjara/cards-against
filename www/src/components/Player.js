import React from 'react'
import styled from 'styled-components'
import WhiteIconCards from '../components/icons/IconWhiteCards'
import BlackIconCards from '../components/icons/IconBlackCards'
import classnames from 'classnames'

const PlayerStyles = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 6px 8px 6px 12px;
  margin: 4px 12px 8px 0;
  max-width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
  box-shadow: 0 2px 4px 0px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: box-shadow 0.25s;

  .name {
    flex-grow: 1;
  }

  .badge {
    margin-left: 8px;
    font-weight: 600;
    text-align: center;
  }

  svg {
    margin-left: 4px;
  }

  &.selectable {
    &:hover, &:focus {
      box-shadow: 0 2px 8px 0px hsla(211, 81%, 36%, 0.2);
    }
  }
`

export default function Player ({ as, player, readerId, selectable, onClick })  {
  return (
    <PlayerStyles as={as}
      onClick={onClick}
      tabIndex={selectable ? '0' : null}
      title={selectable ? 'Pulsa para ver los puntos de este jugador' : null}
      className={classnames('player', { selectable })}>
      <p className="name">{player.name}</p>
      <p className="badge">{player.wins.length}</p>
      {player.id === readerId ? <BlackIconCards /> : <WhiteIconCards />}
    </PlayerStyles>
  )  
}
