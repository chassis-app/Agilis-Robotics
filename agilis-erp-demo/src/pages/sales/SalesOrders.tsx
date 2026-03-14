import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Search, Download, ShoppingCart, FileText } from 'lucide-react'
import type { DocumentStatus } from '@/types'
interface SORow {
  id: string
  soNo: string
  status: DocumentStatus
  customerName: string
  customerNameEn: string
  deliveryDate: string
  totalAmount: number
  currency: string
  itemsCount: number
  createdAt: string
}
const mockSOs: SORow[] = [
  { id: '1', soNo: 'SO-2024-0001', status: 'approved', customerName: '北京协和医院', customerNameEn: 'Peking Union Medical College Hospital', deliveryDate: '2025-01-15', totalAmount: 2850000, currency: 'CNY', itemsCount: 3, createdAt: '2024-11-20' },
  { id: '2', soNo: 'SO-2024-0002', status: 'in_approval', customerName: '上海瑞金医院', customerNameEn: 'Shanghai Ruijin Hospital', deliveryDate: '2025-02-28', totalAmount: 1420000, currency: 'CNY', itemsCount: 2, createdAt: '2024-12-05' },
  { id: '3', soNo: 'SO-2024-0003', status: 'draft', customerName: '广州南方医科大学南方医院', customerNameEn: 'Nanfang Hospital, Southern Medical University', deliveryDate: '2025-03-30', totalAmount: 950000, currency: 'CNY', itemsCount: 1, createdAt: '2024-12-10' },
]
export default function SalesOrders() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const filtered = useMemo(() => {
    if (!searchQuery) return mockSOs
    const q = searchQuery.toLowerCase()
    return mockSOs.filter(so =>
      so.soNo.toLowerCase().includes(q) ||
      so.customerName.toLowerCase().includes(q) ||
      so.customerNameEn.toLowerCase().includes(q)
    )
  }, [searchQuery])
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
  const totalRevenue = mockSOs.reduce((sum, so) => sum + so.totalAmount, 0)
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '销售订单' : 'Sales Orders'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? '管理客户订单和交付计划' : 'Manage customer orders and delivery schedules'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建销售订单' : 'New Sales Order'}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-50">
            <ShoppingCart className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '订单总数' : 'Total Orders'}</p>
            <p className="text-xl font-semibold text-neutral-900">{mockSOs.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success-50">
            <ShoppingCart className="h-5 w-5 text-success-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '总收入' : 'Total Revenue'}</p>
            <p className="text-xl font-semibold text-neutral-900">{formatAmount(totalRevenue)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-warning-50">
            <ShoppingCart className="h-5 w-5 text-warning-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '待审批' : 'Pending Approval'}</p>
            <p className="text-xl font-semibold text-neutral-900">
              {mockSOs.filter(so => so.status === 'in_approval' || so.status === 'submitted').length}
            </p>
          </div>
        </Card>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索订单号、客户名称...' : 'Search SO no., customer...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '订单号' : 'SO No.'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '客户' : 'Customer'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '交付日期' : 'Delivery Date'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('common.amount')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '项数' : 'Items'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.created_at')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(so => (
                <tr key={so.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono" onClick={() => navigate(`/sales/orders/${so.id}`)}>{so.soNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={so.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-900">
                    {language === 'zh-CN' ? so.customerName : so.customerNameEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{so.deliveryDate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{formatAmount(so.totalAmount)}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-right">{so.itemsCount}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{so.createdAt}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => navigate(`/sales/orders/${so.id}`)}>
                        {language === 'zh-CN' ? '详情' : 'Detail'}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <FileText className="h-3 w-3" />
                        {language === 'zh-CN' ? '生成PR' : 'Generate PR'}
                      </Button>
                    </div>
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">1 / 1</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
