import React from 'react'
import Button from '@/components/Button'
import Container from '@/components/Container'
import { useGameList } from '@/lib/gameUtils'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { useNavigate } from 'react-router'
import { Stack } from 'phosphor-react'
import { Link } from 'react-router-dom'
import constants from '@/www.constants'
const { WIN_ALL_CARDS, WIN_N_ROUNDS, WIN_N_POINTS, ROTATE_WINNER, ROTATE_NEXT } = constants

function getNumRounds(game) {
  if (game.winCondition === WIN_ALL_CARDS) {
    return game.deck.blackCards.length
  }
  if (game.winCondition === WIN_N_ROUNDS) {
    return game.maxRounds
  }
  if (game.winCondition === WIN_N_POINTS) {
    return '?'
  }
}

function getWinConditionLabel(game) {
  if (game.winCondition === WIN_ALL_CARDS) {
    return 'Al terminar todas las cartas negras'
  }
  if (game.winCondition === WIN_N_ROUNDS) {
    return `Al terminar ${game.maxRounds} rondas`
  }
  if (game.winCondition === WIN_N_POINTS) {
    return `Cuando alguien gane ${game.maxPoints} puntos`
  }
}

function getRotationLabel(game) {
  if (game.rotation === ROTATE_NEXT) {
    return 'El que gane la última ronda'
  }
  if (game.rotation === ROTATE_WINNER) {
    return 'El siguiente en la lista'
  }
}

function GameItem({ game }) {
  const label = game.deck.name
  const numwhite = game.deck.whiteCards.length
  const numblack = game.deck.blackCards.length

  return (
    <li className="p-3 border border-gray-300 rounded-md mt-6 hover:shadow-lg">
      <Link to={`/join/${game.id}`} className="space-y-2">
        <p className="mr-6 text-lg">{label}</p>
        <p className="font-semibold text-sm text-gray-100">
          {game.players.length} persona{game.players.length === 1 ? '' : 's'}
          {' · '}Ronda {game.finishedRounds.length + 1} / {getNumRounds(game)}
        </p>
        <div className="pt-2">
          <div className="mr-4 inline-flex space-x-2">
            <Stack weight="fill" className="text-gray-900" width={24} height={24} />
            <span>Negras {numblack}</span>
          </div>
          <div className="mr-4 inline-flex space-x-2">
            <Stack weight="fill" className="text-white" width={24} height={24} />
            <span>Blancas {numwhite}</span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-100 space-y-3">
          <div>
            <p className="text-xs text-gray-300">Rotación del juez de las cartas</p>
            <p>{getRotationLabel(game)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-300">Fin del juego</p>
            <p>{getWinConditionLabel(game)}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default function PublicGames() {
  const navigate = useNavigate()
  const { games } = useGameList()
  const publicGames = games.filter(g => g.isPublic)

  return (
    <Container>
      <div>
        <Button
          padding="p-2"
          className="rounded-full hover:shadow-md mb-4"
          backgroundColor="bg-white hover:bg-blue-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
      </div>
      <h3 className="mb-3 text-3xl font-medium">Partidas públicas</h3>
      {publicGames.length === 0 && (
        <p>
          No hay ninguna partida púublica disponible.{' '}
          <Link className="text-blue-300 hover:text-blue-200 transition-colors" to="/newgame">
            Crear partida
          </Link>
        </p>
      )}
      <ul>
        {publicGames.map(game => (
          <GameItem key={game.id} game={game} />
        ))}
      </ul>
    </Container>
  )
}
