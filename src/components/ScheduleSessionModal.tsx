'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface SessionModalProps {
  isOpen: boolean
  onClose: () => void
  onMarkSeen: () => void
  session: { id: number; title: string; location?: string }
}

export default function ScheduleSessionModal({ isOpen, onClose, onMarkSeen, session }: SessionModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">{session.title}</Dialog.Title>
                <p className="mb-4 text-sm text-gray-700">Location: {session.location ?? 'TBD'}</p>
                <div className="mt-6 flex justify-end space-x-2">
                  <button type="button" className="rounded-md bg-gray-200 px-4 py-2" onClick={onClose}>Close</button>
                  <button type="button" className="rounded-md bg-primary px-4 py-2 text-white" onClick={onMarkSeen}>Mark Seen</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
