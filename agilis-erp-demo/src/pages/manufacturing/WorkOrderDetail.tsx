import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowLeft, ClipboardCheck, ScissorsLineDashed, Warehouse } from 'lucide-react'
import type { DocumentStatus } from '@/types'

const buildOrder = {
  buildOrderNo: 'BO-F-2026-0012',
  status: 'approved' as DocumentStatus,
  sourceOrder: 'SO-F-2026-0018',
  sourceOrderType: 'Formal Sales Order',
  market: 'EU',
  sequenceFamily: 'FORMAL',
  product: '手术机器人整机',
  productEn: 'Final Assembly Unit',
  quantity: 5,
  completedQty: 2,
  batches: [
    { batchNo: 'PB-2026-0012-01', qty: 3, completedQty: 2, warehouseRequest: 'MWR-I-2026-0015', warehouseIssue: 'MWC-I-2026-0008', qcDoc: 'IQC-2026-0007' },
    { batchNo: 'PB-2026-0012-02', qty: 2, completedQty: 0, warehouseRequest: 'MWR-I-2026-0018', warehouseIssue: 'MWC-I-2026-0011', qcDoc: 'IQC-2026-0010' },
  ],
}

export default function WorkOrderDetail() {
  const navigate = useNavigate()
  const { language } = useAuthStore()
  const completion = Math.round((buildOrder.completedQty / buildOrder.quantity) * 100)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{buildOrder.buildOrderNo}</h1>
            <StatusBadge status={buildOrder.status} locale={language} />
          </div>
          <p className="mt-1 text-sm text-neutral-500">{language === 'zh-CN' ? buildOrder.product : buildOrder.productEn}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <ScissorsLineDashed className="h-4 w-4" />
            {language === 'zh-CN' ? '继续拆批' : 'Split More Batches'}
          </Button>
          <Button size="sm">
            <ClipboardCheck className="h-4 w-4" />
            {language === 'zh-CN' ? '查看内部检验' : 'View Internal QC'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '来源订单' : 'Source Order'}</label>
          <p className="mt-1 text-sm font-mono text-neutral-900">{buildOrder.sourceOrder}</p>
          <p className="mt-1 text-xs text-neutral-500">{buildOrder.sourceOrderType}</p>
        </Card>
        <Card>
          <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '市场' : 'Market'}</label>
          <p className="mt-1 text-sm font-medium text-neutral-900">{buildOrder.market}</p>
        </Card>
        <Card>
          <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '序列' : 'Sequence'}</label>
          <p className="mt-1 text-sm font-medium text-neutral-900">{buildOrder.sequenceFamily}</p>
        </Card>
        <Card>
          <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '完工进度' : 'Completion'}</label>
          <div className="mt-2">
            <ProgressBar value={completion} showLabel color="primary" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'zh-CN' ? '生产批次拆分' : 'Production Batch Split'}
          </h3>
          <span className="text-sm text-neutral-500">
            {language === 'zh-CN' ? `共 ${buildOrder.batches.length} 个批次` : `${buildOrder.batches.length} batches`}
          </span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {buildOrder.batches.map((batch) => (
            <div key={batch.batchNo} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Production Batch</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 font-mono">{batch.batchNo}</p>
                </div>
                <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                  {batch.completedQty}/{batch.qty}
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-neutral-700">
                <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                  <span>{language === 'zh-CN' ? '領料' : 'Material Withdrawal Request'}</span>
                  <span className="font-mono text-primary-600">{batch.warehouseRequest}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                  <span>{language === 'zh-CN' ? '發料' : 'Material Withdrawal Confirmation'}</span>
                  <span className="font-mono text-primary-600">{batch.warehouseIssue}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                  <span>{language === 'zh-CN' ? '内部检验' : 'Internal QC'}</span>
                  <span className="font-mono text-primary-600">{batch.qcDoc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-neutral-950 text-white">
        <div className="flex items-center gap-3">
          <Warehouse className="h-5 w-5 text-white/80" />
          <div>
            <h3 className="text-base font-semibold">{language === 'zh-CN' ? '仓库执行规则' : 'Warehouse Execution Rule'}</h3>
            <p className="mt-1 text-sm text-white/70">
              {language === 'zh-CN'
                ? '每个批次的領料与發料都必须按仓库拆单，并带生产批次号执行'
                : 'Each batch executes warehouse-specific withdrawal request and confirmation with an assigned production batch number.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
