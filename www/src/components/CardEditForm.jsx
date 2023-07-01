import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from './Input'
import PrimaryButton from './PrimaryButton'
import Button from './Button'

export default function CardEditForm({ type, card, onEdit, onClose }) {
  const [text, setText] = useState(card ? card.text || card : '')
  const [pick, setPick] = useState(card ? card.pick : 1)
  const [error, setError] = useState()

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!text) {
      setError('El texto de la carta no puede estar vacio')
      return
    }
    if (type === 'black' && pick < 1) {
      setError('El número de espacios en blanco no puede ser menor a 1')
      return
    }
    if (type === 'black' && pick > 3) {
      setError('El número de espacios en blanco no puede ser mayor a 3')
      return
    }

    onEdit({ text, pick })
    setText('')
    setPick(1)
  }

  return (
    <motion.form
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onSubmit={handleSubmit}
      className="bg-gray-200 bg-opacity-50 p-3 rounded-t-md fixed bottom-0 inset-x-0 max-w-screen-md mx-auto"
    >
      <div className="flex flex-col items-start gap-4">
        {type === 'black' && (
          <div className="w-36">
            <Input
              id="pick"
              type="number"
              label="Espacios en blanco"
              value={pick}
              onChange={ev => setPick(ev.target.value)}
              min={1}
              max={3}
              required
            />
          </div>
        )}
        <Input
          as="textarea"
          id="text"
          type="text"
          value={text}
          rows={3}
          placeholder={type === 'white' ? 'Texto de la carta' : 'Texto de la carta (con espacios en blanco)'}
          className="w-full max-w-md resize-none"
          onChange={ev => setText(ev.target.value)}
          required
        />
        <div className="mt-3 flex items-center gap-3">
          <PrimaryButton type="submit">Guardar</PrimaryButton>
          <Button type="button" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </motion.form>
  )
}
