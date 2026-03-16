import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuthStore } from '@/store/useAuthStore'

const batches = [
  { batchNo: 'PB-2026-0012-01', buildOrderNo: 'BO-F-2026-0012', market: 'EU', qty: 3, completed: 2, stage: 'Internal QC' },
  { batchNo: 'PB-2026-0012-02', buildOrderNo: 'BO-F-2026-0012', market: 'EU', qty: 2, completed: 0, stage: 'Material Withdrawal Confirmation' },
  { batchNo: 'PB-2026-0009-03', buildOrderNo: 'BO-I-2026-0009', market: 'US', qty: 4, completed: 1, stage: 'Assembly' },
]

export default function ProductionProgress() {
  const { language } = useAuthStore()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '生产批次进度' : 'Production Batch Progress'}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {language === 'zh-CN'
            ? '以生产批次为主线查看 Build Order、領料、發料与内部检验状态'
            : 'Batch-centric progress view across build order, withdrawal request, withdrawal confirmation, and internal QC.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '活动批次' : 'Active Batches'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{batches.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '内部检验中' : 'In Internal QC'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{batches.filter((batch) => batch.stage === 'Internal QC').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '平均完成率' : 'Average Completion'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">
            {Math.round(batches.reduce((sum, batch) => sum + (batch.completed / batch.qty) * 100, 0) / batches.length)}%
          </p>
        </Card>
      </div>

      <Card className="space-y-4">
        {batches.map((batch) => {
          const progress = Math.round((batch.completed / batch.qty) * 100)
          return (
            <div key={batch.batchNo} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-neutral-900 font-mono">{batch.batchNo}</p>
                  <p className="mt-1 text-sm text-neutral-500">{batch.buildOrderNo} · {batch.market}</p>
                </div>
                <div className="w-full max-w-sm">
                  <ProgressBar value={progress} showLabel color={progress >= 70 ? 'success' : progress > 0 ? 'primary' : 'warning'} />
                </div>
                <div className="text-sm text-neutral-600">
                  {language === 'zh-CN' ? '当前阶段' : 'Current Stage'}: <span className="font-medium text-neutral-900">{batch.stage}</span>
                </div>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
