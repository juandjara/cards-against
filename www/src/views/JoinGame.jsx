import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import Button from '@/components/Button'
import { useParams } from 'react-router-dom'
import { Copy, StackSimple } from 'phosphor-react'
import PrimaryButton from '@/components/PrimaryButton'

export default function JoinGame() {
  const navigate = useNavigate()
  const { id } = useParams()

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
      <h2 className="mt-4 text-3xl font-semibold">Unirse a partida</h2>
      <p className="mb-8 text-2xl text-gray-300 uppercase">ID {id}</p>

      <div className="space-y-8">
        <div>
          <p className="ml-1 mb-1 text-sm text-gray-200 font-medium">
            Enlace para compartir
          </p>
          <div className="flex">
            <pre className="py-2 pl-3 px-5 -mr-2 bg-white text-gray-700 rounded-l-md">
              <code>{window.location.href}</code>
            </pre>
            <Button
              title="Copiar enlace"
              className="rounded-r-md"
              backgroundColor="bg-white"
              textColor="text-gray-500 hover:text-blue-500"
              padding="p-2"
            >
              <Copy width={24} height={24} />
            </Button>
          </div>
        </div>
        <div>
          <p className="ml-1 text-sm text-gray-200 font-medium">Jugadores</p>
          <ul>
            <li className="flex items-center space-x-2 py-2">
              <StackSimple
                weight="fill"
                className="text-gray-900"
                width={24}
                height={24}
              />
              <span>Juan</span>
              <small>- Anfitrión</small>
            </li>
            <li className="flex space-x-2 py-2">
              <StackSimple
                weight="fill"
                className="text-white"
                width={24}
                height={24}
              />
              <span>Bolet</span>
            </li>
            <li className="flex space-x-2 py-2">
              <StackSimple
                weight="fill"
                className="text-white"
                width={24}
                height={24}
              />
              <span>Fuken</span>
            </li>
          </ul>
        </div>
        <PrimaryButton>Comenzar</PrimaryButton>
        {/* <p>Esperando a que el anfitrión empieze el juego ...</p> */}
      </div>
    </main>
  )
}
