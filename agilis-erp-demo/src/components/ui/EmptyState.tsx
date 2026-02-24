import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { InboxIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      <div className="text-neutral-300 mb-4">
        {icon || <InboxIcon className="h-12 w-12" strokeWidth={1} />}
      </div>
      <h3 className="text-base font-medium text-neutral-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 mb-4 text-center max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">{actionLabel}</Button>
      )}
    </div>
  )
}
