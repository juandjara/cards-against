import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import config from '../config'
import useGlobalSlice from '../services/useGlobalSlice'
import { Link } from '@reach/router'
import Player from '../components/Player'
import Button from '../components/Button'

import IconArrowLeft from '../components/icons/IconArrowLeft'
import {useTranslations} from "../components/Localise";

const WaitRoomStyles = styled.div`
  padding: 1rem 0;
  max-width: 960px;
  margin: 0 auto;

  .label {
    font-size: 12px;
    color: var(--colorMidHigh);
    margin-bottom: 4px;
  }

  section {
    margin-top: 32px;
  }

  .game-id {
    font-family: var(--fontDisplay), sans-serif;
    font-size: 32px;
    line-height: 36px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .players {
    margin-top: 8px;
    margin-bottom: 32px;
  }
`

function Loading () {
  return (
    <WaitRoomStyles className="wait-room loading">
      <h2 className="center">Cargando...</h2>
    </WaitRoomStyles>
  )
}

function NoGame ({ id }) {
  const {getTranslation} = useTranslations()
  return (
    <WaitRoomStyles className="wait-room no-game">
      <h2 className="heading center" dangerouslySetInnerHTML={{__html: getTranslation("error.no_game_code", {code: id})}}/>
      <Link to="/" className="back">
        <IconArrowLeft width="20" height="20" />
        <span>{getTranslation("buttons.back_to_main")}</span>
      </Link>
    </WaitRoomStyles>
  )
}

export default function WaitRoom ({ navigate, gameId }) {
  const [socket] = useGlobalSlice('socket')
  const [currentUser, setCurrentUser] = useGlobalSlice('currentUser')
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const {getTranslation} = useTranslations()
  const rotation = game && config.rotationOptions.find(opt => opt.value === game.rotation)
  const playerIsReader = game && game.round.reader === currentUser.id

  function startGame (replace = false) {
    navigate(`/game/${gameId}`, { replace })
  }

  async function fetchGame () {
    setLoading(true)
    const res = await fetch(`${config.api}/games/${gameId}`)
    const data = await res.json()
    if (res.ok) {
      if (data.shuffled) {
        startGame(true)
      }
      setGame(data)
      if (!currentUser.game) {
        socket.emit('game:join', { gameId, user: currentUser })
        setCurrentUser({ ...currentUser, game: gameId })
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGame()
    socket.on('game:edit', game => {
      setGame(game)
    })
    return () => {
      socket.off('game:edit')
    }
    // eslint-disable-next-line
  }, [socket])

  if (loading) return <Loading />
  if (!loading && !game) return <NoGame id={gameId} />

  return (
    <WaitRoomStyles>
      <h2 className="heading">{getTranslation("views.wait_room.title")}</h2>
      <section>
        <p className="label">{getTranslation("views.wait_room.game_code")}</p>
        <p className="game-id">{gameId}</p>
      </section>
      <section>
        <p className="label">{getTranslation("views.wait_room.chosen_deck")}</p>
        <p className="value">{game.deck.name}</p>
      </section>
      <section>
        <p className="label">{getTranslation("views.wait_room.player_rotation")}</p>
        <p className="value">{getTranslation(rotation.label)}</p>
      </section>
      <section>
        <p className="label">{getTranslation("general.players")}</p>
        <ul className="players">
          {game.players.map(p => (
            <Player as="li" key={p.id} player={p} readerId={game.round.reader} />
          ))}
        </ul>
      </section>
      {playerIsReader && (
        <Button className="big" onClick={() => startGame(false)}>{getTranslation("buttons.start")}</Button>
      )}
    </WaitRoomStyles>
  )
}
