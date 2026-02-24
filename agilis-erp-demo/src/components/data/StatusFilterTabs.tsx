import { cn } from '@/lib/utils'

interface StatusTab {
  id: string
  label: string
  count: number
}

interface StatusFilterTabsProps {
  statuses: StatusTab[]
  activeStatus: string
  onChange: (statusId: string) => void
}

export function StatusFilterTabs({ statuses, activeStatus, onChange }: StatusFilterTabsProps) {
  const allCount = statuses.reduce((sum, s) => sum + s.count, 0)

  const tabs: StatusTab[] = [
    { id: 'all', label: 'All', count: allCount },
    ...statuses,
  ]

  return (
    <div className="flex items-center gap-0 border-b border-neutral-200 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeStatus
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-100 text-neutral-600',
              )}
            >
              {tab.count}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t" />
            )}
          </button>
        )
      })}
    </div>
  )
}
