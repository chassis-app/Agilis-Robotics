import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface BulkAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

interface BulkActionBarProps {
  selectedCount: number
  actions: BulkAction[]
}

export function BulkActionBar({ selectedCount, actions }: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 flex items-center justify-between',
        'px-4 py-3 bg-white border-t border-neutral-200 shadow-lg',
      )}
    >
      <span className="text-sm font-medium text-neutral-700">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>

      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant || 'secondary'}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
