import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Search, Download, SlidersHorizontal, FileText } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface PRRow {
  id: string
  prNo: string
  status: DocumentStatus
  requester: string
  department: string
  priority: 'normal' | 'urgent'
  requiredDate: string
  totalAmount: string
  itemCount: number
  createdAt: string
}

const mockPRs: PRRow[] = [
  { id: '1', prNo: 'PR-2024-0001', status: 'approved', requester: '王芳', department: '工程部', priority: 'normal', requiredDate: '2024-12-20', totalAmount: '¥45,000', itemCount: 3, createdAt: '2024-12-01' },
  { id: '2', prNo: 'PR-2024-0002', status: 'approved', requester: '李明', department: '供应链', priority: 'urgent', requiredDate: '2024-12-18', totalAmount: '¥128,000', itemCount: 2, createdAt: '2024-12-03' },
  { id: '3', prNo: 'PR-2024-0003', status: 'in_approval', requester: '王芳', department: '工程部', priority: 'urgent', requiredDate: '2024-12-25', totalAmount: '¥92,000', itemCount: 4, createdAt: '2024-12-05' },
  { id: '4', prNo: 'PR-2024-0004', status: 'in_approval', requester: '李明', department: '供应链', priority: 'normal', requiredDate: '2024-12-28', totalAmount: '¥56,800', itemCount: 2, createdAt: '2024-12-07' },
  { id: '5', prNo: 'PR-2024-0005', status: 'submitted', requester: '刘洋', department: '生产部', priority: 'normal', requiredDate: '2025-01-05', totalAmount: '¥34,200', itemCount: 3, createdAt: '2024-12-10' },
  { id: '6', prNo: 'PR-2024-0006', status: 'draft', requester: '王芳', department: '工程部', priority: 'normal', requiredDate: '2025-01-10', totalAmount: '¥15,600', itemCount: 1, createdAt: '2024-12-12' },
  { id: '7', prNo: 'PR-2024-0007', status: 'draft', requester: '赵静', department: '仓储部', priority: 'normal', requiredDate: '2025-01-15', totalAmount: '¥8,900', itemCount: 2, createdAt: '2024-12-14' },
  { id: '8', prNo: 'PR-2024-0008', status: 'rejected', requester: '刘洋', department: '生产部', priority: 'normal', requiredDate: '2024-12-30', totalAmount: '¥210,000', itemCount: 5, createdAt: '2024-12-08' },
]

const statusTabs: { id: string; key: DocumentStatus | 'all' }[] = [
  { id: 'all', key: 'all' },
  { id: 'draft', key: 'draft' },
  { id: 'submitted', key: 'submitted' },
  { id: 'in_approval', key: 'in_approval' },
  { id: 'approved', key: 'approved' },
  { id: 'rejected', key: 'rejected' },
  { id: 'cancelled', key: 'cancelled' },
]

export default function PRList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useAuthStore()
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const pageSize = 20

  const filtered = useMemo(() => {
    let result = mockPRs
    if (activeStatus !== 'all') {
      result = result.filter(pr => pr.status === activeStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(pr =>
        pr.prNo.toLowerCase().includes(q) ||
        pr.requester.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      const aVal = a[sortField as keyof PRRow] ?? ''
      const bVal = b[sortField as keyof PRRow] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [activeStatus, searchQuery, sortField, sortDir])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockPRs.length }
    mockPRs.forEach(pr => { counts[pr.status] = (counts[pr.status] || 0) + 1 })
    return counts
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(pr => pr.id)))
    }
  }

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
        <h1 className="text-2xl font-semibold text-neutral-900">{t('pr.list_title')}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm" onClick={() => navigate('/procurement/purchase-requisitions/new')}>
            <Plus className="h-4 w-4" />
            {t('pr.new_pr')}
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveStatus(tab.key); setPage(1) }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeStatus === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t(`status.${tab.key}`)}
            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
              activeStatus === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'
            }`}>
              {statusCounts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索申请单号、申请人...' : 'Search PR no., requester...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="secondary" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          {language === 'zh-CN' ? '更多筛选' : 'More Filters'}
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-neutral-300" />}
          title={searchQuery
            ? (language === 'zh-CN' ? '没有匹配的结果' : 'No matching results')
            : (language === 'zh-CN' ? '暂无采购申请' : 'No purchase requisitions yet')
          }
          description={searchQuery
            ? (language === 'zh-CN' ? '请尝试修改搜索条件' : 'Try adjusting your search')
            : undefined
          }
          actionLabel={!searchQuery ? t('pr.new_pr') : undefined}
          onAction={!searchQuery ? () => navigate('/procurement/purchase-requisitions/new') : undefined}
        />
      ) : (
        <Card padding="sm" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600"
                    />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('prNo')}>
                    {t('pr.pr_no')}<SortIcon field="prNo" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('requester')}>
                    {t('common.requester')}<SortIcon field="requester" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.department')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.priority')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('requiredDate')}>
                    {t('common.required_date')}<SortIcon field="requiredDate" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right cursor-pointer" onClick={() => handleSort('totalAmount')}>
                    {t('pr.total_amount')}<SortIcon field="totalAmount" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('createdAt')}>
                    {t('common.created_at')}<SortIcon field="createdAt" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(pr => (
                  <tr
                    key={pr.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/procurement/purchase-requisitions/${pr.prNo}`)}
                  >
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(pr.id)}
                        onChange={() => toggleSelect(pr.id)}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{pr.prNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={pr.status} locale={language} />
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{pr.requester}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{pr.department}</td>
                    <td className="px-3 py-2">
                      {pr.priority === 'urgent' ? (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-danger-50 text-danger-600 rounded">
                          {t('common.urgent')}
                        </span>
                      ) : (
                        <span className="text-sm text-neutral-500">{t('common.normal')}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{pr.requiredDate}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{pr.totalAmount}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{pr.createdAt}</td>
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
      )}

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg py-3 px-6 flex items-center justify-between z-20">
          <span className="text-sm text-neutral-700 font-medium">
            {t('common.selected_count', { count: selectedIds.size })}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">{t('common.bulk_submit')}</Button>
            <Button variant="danger" size="sm">{t('common.bulk_delete')}</Button>
            <Button size="sm">{t('common.create_po')}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
