import React from 'react'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import Button from '@/components/Button'
import DeckCard from '@/components/DeckCard'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '@/components/PrimaryButton'

export default function DeckList() {
  const navigate = useNavigate()

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
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Editor de mazos</h2>
        <PrimaryButton>Nuevo mazo</PrimaryButton>
      </div>
      <div className="py-8 flex flex-wrap justify-center items-center">
        <DeckCard
          className="pl-4 pr-4 pb-6"
          name="Mazo 1"
          numblack={5}
          numwhite={20}
        />
        <DeckCard
          className="pl-4 pr-4 pb-6"
          name="Mazo 2"
          numblack={5}
          numwhite={20}
        />
        <DeckCard
          className="pl-4 pr-4 pb-6"
          name="Mazo 3"
          numblack={5}
          numwhite={20}
        />
        <DeckCard
          className="pl-4 pr-4 pb-6"
          name="Mazo 4"
          numblack={5}
          numwhite={20}
        />
        <DeckCard
          className="pl-4 pr-4 pb-6"
          name="Mazo 5"
          numblack={5}
          numwhite={20}
        />
      </div>
    </main>
  )
}
