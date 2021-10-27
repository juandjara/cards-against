import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import RadioGroup from '@/components/RadioGroup'
import CheckboxGroup from '@/components/CheckboxGroup'
import PrimaryButton from '@/components/PrimaryButton'
import { Stack } from 'phosphor-react'
import { useSocket } from '@/lib/SocketProvider'
import loadAllDecks from '@/lib/loadAllDecks'
import Container from '@/components/Container'
import { motion } from 'framer-motion'
import constants from '@/www.constants'
const { ROTATE_NEXT, ROTATE_WINNER, WIN_ALL_CARDS, WIN_N_ROUNDS, WIN_N_POINTS, MIN_BLACK_CARDS, MIN_WHITE_CARDS } =
  constants

const ROTATION_OPTIONS = [
  {
    value: ROTATE_NEXT,
    label: 'El siguiente jugador de la lista (vamos rotando)'
  },
  { value: ROTATE_WINNER, label: 'El ganador de la ultima ronda' }
]

function CheckboxLabel({ label, numblack = 5, numwhite = 24 }) {
  return (
    <div className="space-y-2">
      <p className="mr-6">{label}</p>
      <div className="mr-4 inline-flex space-x-2">
        <Stack weight="fill" className="text-gray-900" width={24} height={24} />
        <span>{numblack}</span>
      </div>
      <div className="mr-4 inline-flex space-x-2">
        <Stack weight="fill" className="text-white" width={24} height={24} />
        <span>{numwhite}</span>
      </div>
    </div>
  )
}

export default function CreateGame() {
  const navigate = useNavigate()
  const socket = useSocket()
  const [isPublic, setIsPublic] = useState(false)
  const [rotation, setRotation] = useState(ROTATE_NEXT)
  const [winCondition, setWinCondition] = useState(WIN_ALL_CARDS)
  const [nRounds, setNRounds] = useState(5)
  const [nPoints, setNPoints] = useState(5)
  const [deckSelection, setDeckSelection] = useState([])
  const [deckOptions, setDeckOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const mergedDeck = useMemo(() => {
    return deckOptions
      .filter(deck => deckSelection.indexOf(deck.id) !== -1)
      .reduce(
        (acum, next) => {
          return {
            name: [acum.name, next.name].filter(Boolean).join(', '),
            whiteCards: acum.whiteCards.concat(next.whiteCards),
            blackCards: acum.blackCards.concat(next.blackCards)
          }
        },
        {
          name: null,
          blackCards: [],
          whiteCards: []
        }
      )
  }, [deckOptions, deckSelection])

  const cardsNumOk = mergedDeck.whiteCards.length >= MIN_WHITE_CARDS && mergedDeck.blackCards.length >= MIN_BLACK_CARDS

  useEffect(() => {
    loadAllDecks().then(decks => {
      const deckOptions = decks.map(deck => ({
        ...deck,
        value: deck.id,
        label: <CheckboxLabel numblack={deck.blackCards.length} numwhite={deck.whiteCards.length} label={deck.name} />
      }))
      setDeckOptions(deckOptions)
    })
  }, [])

  function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)

    socket.emit('game:new', {
      deck: mergedDeck,
      rotation,
      winCondition,
      maxPoints: nPoints,
      maxRounds: nRounds,
      isPublic
    })

    socket.once('game:new', game => {
      setLoading(false)
      navigate(`/join/${game.id}`)
    })
  }

  const winConditionOptions = [
    { value: WIN_ALL_CARDS, label: 'Cuando se acaben todas las cartas negras' },
    {
      value: WIN_N_ROUNDS,
      label: (
        <>
          <span>Cuando se acaben</span>
          <input
            type="number"
            className="w-20 mx-2 rounded-md text-gray-700"
            value={nRounds}
            onChange={ev => setNRounds(ev.target.value)}
          />
          <span>rondas</span>
        </>
      )
    },
    {
      value: WIN_N_POINTS,
      label: (
        <>
          <span>Cuando un jugador gane</span>
          <input
            type="number"
            value={nPoints}
            className="w-20 mx-2 rounded-md text-gray-700"
            onChange={ev => setNPoints(ev.target.value)}
          />
          <span>puntos</span>
        </>
      )
    }
  ]

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button
          padding="p-2"
          className="rounded-full hover:shadow-md"
          backgroundColor="bg-white hover:bg-blue-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <h2 className="mt-4 mb-8 text-3xl font-semibold">Nueva partida</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <RadioGroup
            label="¿Como se elige al juez de las cartas?"
            name="rotation"
            selected={rotation}
            options={ROTATION_OPTIONS}
            onChange={setRotation}
          />
          <RadioGroup
            label="¿Cuando se acaba el juego?"
            name="win-condition"
            options={winConditionOptions}
            selected={winCondition}
            onChange={setWinCondition}
          />
          <div>
            <label className="flex items-start p-2 pl-1">
              <input
                type="checkbox"
                name="public"
                checked={isPublic}
                onChange={ev => setIsPublic(ev.target.checked)}
                className="h-5 w-5 text-blue-500 rounded-sm"
              />
              <span className="ml-3 text-white font-medium">Pública</span>
            </label>
            <p className="block ml-1 mb-2 text-sm text-gray-200 font-medium">
              Si marcas esta opción la partida aparecerá en el menú <em>Unirse a una partida</em>
            </p>
          </div>
          <div className="relative">
            <Link
              className="absolute top-0 right-1 text-sm text-blue-300 hover:text-blue-200 transition-colors"
              to="/decks/new"
            >
              Crear mazo
            </Link>
            <CheckboxGroup
              label="Mazos de cartas"
              className="w-52"
              options={deckOptions}
              selected={deckSelection}
              onChange={setDeckSelection}
            />
          </div>
          <div className="flex items-center space-x-3">
            <PrimaryButton className="flex-shrink-0" disabled={loading || !cardsNumOk} type="submit">
              Crear partida
            </PrimaryButton>
            {cardsNumOk ? null : (
              <p className="text-sm">
                Se necesitan un mínimo de {MIN_BLACK_CARDS} cartas negras y {MIN_WHITE_CARDS} cartas blancas para
                empezar una partida
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </Container>
  )
}
