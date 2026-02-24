import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, padding = 'md', hover = false, onClick }: CardProps) {
  const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-6' }
  return (
    <div
      className={cn(
        'bg-white border border-neutral-200 rounded-lg shadow-sm',
        hover && 'hover:shadow-md transition-shadow duration-150 cursor-pointer',
        paddings[padding],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {action}
    </div>
  )
}
