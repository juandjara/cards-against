import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { buttonFocusStyle } from './Button'

export default function Select({ options = [], selected, onChange, placeholder, valueKey = 'value', className = '' }) {
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className={`relative ${className}`}>
          <Listbox.Button
            className={`relative h-9 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default sm:text-sm ${buttonFocusStyle}`}
          >
            {selected ? (
              <span className="block truncate">{selected.label}</span>
            ) : (
              <span className="text-gray-500 block truncate">{placeholder}</span>
            )}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute w-full z-10 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {options.map(opt => (
                <Listbox.Option
                  key={opt[valueKey]}
                  value={opt}
                  className={({ active }) =>
                    `${active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'}
                        cursor-default select-none relative py-2 pr-10 pl-4`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{opt.label}</span>
                      {selected ? (
                        <span
                          className={`${active ? 'text-blue-600' : 'text-blue-600'}
                              absolute inset-y-0 right-0 flex items-center pr-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
