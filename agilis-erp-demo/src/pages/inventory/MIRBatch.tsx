import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface MIRRow {
  id: string
  mirNo: string
  status: DocumentStatus
  woNo: string
  items: number
  requestedBy: string
  requestedByEn: string
  date: string
}

const mockMIRs: MIRRow[] = [
  { id: '1', mirNo: 'MIR-2024-0001', status: 'approved', woNo: 'WO-2024-0001', items: 6, requestedBy: '刘洋', requestedByEn: 'Liu Yang', date: '2024-12-10' },
  { id: '2', mirNo: 'MIR-2024-0002', status: 'approved', woNo: 'WO-2024-0002', items: 4, requestedBy: '王芳', requestedByEn: 'Wang Fang', date: '2024-12-12' },
  { id: '3', mirNo: 'MIR-2024-0003', status: 'in_approval', woNo: 'WO-2024-0003', items: 8, requestedBy: '刘洋', requestedByEn: 'Liu Yang', date: '2024-12-15' },
  { id: '4', mirNo: 'MIR-2024-0004', status: 'submitted', woNo: 'WO-2024-0004', items: 3, requestedBy: '赵静', requestedByEn: 'Zhao Jing', date: '2024-12-16' },
  { id: '5', mirNo: 'MIR-2024-0005', status: 'draft', woNo: 'WO-2024-0005', items: 5, requestedBy: '刘洋', requestedByEn: 'Liu Yang', date: '2024-12-18' },
  { id: '6', mirNo: 'MIR-2024-0006', status: 'rejected', woNo: 'WO-2024-0003', items: 2, requestedBy: '王芳', requestedByEn: 'Wang Fang', date: '2024-12-14' },
]

export default function MIRBatch() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockMIRs.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.mirNo.toLowerCase().includes(q) || r.woNo.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '领料申请' : 'Material Issue Requests'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建领料单' : 'New MIR'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索领料单号、工单号...' : 'Search MIR no., WO no...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '领料单号' : 'MIR No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '工单号' : 'WO No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '物料数' : 'Items'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '申请人' : 'Requested By'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '日期' : 'Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.mirNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-primary-600 font-mono">{row.woNo}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-center">{row.items}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.requestedBy : row.requestedByEn}
                  </td>
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
