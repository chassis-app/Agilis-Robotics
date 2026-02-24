import { Pencil, Plus, Trash2, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'
import type { AuditEntry } from '@/types'

interface AuditTrailPanelProps {
  entries: AuditEntry[]
  className?: string
  maxHeight?: string
}

function ActionIcon({ action }: { action: string }) {
  switch (action.toLowerCase()) {
    case 'create':
      return <Plus className="h-4 w-4 text-success-600" />
    case 'update':
      return <Pencil className="h-4 w-4 text-primary-600" />
    case 'delete':
      return <Trash2 className="h-4 w-4 text-danger-600" />
    default:
      return <History className="h-4 w-4 text-neutral-500" />
  }
}

function actionBgClass(action: string): string {
  switch (action.toLowerCase()) {
    case 'create':
      return 'bg-success-100'
    case 'update':
      return 'bg-primary-100'
    case 'delete':
      return 'bg-danger-100'
    default:
      return 'bg-neutral-100'
  }
}

function actionLabel(action: string): string {
  switch (action.toLowerCase()) {
    case 'create':
      return 'Created'
    case 'update':
      return 'Updated'
    case 'delete':
      return 'Deleted'
    default:
      return action
  }
}

export function AuditTrailPanel({ entries, className, maxHeight = '480px' }: AuditTrailPanelProps) {
  if (entries.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8 text-neutral-400 text-sm', className)}>
        No audit trail entries found.
      </div>
    )
  }

  return (
    <div
      className={cn('overflow-y-auto pr-2', className)}
      style={{ maxHeight }}
    >
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-neutral-200" />

        <div className="flex flex-col gap-0">
          {entries.map((entry, index) => {
            const isLast = index === entries.length - 1

            return (
              <div key={entry.id} className="relative flex gap-3 pb-4">
                {/* Icon circle */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                    actionBgClass(entry.action),
                  )}
                >
                  <ActionIcon action={entry.action} />
                </div>

                {/* Content */}
                <div className={cn('flex-1 min-w-0 pt-1', !isLast && 'pb-2')}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-neutral-900">
                      <span className="font-medium">{entry.userName}</span>
                      {' '}
                      <span className="text-neutral-500">{actionLabel(entry.action).toLowerCase()}</span>
                      {entry.field && (
                        <>
                          {' '}
                          <span className="text-neutral-500">field</span>
                          {' '}
                          <code className="px-1 py-0.5 bg-neutral-100 rounded text-xs font-mono text-neutral-700">
                            {entry.field}
                          </code>
                        </>
                      )}
                    </p>
                    <span className="text-xs text-neutral-400 whitespace-nowrap flex-shrink-0">
                      {formatDateTime(entry.timestamp)}
                    </span>
                  </div>

                  {/* Before / After values */}
                  {(entry.oldValue || entry.newValue) && (
                    <div className="mt-1.5 flex items-center gap-2 text-xs">
                      {entry.oldValue && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-danger-50 text-danger-700 line-through">
                          {entry.oldValue}
                        </span>
                      )}
                      {entry.oldValue && entry.newValue && (
                        <span className="text-neutral-400">&rarr;</span>
                      )}
                      {entry.newValue && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-success-50 text-success-700">
                          {entry.newValue}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
