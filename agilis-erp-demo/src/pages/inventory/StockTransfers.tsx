import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface TransferRow {
  id: string
  transferNo: string
  status: DocumentStatus
  fromWarehouse: string
  fromWarehouseEn: string
  toWarehouse: string
  toWarehouseEn: string
  items: number
  date: string
}

const mockTransfers: TransferRow[] = [
  { id: '1', transferNo: 'ST-2024-0001', status: 'approved', fromWarehouse: '主仓库', fromWarehouseEn: 'Main Warehouse', toWarehouse: '生产线仓', toWarehouseEn: 'Production Line WH', items: 4, date: '2024-12-10' },
  { id: '2', transferNo: 'ST-2024-0002', status: 'approved', fromWarehouse: '电子仓', fromWarehouseEn: 'Electronics WH', toWarehouse: '主仓库', toWarehouseEn: 'Main Warehouse', items: 2, date: '2024-12-12' },
  { id: '3', transferNo: 'ST-2024-0003', status: 'in_approval', fromWarehouse: '原料仓', fromWarehouseEn: 'Raw Materials WH', toWarehouse: '生产线仓', toWarehouseEn: 'Production Line WH', items: 6, date: '2024-12-15' },
  { id: '4', transferNo: 'ST-2024-0004', status: 'submitted', fromWarehouse: '主仓库', fromWarehouseEn: 'Main Warehouse', toWarehouse: '电子仓', toWarehouseEn: 'Electronics WH', items: 3, date: '2024-12-16' },
  { id: '5', transferNo: 'ST-2024-0005', status: 'draft', fromWarehouse: '生产线仓', fromWarehouseEn: 'Production Line WH', toWarehouse: '成品仓', toWarehouseEn: 'Finished Goods WH', items: 1, date: '2024-12-18' },
]

export default function StockTransfers() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockTransfers.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.transferNo.toLowerCase().includes(q) || r.fromWarehouse.toLowerCase().includes(q) || r.toWarehouse.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '库存调拨' : 'Stock Transfers'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建调拨单' : 'New Transfer'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索调拨单号、仓库...' : 'Search transfer no., warehouse...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '调拨单号' : 'Transfer No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '源仓库' : 'From Warehouse'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '目标仓库' : 'To Warehouse'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '物料数' : 'Items'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '日期' : 'Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.transferNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.fromWarehouse : row.fromWarehouseEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.toWarehouse : row.toWarehouseEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-center">{row.items}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.date}</td>
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
