import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Plus, Upload, Download, Search, AlertTriangle, TrendingUp, FileText, Package
} from 'lucide-react'

type ForecastStatus = 'draft' | 'accepted' | 'processed' | 'closed'

interface ForecastRow {
  id: string
  forecastNo: string
  period: string
  description: string
  status: ForecastStatus
  totalQty: number
  estRevenue: number
  prCount: number
  hasShortage: boolean
  createdAt: string
  createdBy: string
}

const mockForecasts: ForecastRow[] = [
  { id: '1', forecastNo: 'FC-2024-015', period: '2024 Q2', description: '二季度销售预测 - 手术机器人', status: 'accepted', totalQty: 175, estRevenue: 52250000, prCount: 0, hasShortage: true, createdAt: '2024-12-01', createdBy: '张伟' },
  { id: '2', forecastNo: 'FC-2024-016', period: '2024 Q3', description: '三季度销售预测 - 控制系统', status: 'processed', totalQty: 100, estRevenue: 30000000, prCount: 3, hasShortage: false, createdAt: '2024-12-10', createdBy: '李明' },
  { id: '3', forecastNo: 'FC-2024-017', period: '2024 Q4', description: '四季度销售预测', status: 'draft', totalQty: 80, estRevenue: 24000000, prCount: 0, hasShortage: false, createdAt: '2024-12-15', createdBy: '王芳' },
  { id: '4', forecastNo: 'FC-2024-018', period: '2025 Q1', description: '一季度销售预测', status: 'accepted', totalQty: 60, estRevenue: 18000000, prCount: 1, hasShortage: true, createdAt: '2024-12-20', createdBy: '张伟' },
]

export default function SalesForecastList() {
  const { language } = useAuthStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ForecastStatus | 'all'>('all')

  const filtered = mockForecasts.filter(f => {
    const matchesSearch = !searchQuery || 
      f.forecastNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(amount)

  const activeCount = mockForecasts.filter(f => f.status === 'accepted' || f.status === 'draft').length
  const pendingPRs = mockForecasts.filter(f => f.status === 'accepted').length
  const totalRevenue = mockForecasts.reduce((sum, f) => sum + f.estRevenue, 0)

  const statusBadge = (status: ForecastStatus) => {
    const config = {
      draft: { label: language === 'zh-CN' ? '草稿' : 'Draft', className: 'bg-neutral-100 text-neutral-600' },
      accepted: { label: language === 'zh-CN' ? '已接受' : 'Accepted', className: 'bg-primary-100 text-primary-600' },
      processed: { label: language === 'zh-CN' ? '已处理' : 'Processed', className: 'bg-success-100 text-success-600' },
      closed: { label: language === 'zh-CN' ? '已关闭' : 'Closed', className: 'bg-neutral-100 text-neutral-500' },
    }
    const c = config[status]
    return <span className={`px-2 py-0.5 text-xs font-medium rounded ${c.className}`}>{c.label}</span>
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '销售预测' : 'Sales Forecasts'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? '管理销售预测并生成采购请购单' : 'Manage sales forecasts and generate purchase requisitions'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {language === 'zh-CN' ? '导出模板' : 'Export Template'}
          </Button>
          <Button variant="secondary" size="sm">
            <Upload className="h-4 w-4" />
            {language === 'zh-CN' ? '导入Excel' : 'Import Excel'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建预测' : 'New Forecast'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-50">
            <FileText className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '活跃预测' : 'Active Forecasts'}</p>
            <p className="text-xl font-semibold text-neutral-900">{activeCount}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-warning-50">
            <Package className="h-5 w-5 text-warning-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '待生成PR' : 'Pending PRs'}</p>
            <p className="text-xl font-semibold text-neutral-900">{pendingPRs}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success-50">
            <TrendingUp className="h-5 w-5 text-success-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '预计收入' : 'Expected Revenue'}</p>
            <p className="text-xl font-semibold text-neutral-900">{formatAmount(totalRevenue)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-danger-50">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '短缺预警' : 'Shortage Alerts'}</p>
            <p className="text-xl font-semibold text-neutral-900">{mockForecasts.filter(f => f.hasShortage).length}</p>
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
            placeholder={language === 'zh-CN' ? '搜索预测单号、描述...' : 'Search forecast no., description...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ForecastStatus | 'all')}
          className="h-9 px-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">{language === 'zh-CN' ? '全部状态' : 'All Status'}</option>
          <option value="draft">{language === 'zh-CN' ? '草稿' : 'Draft'}</option>
          <option value="accepted">{language === 'zh-CN' ? '已接受' : 'Accepted'}</option>
          <option value="processed">{language === 'zh-CN' ? '已处理' : 'Processed'}</option>
          <option value="closed">{language === 'zh-CN' ? '已关闭' : 'Closed'}</option>
        </select>
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '预测单号' : 'Forecast No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '期间' : 'Period'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '描述' : 'Description'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '总数量' : 'Total Qty'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '预计收入' : 'Est. Revenue'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '状态' : 'Status'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '已生成PR' : 'PRs'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '创建' : 'Created'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(forecast => (
                <tr key={forecast.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer" onClick={() => navigate(`/sales/planning/${forecast.id}`)}>
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{forecast.forecastNo}</span>
                    {forecast.hasShortage && <AlertTriangle className="inline h-4 w-4 text-warning-500 ml-1" />}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{forecast.period}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700 max-w-[200px] truncate">{forecast.description}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{forecast.totalQty}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{formatAmount(forecast.estRevenue)}</td>
                  <td className="px-3 py-2">{statusBadge(forecast.status)}</td>
                  <td className="px-3 py-2">
                    {forecast.prCount > 0 ? (
                      <span className="text-sm text-primary-600 font-medium">{forecast.prCount}</span>
                    ) : (
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{forecast.createdAt} · {forecast.createdBy}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {forecast.status === 'draft' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">{language === 'zh-CN' ? '编辑' : 'Edit'}</Button>
                      )}
                      {forecast.status === 'accepted' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">{language === 'zh-CN' ? '生成PR' : 'Generate PR'}</Button>
                      )}
                      {forecast.status === 'processed' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">{language === 'zh-CN' ? '查看PR' : 'View PRs'}</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">{language === 'zh-CN' ? `共 ${filtered.length} 条记录` : `${filtered.length} records`}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">1 / 1</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
