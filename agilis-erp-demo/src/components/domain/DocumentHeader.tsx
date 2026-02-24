import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { DocumentStatus } from '@/types'

interface DocumentHeaderProps {
  docNo: string
  status: DocumentStatus
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function DocumentHeader({
  docNo,
  status,
  title,
  subtitle,
  actions,
  className,
}: DocumentHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      {/* Left side: doc info */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-neutral-500">{docNo}</span>
          <StatusBadge status={status} locale="en" />
        </div>
        <h1 className="text-xl font-semibold text-neutral-900 leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>

      {/* Right side: action buttons */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  )
}
