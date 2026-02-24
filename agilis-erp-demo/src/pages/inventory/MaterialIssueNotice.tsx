import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Search, PackageOpen } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface MINRow {
  id: string
  minNo: string
  status: DocumentStatus
  woNo: string
  requesterName: string
  requesterNameEn: string
  requiredDate: string
  itemsCount: number
  createdAt: string
}

const mockMINs: MINRow[] = [
  { id: '1', minNo: 'MIN-2024-0001', status: 'approved', woNo: 'WO-2024-0001', requesterName: '刘洋', requesterNameEn: 'Yang Liu', requiredDate: '2024-12-10', itemsCount: 5, createdAt: '2024-12-08' },
  { id: '2', minNo: 'MIN-2024-0002', status: 'in_approval', woNo: 'WO-2024-0002', requesterName: '王芳', requesterNameEn: 'Fang Wang', requiredDate: '2024-12-15', itemsCount: 3, createdAt: '2024-12-12' },
  { id: '3', minNo: 'MIN-2024-0003', status: 'draft', woNo: 'WO-2024-0003', requesterName: '刘洋', requesterNameEn: 'Yang Liu', requiredDate: '2024-12-20', itemsCount: 8, createdAt: '2024-12-14' },
]

export default function MaterialIssueNotice() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let result = mockMINs
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(min =>
        min.minNo.toLowerCase().includes(q) ||
        min.woNo.toLowerCase().includes(q) ||
        min.requesterName.toLowerCase().includes(q)
      )
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortField as keyof MINRow] ?? ''
      const bVal = b[sortField as keyof MINRow] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [searchQuery, sortField, sortDir])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }: { field: string }) => (
    <span className="text-neutral-400 ml-1">
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '领料通知单' : 'Material Issue Notices'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? '管理生产工单的物料领取通知' : 'Manage material issue notices for work orders'}
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建领料通知' : 'New MIN'}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索通知单号、工单号...' : 'Search MIN no., WO no...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('minNo')}>
                  {language === 'zh-CN' ? '通知单号' : 'MIN No.'}<SortIcon field="minNo" />
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('woNo')}>
                  {t('manufacturing.wo_no')}<SortIcon field="woNo" />
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.requester')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('requiredDate')}>
                  {t('common.required_date')}<SortIcon field="requiredDate" />
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '物料项数' : 'Items Count'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('createdAt')}>
                  {t('common.created_at')}<SortIcon field="createdAt" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(min => (
                <tr
                  key={min.id}
                  className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{min.minNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={min.status} locale={language} />
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm font-mono text-neutral-700">{min.woNo}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? min.requesterName : min.requesterNameEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{min.requiredDate}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="inline-flex items-center gap-1 text-sm text-neutral-700">
                      <PackageOpen className="h-3.5 w-3.5 text-neutral-400" />
                      {min.itemsCount}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{min.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: filtered.length })}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">1 / 1</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
