import usePlayerId from '@/lib/usePlayerId'
import React, { useState } from 'react'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'
import { motion } from 'framer-motion'

export default function NameEditModal({ game, socket }) {
  const playerId = usePlayerId()
  const player = game.players.find(p => p.id === playerId)
  const [name, setName] = useState(() => `Player ${game.players.length + 1}`)
  const nameIsRepeated = game.players.some(p => p.name === name)

  function handleSubmit(ev) {
    ev.preventDefault()
    socket.emit('game:join', { gameId: game.id, name, playerId })
  }

  return (
    <Modal showCloseButton={false} onClose={() => {}} show={!player} title="Introduce un nombre de usuario">
      <form className="mt-6" onSubmit={handleSubmit}>
        <Input
          labelColor="text-gray-600"
          label="Nombre"
          type="text"
          value={name}
          onChange={ev => setName(ev.target.value)}
          required
        />
        {nameIsRepeated && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 py-2 text-sm">
            Este nombre no esta disponible
          </motion.p>
        )}
        <Button disabled={!name || nameIsRepeated} className="disabled:opacity-50 mt-4" type="submit">
          Enviar
        </Button>
      </form>
    </Modal>
  )
}
