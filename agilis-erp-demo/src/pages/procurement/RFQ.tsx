import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface RFQRow {
  id: string
  rfqNo: string
  status: DocumentStatus
  supplier: string
  supplierEn: string
  items: number
  deadline: string
  quotedAmount: string
}

const mockRFQs: RFQRow[] = [
  { id: '1', rfqNo: 'RFQ-2024-0001', status: 'approved', supplier: '苏州精密机械', supplierEn: 'Suzhou Precision Machinery', items: 5, deadline: '2024-12-20', quotedAmount: '¥128,500' },
  { id: '2', rfqNo: 'RFQ-2024-0002', status: 'submitted', supplier: '上海伺服科技', supplierEn: 'Shanghai Servo Tech', items: 3, deadline: '2024-12-25', quotedAmount: '¥86,200' },
  { id: '3', rfqNo: 'RFQ-2024-0003', status: 'in_approval', supplier: '深圳电子元件', supplierEn: 'Shenzhen Electronics', items: 8, deadline: '2025-01-05', quotedAmount: '¥245,000' },
  { id: '4', rfqNo: 'RFQ-2024-0004', status: 'draft', supplier: '杭州轴承工业', supplierEn: 'Hangzhou Bearing Industrial', items: 2, deadline: '2025-01-10', quotedAmount: '—' },
  { id: '5', rfqNo: 'RFQ-2024-0005', status: 'rejected', supplier: '北京钛合金材料', supplierEn: 'Beijing Titanium Materials', items: 4, deadline: '2024-12-15', quotedAmount: '¥312,000' },
]

export default function RFQ() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockRFQs.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.rfqNo.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q) || r.supplierEn.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '询价与报价' : 'RFQ & Quotations'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建询价' : 'New RFQ'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索询价单号、供应商...' : 'Search RFQ no., supplier...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '询价单号' : 'RFQ No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '物料数' : 'Items'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '截止日期' : 'Deadline'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '报价金额' : 'Quoted Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.rfqNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.supplier : row.supplierEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-center">{row.items}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.deadline}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{row.quotedAmount}</td>
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
