import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Download, MessageSquareWarning, Plus, Search } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface ComplaintRow {
  id: string
  complaintNo: string
  status: DocumentStatus
  market: string
  productNo: string
  productName: string
  productNameEn: string
  customer: string
  customerEn: string
  severity: 'low' | 'medium' | 'high'
  linkedCapa: string
  createdAt: string
}

const complaints: ComplaintRow[] = [
  {
    id: '1',
    complaintNo: 'CMP-2026-0011',
    status: 'approved',
    market: 'EU',
    productNo: 'FG-001',
    productName: '手术机器人手臂组件',
    productNameEn: 'Surgical Robot Arm Assembly',
    customer: '德国分销商 A',
    customerEn: 'EU Distributor A',
    severity: 'high',
    linkedCapa: 'CAPA-2026-0003',
    createdAt: '2026-03-08',
  },
  {
    id: '2',
    complaintNo: 'CMP-2026-0012',
    status: 'in_approval',
    market: 'CN',
    productNo: 'FG-002',
    productName: '控制系统主机',
    productNameEn: 'Control System Unit',
    customer: '上海合作医院',
    customerEn: 'Shanghai Partner Hospital',
    severity: 'medium',
    linkedCapa: 'CAPA-2026-0005',
    createdAt: '2026-03-12',
  },
  {
    id: '3',
    complaintNo: 'CMP-2026-0013',
    status: 'draft',
    market: 'US',
    productNo: 'FG-003',
    productName: '末端执行器套件',
    productNameEn: 'End Effector Kit',
    customer: '美国试验中心',
    customerEn: 'US Evaluation Lab',
    severity: 'low',
    linkedCapa: '',
    createdAt: '2026-03-14',
  },
]

export default function Complaints() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return complaints
    const query = searchQuery.toLowerCase()
    return complaints.filter((row) =>
      row.complaintNo.toLowerCase().includes(query) ||
      row.productNo.toLowerCase().includes(query) ||
      row.customer.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const severityClass = (severity: ComplaintRow['severity']) => {
    if (severity === 'high') return 'bg-danger-100 text-danger-700'
    if (severity === 'medium') return 'bg-warning-100 text-warning-700'
    return 'bg-neutral-100 text-neutral-600'
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '客诉管理' : 'Complaints'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '客诉进入 CAPA，再触发 ECR 与 BOM 版本变更'
              : 'Complaint intake that routes into CAPA, ECR, and BOM version change.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建客诉' : 'New Complaint'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
            <MessageSquareWarning className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '客诉总数' : 'Complaints'}</p>
            <p className="text-xl font-semibold text-neutral-900">{complaints.length}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '高严重度' : 'High Severity'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{complaints.filter((row) => row.severity === 'high').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '已关联 CAPA' : 'Linked CAPA'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{complaints.filter((row) => row.linkedCapa).length}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索客诉号、产品、客户...' : 'Search complaint, product, customer...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '客诉编号' : 'Complaint No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '市场' : 'Market'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '产品' : 'Product'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '客户' : 'Customer'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '严重度' : 'Severity'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">CAPA</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.created_at')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.complaintNo}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.market}</td>
                  <td className="px-3 py-2 text-sm text-neutral-800">
                    <div>{language === 'zh-CN' ? row.productName : row.productNameEn}</div>
                    <div className="font-mono text-xs text-neutral-400">{row.productNo}</div>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.customer : row.customerEn}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${severityClass(row.severity)}`}>
                      {row.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.linkedCapa || '-'}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
