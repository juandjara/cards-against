import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import RadioGroup from '@/components/RadioGroup'
import CheckboxGroup from '@/components/CheckboxGroup'
import PrimaryButton from '@/components/PrimaryButton'
import { StackSimple } from 'phosphor-react'

import defaultSet from '@/assets/CAH-es-set.json'
import gSet from '@/assets/cartas-guardianes.json'

const ROTATION_OPTIONS = [
  {
    value: 'rotation',
    label: 'El siguiente jugador de la lista (vamos rotando)'
  },
  { value: 'winner', label: 'El ganador de la ultima ronda' }
]

const DECK_OPTIONS = [
  {
    label: (
      <CheckboxLabel
        numblack={defaultSet.blackCards.length}
        numwhite={defaultSet.whiteCards.length}
        label={defaultSet.name}
      />
    ),
    value: defaultSet.id
  },
  {
    label: (
      <CheckboxLabel
        numblack={gSet.blackCards.length}
        numwhite={gSet.whiteCards.length}
        label={gSet.name}
      />
    ),
    value: gSet.id
  }
]

function CheckboxLabel({ label, numblack = 5, numwhite = 24 }) {
  return (
    <div className="space-y-2">
      <p className="mr-6">{label}</p>
      <div className="mr-4 inline-flex space-x-2">
        <StackSimple
          weight="fill"
          className="text-gray-900"
          width={24}
          height={24}
        />
        <span>{numblack}</span>
      </div>
      <div className="mr-4 inline-flex space-x-2">
        <StackSimple
          weight="fill"
          className="text-white"
          width={24}
          height={24}
        />
        <span>{numwhite}</span>
      </div>
    </div>
  )
}

export default function NewGameForm() {
  const navigate = useNavigate()
  const [rotation, setRotation] = useState('rotation')
  const [winCondition, setWinCondition] = useState('all-cards')
  const [nRounds, setNRounds] = useState(5)
  const [nPoints, setNPoints] = useState(5)
  const [deck, setDeck] = useState([])

  function handleSubmit(ev) {
    ev.preventDefault()
  }

  const winConditionOptions = [
    { value: 'all-cards', label: 'Cuando se acaben todas las cartas negras' },
    {
      value: 'win-n-rounds',
      label: (
        <>
          <span>Cuando se acaben</span>
          <input
            type="number"
            className="w-20 mx-2 rounded-md text-gray-700"
            value={nRounds}
            onChange={(ev) => setNRounds(ev.target.value)}
          />
          <span>rondas</span>
        </>
      )
    },
    {
      value: 'win-n-points',
      label: (
        <>
          <span>Cuando un jugador gane</span>
          <input
            type="number"
            value={nPoints}
            className="w-20 mx-2 rounded-md text-gray-700"
            onChange={(ev) => setNPoints(ev.target.value)}
          />
          <span>puntos</span>
        </>
      )
    }
  ]

  return (
    <main className="max-w-screen-lg mx-auto py-6 px-4">
      <Button
        padding="p-2"
        className="rounded-full hover:shadow-md"
        backgroundColor="bg-white hover:bg-blue-50"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </Button>
      <h2 className="mt-4 text-3xl font-semibold">Nueva partida</h2>
      <p className="mb-8 text-2xl text-gray-300">ID AX4M</p>
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
        <CheckboxGroup
          label="Mazos de cartas"
          className="w-52"
          options={DECK_OPTIONS}
          selected={deck}
          onChange={setDeck}
        />
        <PrimaryButton type="submit">Crear partida</PrimaryButton>
      </form>
    </main>
  )
}
