import React from 'react'
import Button from './Button'
import { Plus, Trash } from 'phosphor-react'
import { PencilAltIcon, XIcon } from '@heroicons/react/solid'

function handleStopClick(fn) {
  return ev => {
    ev.preventDefault()
    ev.stopPropagation()
    fn()
  }
}

export default function EditTools({ type, selection, onNew, onEdit, onDelete, onClear }) {
  if (selection.length === 0) {
    return (
      <Button
        type="button"
        onClick={handleStopClick(onNew)}
        className="flex items-center space-x-2 pl-2 pr-3 my-2"
        textColor={type === 'black' ? 'text-white' : 'text-black'}
        backgroundColor={type === 'black' ? 'bg-black hover:bg-gray-800' : 'bg-white hover:bg-gray-100'}
      >
        <Plus weight="bold" className="w-4 h-4" />
        <p>Nueva carta</p>
      </Button>
    )
  }

  return (
    <div className="flex space-x-2 items-center my-2" style={{ marginLeft: 0 }}>
      <button
        title="Eliminar selección"
        aria-label="Eliminar selección"
        className="p-1 rounded-xl hover:bg-white hover:bg-opacity-25"
        onClick={handleStopClick(onClear)}
      >
        <XIcon className="w-4 h-4" />
      </button>
      <p className="font-semibold">
        {selection.length} seleccionado{selection.length === 1 ? '' : 's'}
      </p>
      <Button
        type="button"
        onClick={handleStopClick(onEdit)}
        disabled={selection.length > 1}
        className="flex items-center space-x-2 pl-2 pr-3"
      >
        <PencilAltIcon weight="fill" className="w-4 h-4" />
        <p>Editar</p>
      </Button>
      <Button
        type="button"
        onClick={handleStopClick(onDelete)}
        color="red"
        className="flex items-center space-x-2 pl-2 pr-3"
      >
        <Trash weight="fill" className="w-4 h-4" />
        <p>Eliminar</p>
      </Button>
    </div>
  )
}
