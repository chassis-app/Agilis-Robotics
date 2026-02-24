import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface SCORow {
  id: string
  scoNo: string
  status: DocumentStatus
  supplier: string
  supplierEn: string
  item: string
  itemEn: string
  quantity: number
  deliveryDate: string
  amount: string
}

const mockSCOs: SCORow[] = [
  { id: '1', scoNo: 'SCO-2024-0001', status: 'approved', supplier: '苏州精密机械', supplierEn: 'Suzhou Precision Machinery', item: '钛合金轴加工', itemEn: 'Titanium Shaft Machining', quantity: 200, deliveryDate: '2024-12-25', amount: '¥86,000' },
  { id: '2', scoNo: 'SCO-2024-0002', status: 'in_approval', supplier: '杭州表面处理', supplierEn: 'Hangzhou Surface Treatment', item: '不锈钢外壳电镀', itemEn: 'SS Housing Electroplating', quantity: 150, deliveryDate: '2025-01-05', amount: '¥45,600' },
  { id: '3', scoNo: 'SCO-2024-0003', status: 'submitted', supplier: '上海热处理厂', supplierEn: 'Shanghai Heat Treatment', item: '轴承座热处理', itemEn: 'Bearing Seat Heat Treatment', quantity: 80, deliveryDate: '2025-01-10', amount: '¥22,400' },
  { id: '4', scoNo: 'SCO-2024-0004', status: 'draft', supplier: '深圳SMT加工', supplierEn: 'Shenzhen SMT Processing', item: 'PCB焊接组装', itemEn: 'PCB Solder Assembly', quantity: 500, deliveryDate: '2025-01-15', amount: '¥128,000' },
  { id: '5', scoNo: 'SCO-2024-0005', status: 'approved', supplier: '苏州精密机械', supplierEn: 'Suzhou Precision Machinery', item: '导管CNC加工', itemEn: 'Catheter CNC Machining', quantity: 100, deliveryDate: '2024-12-20', amount: '¥56,800' },
]

export default function SubcontractOrder() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockSCOs.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.scoNo.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q) || r.item.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '委外加工单' : 'Subcontract Orders'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建委外单' : 'New SCO'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索委外单号、供应商...' : 'Search SCO no., supplier...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '委外单号' : 'SCO No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '加工项目' : 'Item'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '数量' : 'Quantity'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '交期' : 'Delivery Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '金额' : 'Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.scoNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.supplier : row.supplierEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.item : row.itemEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{row.quantity}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.deliveryDate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{row.amount}</td>
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
