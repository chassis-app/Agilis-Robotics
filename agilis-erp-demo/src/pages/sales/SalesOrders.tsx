import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowRightLeft, Download, Plus, Search } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface OrderRow {
  id: string
  orderNo: string
  orderType: 'formal_sales' | 'informal_sales' | 'internal'
  sequenceFamily: 'formal' | 'informal'
  market: string
  status: DocumentStatus
  customer: string
  customerEn: string
  product: string
  productEn: string
  amount: number
  bomState: 'ready' | 'missing' | 'semi_only'
  buildOrder: string
  createdAt: string
}

const orders: OrderRow[] = [
  {
    id: '1',
    orderNo: 'SO-F-2026-0018',
    orderType: 'formal_sales',
    sequenceFamily: 'formal',
    market: 'EU',
    status: 'approved',
    customer: '德国分销商 A',
    customerEn: 'EU Distributor A',
    product: '手术机器人整机',
    productEn: 'Final Assembly Unit',
    amount: 3850000,
    bomState: 'ready',
    buildOrder: 'BO-F-2026-0012',
    createdAt: '2026-03-10',
  },
  {
    id: '2',
    orderNo: 'SO-I-2026-0007',
    orderType: 'informal_sales',
    sequenceFamily: 'informal',
    market: 'US',
    status: 'in_approval',
    customer: '美国试验中心',
    customerEn: 'US Evaluation Lab',
    product: '末端执行器套件',
    productEn: 'End Effector Kit',
    amount: 320000,
    bomState: 'semi_only',
    buildOrder: 'BO-I-2026-0009',
    createdAt: '2026-03-12',
  },
  {
    id: '3',
    orderNo: 'IO-I-2026-0004',
    orderType: 'internal',
    sequenceFamily: 'informal',
    market: 'CN',
    status: 'draft',
    customer: '内部测试中心',
    customerEn: 'Internal Validation Center',
    product: '控制系统半成品',
    productEn: 'Control System Semi Product',
    amount: 0,
    bomState: 'ready',
    buildOrder: 'BO-I-2026-0014',
    createdAt: '2026-03-14',
  },
  {
    id: '4',
    orderNo: 'SO-F-2026-0019',
    orderType: 'formal_sales',
    sequenceFamily: 'formal',
    market: 'JP',
    status: 'draft',
    customer: '日本渠道商',
    customerEn: 'Japan Channel Partner',
    product: '手术机器人整机',
    productEn: 'Final Assembly Unit',
    amount: 4100000,
    bomState: 'missing',
    buildOrder: '-',
    createdAt: '2026-03-14',
  },
]

export default function SalesOrders() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return orders
    const query = searchQuery.toLowerCase()
    return orders.filter((row) =>
      row.orderNo.toLowerCase().includes(query) ||
      row.customer.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query) ||
      row.market.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const formatAmount = (value: number) =>
    value === 0 ? (language === 'zh-CN' ? '内部单' : 'Internal') : new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value)

  const typeLabel = (type: OrderRow['orderType']) => {
    if (type === 'formal_sales') return language === 'zh-CN' ? '正式销售单' : 'Formal Sales'
    if (type === 'informal_sales') return language === 'zh-CN' ? '非正式销售单' : 'Informal Sales'
    return language === 'zh-CN' ? '内部订单' : 'Internal Order'
  }

  const bomBadge = (state: OrderRow['bomState']) => {
    const tone =
      state === 'ready' ? 'bg-success-100 text-success-700'
        : state === 'semi_only' ? 'bg-warning-100 text-warning-700'
          : 'bg-danger-100 text-danger-700'

    const label =
      state === 'ready' ? (language === 'zh-CN' ? '市场 BOM 可用' : 'Market BOM Ready')
        : state === 'semi_only' ? (language === 'zh-CN' ? '仅半成品可建单' : 'Semi Product Only')
          : (language === 'zh-CN' ? '缺少市场 BOM' : 'Missing Market BOM')

    return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{label}</span>
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '订单管理' : 'Order Management'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '统一管理正式销售单、非正式销售单与内部订单，并区分市场与正式/非正式序列'
              : 'Unified formal, informal, and internal orders with market filtering and dual sequence families.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建订单' : 'New Order'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '正式序列' : 'Formal Sequence'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{orders.filter((row) => row.sequenceFamily === 'formal').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '非正式序列' : 'Informal Sequence'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{orders.filter((row) => row.sequenceFamily === 'informal').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '内部订单' : 'Internal Orders'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{orders.filter((row) => row.orderType === 'internal').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '市场 BOM 风险' : 'Market BOM Risks'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{orders.filter((row) => row.bomState !== 'ready').length}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索订单号、客户、产品、市场...' : 'Search order, customer, product, market...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '订单号' : 'Order No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '订单类型' : 'Order Type'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '序列' : 'Sequence'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '市场' : 'Market'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '客户 / 用途' : 'Customer / Purpose'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '产品' : 'Product'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '市场 BOM' : 'Market BOM'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'Build Order' : 'Build Order'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('common.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="cursor-pointer border-b border-neutral-100 hover:bg-neutral-50" onClick={() => navigate(`/sales/orders/${row.id}`)}>
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.orderNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{typeLabel(row.orderType)}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                      <ArrowRightLeft className="h-3 w-3" />
                      {row.sequenceFamily.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.market}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.customer : row.customerEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-800">{language === 'zh-CN' ? row.product : row.productEn}</td>
                  <td className="px-3 py-2">{bomBadge(row.bomState)}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.buildOrder}</td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-neutral-900">{formatAmount(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
