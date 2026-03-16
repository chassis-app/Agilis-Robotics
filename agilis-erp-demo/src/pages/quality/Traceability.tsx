import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowLeftRight, GitBranch, Search } from 'lucide-react'

const workflows = {
  'SO-F-2026-0018': [
    { stage: 'Order Management', docNo: 'SO-F-2026-0018', detail: 'Formal EU order', tone: 'bg-primary-50 text-primary-700' },
    { stage: 'Build Order', docNo: 'BO-F-2026-0012', detail: 'Parent build order', tone: 'bg-warning-50 text-warning-700' },
    { stage: '領料', docNo: 'MWR-I-2026-0015', detail: 'Machining warehouse request', tone: 'bg-neutral-100 text-neutral-700' },
    { stage: '發料', docNo: 'MWC-I-2026-0008', detail: 'Lot deduction confirmed', tone: 'bg-success-50 text-success-700' },
    { stage: 'Internal QC', docNo: 'IQC-2026-0007', detail: 'EU template packet printed', tone: 'bg-info-100 text-info-700' },
  ],
  'ITM-0002': [
    { stage: 'Goods Receipt', docNo: 'GRN-F-2026-0019', detail: 'Incoming lot received', tone: 'bg-primary-50 text-primary-700' },
    { stage: 'Inspection', docNo: 'INS-2026-0010', detail: 'Item check report generated', tone: 'bg-info-100 text-info-700' },
    { stage: 'Goods Return', docNo: 'GRT-F-2026-0007', detail: 'Supplier return raised', tone: 'bg-danger-50 text-danger-700' },
    { stage: 'AP Reconciliation', docNo: 'INV-2026-0008', detail: 'Tax invoice blocked by return', tone: 'bg-warning-50 text-warning-700' },
  ],
}

export default function Traceability() {
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('SO-F-2026-0018')

  const result = useMemo(() => workflows[searchQuery as keyof typeof workflows] ?? workflows['SO-F-2026-0018'], [searchQuery])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{language === 'zh-CN' ? '追溯工作流' : 'Traceability Workflow'}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '可从任何单号、料号、产品号开始，按工作流而非树状结构查看前后链路'
              : 'Start from any document, part, or product number and view the trace as a workflow instead of a tree.'}
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <ArrowLeftRight className="h-4 w-4" />
          {language === 'zh-CN' ? '切换正反向' : 'Switch Direction'}
        </Button>
      </div>

      <Card>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={language === 'zh-CN' ? '输入单号 / 料号 / 产品号...' : 'Enter document / part / product number...'}
            className="h-10 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-neutral-500" />
            <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? '工作流视图' : 'Workflow View'}</h3>
          </div>
        </div>
        <div className="space-y-4 p-4">
          {result.map((step, index) => (
            <div key={`${step.docNo}-${step.stage}`} className="relative pl-10">
              {index < result.length - 1 && <div className="absolute left-4 top-10 h-[calc(100%+8px)] w-px bg-neutral-200" />}
              <div className="absolute left-0 top-4 h-8 w-8 rounded-full border-4 border-white bg-neutral-900" />
              <div className="rounded-2xl border border-neutral-200 p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{step.stage}</p>
                    <p className="mt-1 text-lg font-semibold text-neutral-900 font-mono">{step.docNo}</p>
                    <p className="mt-2 text-sm text-neutral-600">{step.detail}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${step.tone}`}>{step.stage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
