import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowUpDown, Plus, ScissorsLineDashed, Search } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface BuildOrderRow {
  id: string
  buildOrderNo: string
  status: DocumentStatus
  sequenceFamily: 'formal' | 'informal'
  sourceOrderType: 'sales' | 'internal'
  market: string
  product: string
  productEn: string
  qty: number
  completedQty: number
  batches: number
  priorityRank: number
  dueDate: string
}

const buildOrders: BuildOrderRow[] = [
  {
    id: '1',
    buildOrderNo: 'BO-F-2026-0012',
    status: 'approved',
    sequenceFamily: 'formal',
    sourceOrderType: 'sales',
    market: 'EU',
    product: '手术机器人整机',
    productEn: 'Final Assembly Unit',
    qty: 5,
    completedQty: 2,
    batches: 2,
    priorityRank: 1,
    dueDate: '2026-03-25',
  },
  {
    id: '2',
    buildOrderNo: 'BO-I-2026-0009',
    status: 'in_approval',
    sequenceFamily: 'informal',
    sourceOrderType: 'sales',
    market: 'US',
    product: '末端执行器套件',
    productEn: 'End Effector Kit',
    qty: 12,
    completedQty: 0,
    batches: 3,
    priorityRank: 2,
    dueDate: '2026-03-28',
  },
  {
    id: '3',
    buildOrderNo: 'BO-I-2026-0014',
    status: 'draft',
    sequenceFamily: 'informal',
    sourceOrderType: 'internal',
    market: 'CN',
    product: '控制系统半成品',
    productEn: 'Control System Semi Product',
    qty: 8,
    completedQty: 0,
    batches: 1,
    priorityRank: 3,
    dueDate: '2026-03-30',
  },
]

export default function WorkOrderList() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return buildOrders
    const query = searchQuery.toLowerCase()
    return buildOrders.filter((row) =>
      row.buildOrderNo.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query) ||
      row.market.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? 'Build Order 管理' : 'Build Orders'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '按正式/非正式序列管理 Build Order，支持优先级拖拽和生产批次拆分'
              : 'Build-order queue with formal/informal sequence control, priority reordering, and production-batch splits.'}
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建 Build Order' : 'New Build Order'}
        </Button>
      </div>

      <Card className="bg-neutral-950 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold">{language === 'zh-CN' ? '排程说明' : 'Scheduling Rule'}</h3>
            <p className="mt-1 text-sm text-white/70">
              {language === 'zh-CN'
                ? '优先级拖拽改变执行顺序，但不会改变批次编号与正式/非正式文档序列'
                : 'Drag-and-drop changes execution priority without changing production-batch numbering or sequence family.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <ArrowUpDown className="h-4 w-4" />
              {language === 'zh-CN' ? '调整优先级' : 'Reorder Priority'}
            </Button>
            <Button variant="secondary" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <ScissorsLineDashed className="h-4 w-4" />
              {language === 'zh-CN' ? '拆分生产批次' : 'Split Batch'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索 Build Order、产品、市场...' : 'Search build order, product, market...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '优先级' : 'Priority'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'Build Order' : 'Build Order'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '来源' : 'Source'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '序列' : 'Sequence'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '市场' : 'Market'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.item')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('common.quantity')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '已完成' : 'Completed'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '批次数' : 'Batches'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '交期' : 'Due Date'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="cursor-pointer border-b border-neutral-100 hover:bg-neutral-50" onClick={() => navigate(`/manufacturing/work-orders/${row.id}`)}>
                  <td className="px-3 py-2 text-sm font-semibold text-neutral-700">#{row.priorityRank}</td>
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.buildOrderNo}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.sourceOrderType === 'internal' ? (language === 'zh-CN' ? '内部订单' : 'Internal Order') : (language === 'zh-CN' ? '销售订单' : 'Sales Order')}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.sequenceFamily.toUpperCase()}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.market}</td>
                  <td className="px-3 py-2 text-sm text-neutral-800">{language === 'zh-CN' ? row.product : row.productEn}</td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-neutral-900">{row.qty}</td>
                  <td className="px-3 py-2 text-right text-sm text-neutral-700">{row.completedQty}</td>
                  <td className="px-3 py-2 text-right text-sm text-neutral-700">{row.batches}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{row.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
