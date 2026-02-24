import { cn } from '@/lib/utils'
import type { DocumentStatus } from '@/types'

const statusConfig: Record<DocumentStatus, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  draft: { bg: 'bg-neutral-100', text: 'text-neutral-600', dot: 'bg-neutral-400', label: '草稿', labelEn: 'Draft' },
  submitted: { bg: 'bg-primary-100', text: 'text-primary-700', dot: 'bg-primary-500', label: '已提交', labelEn: 'Submitted' },
  in_approval: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500', label: '审批中', labelEn: 'In Approval' },
  approved: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '已批准', labelEn: 'Approved' },
  rejected: { bg: 'bg-danger-100', text: 'text-danger-700', dot: 'bg-danger-500', label: '已驳回', labelEn: 'Rejected' },
  cancelled: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400', label: '已取消', labelEn: 'Cancelled' },
}

interface StatusBadgeProps {
  status: DocumentStatus
  locale?: 'zh-CN' | 'en'
  className?: string
}

export function StatusBadge({ status, locale = 'zh-CN', className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {locale === 'zh-CN' ? config.label : config.labelEn}
    </span>
  )
}

export { statusConfig }
