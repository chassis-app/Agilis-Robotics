import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Search, Download, SlidersHorizontal, FileText } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface PORow {
  id: string
  poNo: string
  status: DocumentStatus
  supplierName: string
  buyerName: string
  deliveryDate: string
  totalAmount: number
  currency: string
  createdAt: string
}

const mockPOs: PORow[] = [
  { id: '1', poNo: 'PO-2024-0001', status: 'approved', supplierName: '苏州精密零件有限公司', buyerName: '李明', deliveryDate: '2024-12-20', totalAmount: 45000, currency: 'CNY', createdAt: '2024-12-02' },
  { id: '2', poNo: 'PO-2024-0002', status: 'approved', supplierName: '深圳伺服科技股份有限公司', buyerName: '李明', deliveryDate: '2024-12-25', totalAmount: 128000, currency: 'CNY', createdAt: '2024-12-04' },
  { id: '3', poNo: 'PO-2024-0003', status: 'in_approval', supplierName: '上海医用材料有限公司', buyerName: '赵静', deliveryDate: '2025-01-05', totalAmount: 92000, currency: 'CNY', createdAt: '2024-12-08' },
  { id: '4', poNo: 'PO-2024-0004', status: 'submitted', supplierName: '苏州精密零件有限公司', buyerName: '李明', deliveryDate: '2025-01-10', totalAmount: 56800, currency: 'CNY', createdAt: '2024-12-10' },
  { id: '5', poNo: 'PO-2024-0005', status: 'draft', supplierName: '无锡轴承制造有限公司', buyerName: '赵静', deliveryDate: '2025-01-15', totalAmount: 34200, currency: 'CNY', createdAt: '2024-12-12' },
  { id: '6', poNo: 'PO-2024-0006', status: 'draft', supplierName: '深圳伺服科技股份有限公司', buyerName: '李明', deliveryDate: '2025-01-20', totalAmount: 15600, currency: 'CNY', createdAt: '2024-12-14' },
]

const statusTabs: { id: string; key: DocumentStatus | 'all' }[] = [
  { id: 'all', key: 'all' },
  { id: 'draft', key: 'draft' },
  { id: 'submitted', key: 'submitted' },
  { id: 'in_approval', key: 'in_approval' },
  { id: 'approved', key: 'approved' },
]

export default function POList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useAuthStore()
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let result = mockPOs
    if (activeStatus !== 'all') {
      result = result.filter(po => po.status === activeStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(po =>
        po.poNo.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.buyerName.toLowerCase().includes(q)
      )
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortField as keyof PORow] ?? ''
      const bVal = b[sortField as keyof PORow] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [activeStatus, searchQuery, sortField, sortDir])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockPOs.length }
    mockPOs.forEach(po => { counts[po.status] = (counts[po.status] || 0) + 1 })
    return counts
  }, [])

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

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">{t('po.list_title')}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建采购订单' : 'New PO'}
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.key)}
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
            placeholder={language === 'zh-CN' ? '搜索订单号、供应商...' : 'Search PO no., supplier...'}
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
            : (language === 'zh-CN' ? '暂无采购订单' : 'No purchase orders yet')
          }
          description={searchQuery
            ? (language === 'zh-CN' ? '请尝试修改搜索条件' : 'Try adjusting your search')
            : undefined
          }
        />
      ) : (
        <Card padding="sm" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('poNo')}>
                    {t('po.po_no')}<SortIcon field="poNo" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('supplierName')}>
                    {t('common.supplier')}<SortIcon field="supplierName" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('po.buyer')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('deliveryDate')}>
                    {t('po.delivery_date')}<SortIcon field="deliveryDate" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right cursor-pointer" onClick={() => handleSort('totalAmount')}>
                    {t('common.amount')}<SortIcon field="totalAmount" />
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('createdAt')}>
                    {t('common.created_at')}<SortIcon field="createdAt" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(po => (
                  <tr
                    key={po.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/procurement/purchase-orders/${po.poNo}`)}
                  >
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{po.poNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={po.status} locale={language} />
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{po.supplierName}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{po.buyerName}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{po.deliveryDate}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{formatAmount(po.totalAmount)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{po.createdAt}</td>
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
    </div>
  )
}
