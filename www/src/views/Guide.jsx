import Button from '@/components/Button'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Guide() {
  const navigate = useNavigate()
  return (
    <div className="space-y-4 max-w-prose mx-auto py-8 px-4 text-lg">
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
      <h3 className="text-3xl font-medium ">¿Cómo se juega?</h3>
      <p>
        En cada ronda se muestra una carta negra en el centro de la pantalla. Un jugador es el Juez de las Cartas,
        encargado de esta carta, y los demás jugadores deben enviar sus cartas blancas para completar la frase escrita
        en la carta negra. El objetivo del juego es hacer la frase más graciosa e irreverente combinando cartas negras y
        blancas. Cada jugador puede ver el rol que le corresponde, el nombre que ha elegido y los puntos que tiene
        actualmente en la esquina superior izquierda de la pantalla
      </p>
      <p>
        Para enviar una carta blanca, cada jugador pulsa sobre una carta en su mano y despues pulsa el botón{' '}
        <em>Elegir esta carta</em>
      </p>
      <p>
        Puede darse el caso de que una carta negra requiera de dos cartas blancas para completarse, en este caso el
        boton <em>Elegir esta carta</em> aparecerá tras haber elegido dos cartas de tu mano. Para este caso, la carta
        que selecciones primero será la que primero se le muestre al Juez de las Cartas.
      </p>
      <p>
        Al principio de la ronda, además de enviar una de sus cartas, cada jugador tiene la opción de descartar una
        carta blanca para obtener otra nueva en su lugar
      </p>
      <p>
        Cuando todos los jugadores hayan enviado sus cartas, el Juez de las Cartas las irá revelando una a una pulsando
        sobre ellas.
      </p>
      <p>
        Cuando todas las cartas estén reveladas, el Juez de las Cartas deberá escoger la carta o cartas ganadoras. El
        jugador que haya enviado la carta o cartas ganadoras será recompensado con un punto.
      </p>
    </div>
  )
}
