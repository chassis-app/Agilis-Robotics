import { Fragment, type ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeMap = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[960px]',
} as const

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: keyof typeof sizeMap
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, size = 'md', children, footer }: ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-40">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={cn(
                'w-full rounded-lg bg-white shadow-lg flex flex-col max-h-[85vh]',
                sizeMap[size],
              )}
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                  <DialogTitle className="text-base font-semibold text-neutral-900">{title}</DialogTitle>
                  <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
              {footer && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
                  {footer}
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
