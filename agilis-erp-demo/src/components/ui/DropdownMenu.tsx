import { Fragment, type ReactNode } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface DropdownItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

export function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>{trigger}</MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            'absolute z-10 mt-1 w-48 rounded-md bg-white shadow-md border border-neutral-200 py-1',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, i) => (
            <MenuItem key={i} disabled={item.disabled}>
              {({ focus }) => (
                <button
                  onClick={item.onClick}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm',
                    focus && 'bg-neutral-100',
                    item.danger ? 'text-danger-500' : 'text-neutral-700',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  )
}
