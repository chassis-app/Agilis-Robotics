import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { CheckCheck, Download, PackageOpen, Search } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface WithdrawalConfirmationRow {
  id: string
  confirmationNo: string
  status: DocumentStatus
  requestNo: string
  buildOrderNo: string
  batchNo: string
  warehouse: string
  warehouseEn: string
  lotTrace: string
  confirmedBy: string
  confirmedByEn: string
  createdAt: string
}

const confirmations: WithdrawalConfirmationRow[] = [
  {
    id: '1',
    confirmationNo: 'MWC-I-2026-0008',
    status: 'approved',
    requestNo: 'MWR-I-2026-0015',
    buildOrderNo: 'BO-F-2026-0012',
    batchNo: 'PB-2026-0012-01',
    warehouse: '机加仓',
    warehouseEn: 'Machining Warehouse',
    lotTrace: 'LOT-TI-001 / LOT-BRG-003',
    confirmedBy: '陈刚',
    confirmedByEn: 'Gang Chen',
    createdAt: '2026-03-11',
  },
  {
    id: '2',
    confirmationNo: 'MWC-I-2026-0011',
    status: 'submitted',
    requestNo: 'MWR-I-2026-0018',
    buildOrderNo: 'BO-F-2026-0012',
    batchNo: 'PB-2026-0012-02',
    warehouse: '电子仓',
    warehouseEn: 'Electronics Warehouse',
    lotTrace: 'LOT-PCB-004 / LOT-CHIP-011',
    confirmedBy: '陈刚',
    confirmedByEn: 'Gang Chen',
    createdAt: '2026-03-13',
  },
]

export default function MaterialIssueNotice() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return confirmations
    const query = searchQuery.toLowerCase()
    return confirmations.filter((row) =>
      row.confirmationNo.toLowerCase().includes(query) ||
      row.requestNo.toLowerCase().includes(query) ||
      row.batchNo.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '發料' : 'Material Withdrawal Confirmation'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '依据已批准的領料单确认库存扣减，并记录批次追溯文件'
              : 'Confirm inventory withdrawal against approved requests and preserve lot-level trace documents.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <CheckCheck className="h-4 w-4" />
            {language === 'zh-CN' ? '确认發料' : 'Confirm Withdrawal'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '確認單數' : 'Confirmations'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{confirmations.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '已关联領料' : 'Linked Requests'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{confirmations.filter((row) => row.requestNo).length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '批次追溯完整' : 'Lot Trace Ready'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{confirmations.filter((row) => row.lotTrace).length}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索發料单、領料单、批次...' : 'Search confirmation, request, batch...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '發料单号' : 'Confirmation No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '來源領料' : 'Source Request'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'Build Order' : 'Build Order'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '生产批次' : 'Batch'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.warehouse')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '批次追溯' : 'Lot Trace'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '确认人' : 'Confirmed By'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.confirmationNo}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.requestNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.buildOrderNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.batchNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.warehouse : row.warehouseEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.lotTrace}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.confirmedBy : row.confirmedByEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <PackageOpen className="h-4 w-4 text-neutral-500" />
          <h3 className="text-base font-semibold text-neutral-900">{language === 'zh-CN' ? '执行规则' : 'Execution Rules'}</h3>
        </div>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li>{language === 'zh-CN' ? '1. 發料必须引用已批准的領料单。' : '1. Withdrawal confirmation must reference an approved request.'}</li>
          <li>{language === 'zh-CN' ? '2. 每张發料单只对应一个仓库。' : '2. Each confirmation belongs to one warehouse only.'}</li>
          <li>{language === 'zh-CN' ? '3. 批次扣减与追溯文件同步生成。' : '3. Lot deductions and trace documents are generated together.'}</li>
        </ul>
      </Card>
    </div>
  )
}
