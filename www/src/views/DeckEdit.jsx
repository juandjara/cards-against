import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Input from '@/components/Input'
import GameCard from '@/components/GameCard'
import logo from '@/assets/logo.svg'
import PrimaryButton from '@/components/PrimaryButton'

export default function DeckEdit() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '' })

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
      <h3 className="mb-3 text-3xl font-medium">Editor de mazos</h3>
      <form className="space-y-10 py-6">
        <div className="max-w-xs">
          <Input id="name" label="Título" />
        </div>
        <div className="space-y-8">
          <p className="text-xl border-b border-white pb-2">Cartas</p>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <img src={logo} width={36} height={36} alt="logo" />
              <span className="text-lg font-semibold">
                Blancas - <span className="text-sm font-bold">64</span>
              </span>
            </div>
            <ul className="flex flex-wrap -mx-2">
              <li>
                <GameCard className="m-2" type="white" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="white" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="white" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="white" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="white" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="white" text="Lorem ipsum dolor sit amet" />
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <img src={logo} width={36} height={36} alt="logo" />
              <span className="text-lg font-semibold">
                Negras - <span className="text-sm font-bold">10</span>
              </span>
            </div>
            <ul className="flex flex-wrap -mx-2">
              <li>
                <GameCard className="m-2" type="black" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="black" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="black" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="black" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="black" text="Lorem ipsum dolor sit amet" />
              </li>
              <li>
                <GameCard className="m-2" type="black" text="Lorem ipsum dolor sit amet" />
              </li>
            </ul>
          </div>
        </div>
        <div className="border-b border-white my-8" />
        <PrimaryButton>Guardar</PrimaryButton>
      </form>
    </Container>
  )
}
