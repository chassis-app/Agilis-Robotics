import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

interface KPICardProps {
  label: string
  value: string
  change: string
  changeType: 'up' | 'down' | 'neutral'
  icon: ReactNode
}

const changeConfig = {
  up: {
    color: 'text-success-600',
    bgColor: 'bg-success-50',
    Icon: TrendingUp,
  },
  down: {
    color: 'text-danger-500',
    bgColor: 'bg-danger-50',
    Icon: TrendingDown,
  },
  neutral: {
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-100',
    Icon: Minus,
  },
} as const

export function KPICard({ label, value, change, changeType, icon }: KPICardProps) {
  const { color, bgColor, Icon: ChangeIcon } = changeConfig[changeType]

  return (
    <Card className="relative">
      <div className="absolute top-4 right-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-50 text-primary-600">
          {icon}
        </div>
      </div>

      <div className="pr-14">
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
        <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-medium', color)}>
          <span className={cn('inline-flex items-center justify-center h-4 w-4 rounded-full', bgColor)}>
            <ChangeIcon className="h-3 w-3" />
          </span>
          {change}
        </div>
      </div>
    </Card>
  )
}
