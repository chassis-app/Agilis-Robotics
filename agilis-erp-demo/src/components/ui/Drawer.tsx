import { Fragment, type ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  wide?: boolean
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({ open, onClose, title, wide = false, children, footer }: DrawerProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-30">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel
              className={cn(
                'h-full bg-white shadow-lg flex flex-col w-full',
                wide ? 'max-w-[640px]' : 'max-w-[480px]',
              )}
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
                  <DialogTitle className="text-base font-semibold text-neutral-900">{title}</DialogTitle>
                  <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
              {footer && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 shrink-0">
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
