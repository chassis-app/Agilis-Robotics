import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface WORow {
  id: string
  woNo: string
  status: DocumentStatus
  itemName: string
  itemNameEn: string
  quantity: number
  completedQty: number
  startDate: string
  dueDate: string
}

const mockWOs: WORow[] = [
  { id: '1', woNo: 'WO-2024-0001', status: 'approved', itemName: '手术臂关节模组', itemNameEn: 'Surgical Arm Joint Module', quantity: 50, completedQty: 48, startDate: '2024-11-15', dueDate: '2024-12-20' },
  { id: '2', woNo: 'WO-2024-0002', status: 'approved', itemName: '末端执行器组件', itemNameEn: 'End Effector Assembly', quantity: 30, completedQty: 22, startDate: '2024-11-20', dueDate: '2024-12-25' },
  { id: '3', woNo: 'WO-2024-0003', status: 'in_approval', itemName: '控制电路板', itemNameEn: 'Control Circuit Board', quantity: 100, completedQty: 0, startDate: '2024-12-10', dueDate: '2025-01-15' },
  { id: '4', woNo: 'WO-2024-0004', status: 'submitted', itemName: '传感器模组', itemNameEn: 'Sensor Module', quantity: 80, completedQty: 0, startDate: '2024-12-15', dueDate: '2025-01-20' },
  { id: '5', woNo: 'WO-2024-0005', status: 'draft', itemName: '主体框架', itemNameEn: 'Main Frame Structure', quantity: 20, completedQty: 0, startDate: '2025-01-05', dueDate: '2025-02-10' },
]

const statusTabs: { id: string; key: DocumentStatus | 'all' }[] = [
  { id: 'all', key: 'all' },
  { id: 'draft', key: 'draft' },
  { id: 'submitted', key: 'submitted' },
  { id: 'in_approval', key: 'in_approval' },
  { id: 'approved', key: 'approved' },
]

export default function WorkOrderList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useAuthStore()
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<string>('dueDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    let result = mockWOs
    if (activeStatus !== 'all') {
      result = result.filter(wo => wo.status === activeStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(wo =>
        wo.woNo.toLowerCase().includes(q) ||
        wo.itemName.toLowerCase().includes(q) ||
        wo.itemNameEn.toLowerCase().includes(q)
      )
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortField as keyof WORow] ?? ''
      const bVal = b[sortField as keyof WORow] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [activeStatus, searchQuery, sortField, sortDir])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockWOs.length }
    mockWOs.forEach(wo => { counts[wo.status] = (counts[wo.status] || 0) + 1 })
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

  const getProgressColor = (pct: number): 'success' | 'warning' | 'primary' | 'danger' => {
    if (pct >= 100) return 'success'
    if (pct >= 50) return 'primary'
    if (pct > 0) return 'warning'
    return 'danger'
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '工单管理' : 'Work Orders'}
        </h1>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建工单' : 'New Work Order'}
        </Button>
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

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索工单号、产品名称...' : 'Search WO no., item name...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="secondary" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          {language === 'zh-CN' ? '更多筛选' : 'More Filters'}
        </Button>
      </div>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('woNo')}>
                  {t('manufacturing.wo_no')}<SortIcon field="woNo" />
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('engineering.item_name')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('common.quantity')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '已完成' : 'Completed'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 w-40">{t('manufacturing.progress')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('startDate')}>
                  {language === 'zh-CN' ? '开始日期' : 'Start Date'}<SortIcon field="startDate" />
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 cursor-pointer" onClick={() => handleSort('dueDate')}>
                  {language === 'zh-CN' ? '到期日期' : 'Due Date'}<SortIcon field="dueDate" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(wo => {
                const pct = wo.quantity > 0 ? Math.round((wo.completedQty / wo.quantity) * 100) : 0
                return (
                  <tr
                    key={wo.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/manufacturing/work-orders/${wo.woNo}`)}
                  >
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{wo.woNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={wo.status} locale={language} />
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900">
                      {language === 'zh-CN' ? wo.itemName : wo.itemNameEn}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{wo.quantity}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">{wo.completedQty}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={pct} color={getProgressColor(pct)} className="flex-1" />
                        <span className="text-xs text-neutral-500 w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{wo.startDate}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{wo.dueDate}</td>
                  </tr>
                )
              })}
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
