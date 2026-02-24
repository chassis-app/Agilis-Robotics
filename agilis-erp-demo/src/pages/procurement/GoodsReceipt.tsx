import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface GRNRow {
  id: string
  grnNo: string
  status: DocumentStatus
  poNo: string
  supplier: string
  supplierEn: string
  receivedDate: string
  warehouse: string
  warehouseEn: string
  items: number
}

const mockGRNs: GRNRow[] = [
  { id: '1', grnNo: 'GRN-2024-0001', status: 'approved', poNo: 'PO-2024-0001', supplier: '苏州精密机械', supplierEn: 'Suzhou Precision Machinery', receivedDate: '2024-12-10', warehouse: '主仓库', warehouseEn: 'Main Warehouse', items: 3 },
  { id: '2', grnNo: 'GRN-2024-0002', status: 'approved', poNo: 'PO-2024-0002', supplier: '上海伺服科技', supplierEn: 'Shanghai Servo Tech', receivedDate: '2024-12-12', warehouse: '主仓库', warehouseEn: 'Main Warehouse', items: 2 },
  { id: '3', grnNo: 'GRN-2024-0003', status: 'in_approval', poNo: 'PO-2024-0003', supplier: '深圳电子元件', supplierEn: 'Shenzhen Electronics', receivedDate: '2024-12-15', warehouse: '电子仓', warehouseEn: 'Electronics WH', items: 5 },
  { id: '4', grnNo: 'GRN-2024-0004', status: 'submitted', poNo: 'PO-2024-0005', supplier: '杭州轴承工业', supplierEn: 'Hangzhou Bearing Industrial', receivedDate: '2024-12-16', warehouse: '主仓库', warehouseEn: 'Main Warehouse', items: 1 },
  { id: '5', grnNo: 'GRN-2024-0005', status: 'draft', poNo: 'PO-2024-0006', supplier: '北京钛合金材料', supplierEn: 'Beijing Titanium Materials', receivedDate: '2024-12-18', warehouse: '原料仓', warehouseEn: 'Raw Materials WH', items: 4 },
]

export default function GoodsReceipt() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockGRNs.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.grnNo.toLowerCase().includes(q) || r.poNo.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '收货管理' : 'Goods Receipts'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建收货单' : 'New GRN'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索收货单号、采购单号...' : 'Search GRN no., PO no...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '收货单号' : 'GRN No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '采购单号' : 'PO No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '收货日期' : 'Received Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '仓库' : 'Warehouse'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '物料数' : 'Items'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.grnNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-primary-600 font-mono">{row.poNo}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.supplier : row.supplierEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.receivedDate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.warehouse : row.warehouseEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-center">{row.items}</td>
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
