import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface CycleCountRow {
  id: string
  countNo: string
  status: DocumentStatus
  warehouse: string
  warehouseEn: string
  itemCount: number
  varianceCount: number
  scheduledDate: string
  completedDate: string | null
}

const mockCycleCounts: CycleCountRow[] = [
  { id: '1', countNo: 'CC-2024-0001', status: 'approved', warehouse: '主仓库', warehouseEn: 'Main Warehouse', itemCount: 45, varianceCount: 3, scheduledDate: '2024-12-01', completedDate: '2024-12-02' },
  { id: '2', countNo: 'CC-2024-0002', status: 'approved', warehouse: '电子仓', warehouseEn: 'Electronics WH', itemCount: 28, varianceCount: 1, scheduledDate: '2024-12-05', completedDate: '2024-12-05' },
  { id: '3', countNo: 'CC-2024-0003', status: 'in_approval', warehouse: '原料仓', warehouseEn: 'Raw Materials WH', itemCount: 62, varianceCount: 5, scheduledDate: '2024-12-15', completedDate: '2024-12-16' },
  { id: '4', countNo: 'CC-2024-0004', status: 'submitted', warehouse: '主仓库', warehouseEn: 'Main Warehouse', itemCount: 38, varianceCount: 2, scheduledDate: '2024-12-20', completedDate: null },
  { id: '5', countNo: 'CC-2024-0005', status: 'draft', warehouse: '成品仓', warehouseEn: 'Finished Goods WH', itemCount: 15, varianceCount: 0, scheduledDate: '2025-01-05', completedDate: null },
]

export default function CycleCount() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockCycleCounts.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.countNo.toLowerCase().includes(q) || r.warehouse.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '循环盘点' : 'Cycle Counts'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建盘点' : 'New Count'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索盘点单号、仓库...' : 'Search count no., warehouse...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '盘点单号' : 'Count No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '仓库' : 'Warehouse'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '物料数' : 'Item Count'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '差异数' : 'Variance'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '计划日期' : 'Scheduled Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '完成日期' : 'Completed Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.countNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.warehouse : row.warehouseEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-center">{row.itemCount}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-sm font-medium ${row.varianceCount > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                      {row.varianceCount}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.scheduledDate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.completedDate ?? '—'}</td>
                  <td className="px-3 py-2 text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: filtered.length })}
          </span>
        </div>
      </Card>
    </div>
  )
}
