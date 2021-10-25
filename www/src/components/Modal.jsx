import React, { Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from '@/components/Button'

// partly taken from https://headlessui.dev/react/dialog
export default function Modal({ show, title, children, onClose }) {
  const closeRef = useRef()

  useEffect(() => {
    if (closeRef.current) {
      closeRef.current.focus()
    }
  }, [])

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        initialFocus={closeRef}
        className="text-gray-900 fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-out duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              style={{ minWidth: 300 }}
              className="inline-block max-w-screen-xl p-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </Dialog.Title>
              {children}
              <Button ref={closeRef} onClick={onClose} className="mt-4 block ml-auto">
                Cerrar
              </Button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
