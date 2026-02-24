import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Download, Search } from 'lucide-react'

type ReconciliationStatus = 'matched' | 'variance' | 'pending' | 'overdue'

interface APRow {
  id: string
  invoiceNo: string
  poNo: string
  supplier: string
  supplierEn: string
  invoiceAmount: string
  poAmount: string
  variance: string
  status: ReconciliationStatus
  dueDate: string
}

const mockAP: APRow[] = [
  { id: '1', invoiceNo: 'INV-2024-001', poNo: 'PO-2024-0001', supplier: '苏州精密机械', supplierEn: 'Suzhou Precision Machinery', invoiceAmount: '¥42,800', poAmount: '¥42,800', variance: '¥0', status: 'matched', dueDate: '2025-01-10' },
  { id: '2', invoiceNo: 'INV-2024-002', poNo: 'PO-2024-0002', supplier: '上海伺服科技', supplierEn: 'Shanghai Servo Tech', invoiceAmount: '¥87,500', poAmount: '¥86,400', variance: '¥1,100', status: 'variance', dueDate: '2025-01-15' },
  { id: '3', invoiceNo: 'INV-2024-003', poNo: 'PO-2024-0003', supplier: '深圳电子元件', supplierEn: 'Shenzhen Electronics', invoiceAmount: '¥245,000', poAmount: '¥245,000', variance: '¥0', status: 'matched', dueDate: '2025-01-20' },
  { id: '4', invoiceNo: 'INV-2024-004', poNo: 'PO-2024-0005', supplier: '杭州轴承工业', supplierEn: 'Hangzhou Bearing Industrial', invoiceAmount: '¥12,500', poAmount: '¥12,000', variance: '¥500', status: 'variance', dueDate: '2024-12-28' },
  { id: '5', invoiceNo: 'INV-2024-005', poNo: 'PO-2024-0006', supplier: '北京钛合金材料', supplierEn: 'Beijing Titanium Materials', invoiceAmount: '—', poAmount: '¥156,000', variance: '—', status: 'pending', dueDate: '2025-01-25' },
  { id: '6', invoiceNo: 'INV-2024-006', poNo: 'PO-2024-0004', supplier: '苏州精密机械', supplierEn: 'Suzhou Precision Machinery', invoiceAmount: '¥68,200', poAmount: '¥68,200', variance: '¥0', status: 'overdue', dueDate: '2024-12-15' },
]

const statusConfig: Record<ReconciliationStatus, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  matched: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '已匹配', labelEn: 'Matched' },
  variance: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500', label: '有差异', labelEn: 'Variance' },
  pending: { bg: 'bg-neutral-100', text: 'text-neutral-600', dot: 'bg-neutral-400', label: '待处理', labelEn: 'Pending' },
  overdue: { bg: 'bg-danger-100', text: 'text-danger-700', dot: 'bg-danger-500', label: '已逾期', labelEn: 'Overdue' },
}

export default function APReconciliation() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockAP.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.invoiceNo.toLowerCase().includes(q) || r.poNo.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '应付对账' : 'AP Reconciliation'}
        </h1>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          {t('common.export')}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索发票号、采购单号...' : 'Search invoice no., PO no...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '发票号' : 'Invoice No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '采购单号' : 'PO No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Supplier'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '发票金额' : 'Invoice Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '采购金额' : 'PO Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '差异' : 'Variance'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '到期日' : 'Due Date'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const config = statusConfig[row.status]
                return (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{row.invoiceNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm text-primary-600 font-mono">{row.poNo}</span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? row.supplier : row.supplierEn}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{row.invoiceAmount}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{row.poAmount}</td>
                    <td className={cn('px-3 py-2 text-sm font-medium text-right', row.status === 'variance' ? 'text-warning-600' : 'text-neutral-500')}>
                      {row.variance}
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
                        {language === 'zh-CN' ? config.label : config.labelEn}
                      </span>
                    </td>
                    <td className={cn('px-3 py-2 text-sm', row.status === 'overdue' ? 'text-danger-600 font-medium' : 'text-neutral-500')}>
                      {row.dueDate}
                    </td>
                  </tr>
                )
              })}
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
