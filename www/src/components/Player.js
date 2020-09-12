import React from 'react'
import styled from 'styled-components'
import WhiteIconCards from '../components/icons/IconCardsOutline'
import BlackIconCards from '../components/icons/IconCards'
import classnames from 'classnames'

const PlayerStyles = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 6px 8px 6px 12px;
  margin: 4px 12px 8px 0;
  max-width: 160px;
  text-overflow: ellipsis;
  overflow: hidden;
  box-shadow: 0 2px 4px 0px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.25s, box-shadow 0.25s;

  p {
    margin-right: 8px;
    display: flex;
    align-items: center;

    .badge {
      margin-left: 8px;
      color: var(--colorVeryLow);
      background-color: var(--colorMedium);

      border-radius: .5em;
      padding: .25em .4em;
      font-size: 75%;
      font-weight: bold;
      line-height: 1;
      text-align: center;
      vertical-align: baseline;
      white-space: nowrap;
    }
  }

  &.selectable {
    &:hover, &:focus {
      box-shadow: 0 0 8px 4px rgba(0,0,0,0.2);
    }
  }
`

export default function Player ({ as, player, readerId, selectable })  {
  return (
    <PlayerStyles as={as}
      tabIndex={selectable ? '0' : null}
      title={selectable ? 'Pulsa para ver los puntos de este jugador' : null}
      className={classnames('player', { selectable })}>
      <p>
        <span>{player.name}</span>
        {selectable && <span className="badge">{player.wins.length}</span>}
      </p>
      {player.id === readerId ? <BlackIconCards /> : <WhiteIconCards />}
    </PlayerStyles>
  )  
}
