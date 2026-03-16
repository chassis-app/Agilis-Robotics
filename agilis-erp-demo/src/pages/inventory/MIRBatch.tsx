import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Download, Plus, Search, Warehouse } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface WithdrawalRequestRow {
  id: string
  requestNo: string
  status: DocumentStatus
  buildOrderNo: string
  batchNo: string
  warehouse: string
  warehouseEn: string
  reason: string
  reasonEn: string
  requester: string
  requesterEn: string
  itemLines: number
  createdAt: string
}

const requests: WithdrawalRequestRow[] = [
  {
    id: '1',
    requestNo: 'MWR-I-2026-0015',
    status: 'approved',
    buildOrderNo: 'BO-F-2026-0012',
    batchNo: 'PB-2026-0012-01',
    warehouse: '机加仓',
    warehouseEn: 'Machining Warehouse',
    reason: '参照 Build Order 发起',
    reasonEn: 'Triggered from build order',
    requester: '刘洋',
    requesterEn: 'Yang Liu',
    itemLines: 6,
    createdAt: '2026-03-11',
  },
  {
    id: '2',
    requestNo: 'MWR-I-2026-0018',
    status: 'in_approval',
    buildOrderNo: 'BO-F-2026-0012',
    batchNo: 'PB-2026-0012-02',
    warehouse: '电子仓',
    warehouseEn: 'Electronics Warehouse',
    reason: '补领并关联生产批次',
    reasonEn: 'Supplemental request tied to batch',
    requester: '王芳',
    requesterEn: 'Fang Wang',
    itemLines: 4,
    createdAt: '2026-03-13',
  },
]

export default function MIRBatch() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return requests
    const query = searchQuery.toLowerCase()
    return requests.filter((row) =>
      row.requestNo.toLowerCase().includes(query) ||
      row.buildOrderNo.toLowerCase().includes(query) ||
      row.batchNo.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '領料' : 'Material Withdrawal Request'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '按仓库拆单、按生产批次发起库存领用申请，并进入审批流程'
              : 'Warehouse-specific inventory withdrawal requests linked to production batch numbers and approval flow.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建領料单' : 'New Request'}
          </Button>
        </div>
      </div>

      <Card className="bg-neutral-950 text-white">
        <div className="flex items-center gap-3">
          <Warehouse className="h-5 w-5 text-white/80" />
          <p className="text-sm text-white/80">
            {language === 'zh-CN'
              ? '规则：每个仓库 1 张單，且必须先分配生产批次号后才能提交'
              : 'Rule: one request per warehouse, and a production batch number must be assigned before submission.'}
          </p>
        </div>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索領料单、Build Order、批次...' : 'Search request, build order, batch...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '領料单号' : 'Request No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'Build Order' : 'Build Order'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '生产批次' : 'Batch'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.warehouse')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '原因' : 'Reason'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.requester')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '物料行数' : 'Lines'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.requestNo}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.buildOrderNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.batchNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.warehouse : row.warehouseEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.reason : row.reasonEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.requester : row.requesterEn}</td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-neutral-900">{row.itemLines}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
