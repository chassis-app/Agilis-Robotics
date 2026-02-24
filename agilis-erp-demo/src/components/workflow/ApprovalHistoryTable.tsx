import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { ApprovalStep } from '@/types'
import type { DocumentStatus } from '@/types'

interface ApprovalHistoryTableProps {
  steps: ApprovalStep[]
  className?: string
}

function decisionToStatus(decision: ApprovalStep['decision']): DocumentStatus {
  switch (decision) {
    case 'approved':
      return 'approved'
    case 'rejected':
      return 'rejected'
    case 'pending':
      return 'in_approval'
    default:
      return 'draft'
  }
}

export function ApprovalHistoryTable({ steps, className }: ApprovalHistoryTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-4 py-3 text-left font-medium text-neutral-600 w-16">Step</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-600">Approver</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-600">Role</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-600">Decision</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-600">Comment</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-600">Timestamp</th>
            <th className="px-4 py-3 text-left font-medium text-neutral-600 w-24">Signature</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr
              key={step.id}
              className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              <td className="px-4 py-3 text-neutral-900 font-medium">{step.step}</td>
              <td className="px-4 py-3 text-neutral-900">{step.approverName}</td>
              <td className="px-4 py-3 text-neutral-500">{step.role}</td>
              <td className="px-4 py-3">
                {step.decision ? (
                  <StatusBadge status={decisionToStatus(step.decision)} locale="en" />
                ) : (
                  <span className="text-neutral-400 text-xs">--</span>
                )}
              </td>
              <td className="px-4 py-3 text-neutral-600 max-w-[240px] truncate">
                {step.comment || <span className="text-neutral-300">--</span>}
              </td>
              <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                {step.timestamp ? formatDateTime(step.timestamp) : '--'}
              </td>
              <td className="px-4 py-3">
                {step.verified ? (
                  <span className="inline-flex items-center gap-1 text-success-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-medium">Verified</span>
                  </span>
                ) : step.signatureHash ? (
                  <span className="inline-flex items-center gap-1 text-warning-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Signed</span>
                  </span>
                ) : (
                  <span className="text-neutral-300 text-xs">--</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
