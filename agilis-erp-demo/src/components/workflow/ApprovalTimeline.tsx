import { CheckCircle2, Clock, XCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'
import type { ApprovalStep } from '@/types'

interface ApprovalTimelineProps {
  steps: ApprovalStep[]
  className?: string
}

function StepIcon({ decision }: { decision: ApprovalStep['decision'] }) {
  switch (decision) {
    case 'approved':
      return <CheckCircle2 className="h-8 w-8 text-white" />
    case 'rejected':
      return <XCircle className="h-8 w-8 text-white" />
    case 'pending':
      return <Clock className="h-8 w-8 text-white" />
    default:
      return <Circle className="h-8 w-8 text-neutral-400" />
  }
}

function stepCircleClasses(decision: ApprovalStep['decision']): string {
  switch (decision) {
    case 'approved':
      return 'bg-success-500'
    case 'rejected':
      return 'bg-danger-500'
    case 'pending':
      return 'bg-warning-500'
    default:
      return 'bg-neutral-200'
  }
}

function decisionLabel(decision: ApprovalStep['decision']): string {
  switch (decision) {
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    case 'pending':
      return 'Pending'
    default:
      return 'Waiting'
  }
}

export function ApprovalTimeline({ steps, className }: ApprovalTimelineProps) {
  return (
    <div className={cn('flex items-start overflow-x-auto', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const prevApproved = index > 0 && steps[index - 1].decision === 'approved'

        return (
          <div key={step.id} className="flex items-start flex-shrink-0">
            {/* Step node */}
            <div className="flex flex-col items-center min-w-[120px]">
              {/* Circle */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full',
                  stepCircleClasses(step.decision),
                )}
              >
                <StepIcon decision={step.decision} />
              </div>

              {/* Info below circle */}
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-neutral-900 leading-tight">
                  {step.approverName}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{step.role}</p>
                <p
                  className={cn(
                    'text-xs font-medium mt-1',
                    step.decision === 'approved' && 'text-success-600',
                    step.decision === 'rejected' && 'text-danger-600',
                    step.decision === 'pending' && 'text-warning-600',
                    step.decision === null && 'text-neutral-400',
                  )}
                >
                  {decisionLabel(step.decision)}
                </p>
                {step.timestamp && (
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {formatDateTime(step.timestamp)}
                  </p>
                )}
              </div>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div className="flex items-center h-10 px-1">
                <div
                  className={cn(
                    'w-12 border-t-2',
                    prevApproved || step.decision === 'approved'
                      ? 'border-success-400'
                      : 'border-neutral-300',
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
