import React from 'react'
import Button from './Button'
import { Copy } from 'phosphor-react'
import { useAlert } from './Alert'

export default function CopyLink({ label, link, ...props }) {
  const alert = useAlert()

  function copyLink() {
    navigator.clipboard.writeText(link).then(() => {
      alert({ text: 'Enlace copiado al portapapeles', type: 'success' })
    })
  }

  return (
    <div {...props}>
      <p className="ml-1 mb-1 text-sm text-gray-200 font-medium">{label}</p>
      <div className="flex">
        <pre className="truncate py-2 pl-3 px-5 -mr-2 bg-white text-gray-700 rounded-l-md">
          <code>{link}</code>
        </pre>
        <Button
          title="Copiar enlace"
          className="rounded-r-md"
          backgroundColor="bg-white"
          textColor="text-gray-500 hover:text-blue-500"
          padding="p-2"
          onClick={copyLink}
        >
          <Copy width={24} height={24} />
        </Button>
      </div>
    </div>
  )
}
