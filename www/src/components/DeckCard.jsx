import React from 'react'
import { StackSimple } from 'phosphor-react'
import Card from '@/components/Card'

export default function DeckCard({
  id,
  name,
  numwhite = 0,
  numblack = 0,
  ...props
}) {
  return (
    <div className="w-40" {...props}>
      <Card
        type="white"
        text={name}
        br="rounded-sm"
        style={{ boxShadow: '-8px 8px 4px 0 rgba(0,0,0, 50%)' }}
      />
      <div className="flex items-start justify-between pt-1 pr-1">
        <div className="flex space-x-2 py-2">
          <StackSimple
            weight="fill"
            className="text-gray-900"
            width={24}
            height={24}
          />
          <span>{numblack}</span>
        </div>
        <div className="flex space-x-2 py-2">
          <StackSimple
            weight="fill"
            className="text-white"
            width={24}
            height={24}
          />
          <span>{numwhite}</span>
        </div>
      </div>
    </div>
  )
}
