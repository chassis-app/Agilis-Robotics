import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { AlertTriangle, Download, Plus, Search, Undo2, FileCheck2, ReceiptText } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface GoodsReturnRow {
  id: string
  grtNo: string
  status: DocumentStatus
  grnNo: string
  poNo: string
  supplier: string
  supplierEn: string
  warehouse: string
  warehouseEn: string
  reason: string
  reasonEn: string
  itemCheckReport: 'ready' | 'pending'
  taxInvoice: 'uploaded' | 'pending' | 'blocked'
  returnedLines: number
  returnedQty: number
  createdAt: string
}

const goodsReturns: GoodsReturnRow[] = [
  {
    id: '1',
    grtNo: 'GRT-F-2026-0007',
    status: 'approved',
    grnNo: 'GRN-F-2026-0019',
    poNo: 'PO-F-2026-0021',
    supplier: '苏州精密零件有限公司',
    supplierEn: 'Suzhou Precision Parts',
    warehouse: '机加仓',
    warehouseEn: 'Machining Warehouse',
    reason: '来料尺寸偏差',
    reasonEn: 'Incoming dimensional deviation',
    itemCheckReport: 'ready',
    taxInvoice: 'blocked',
    returnedLines: 2,
    returnedQty: 36,
    createdAt: '2026-03-10',
  },
  {
    id: '2',
    grtNo: 'GRT-F-2026-0008',
    status: 'in_approval',
    grnNo: 'GRN-F-2026-0023',
    poNo: 'PO-F-2026-0028',
    supplier: '深圳创新电子',
    supplierEn: 'Shenzhen Innovation Electronics',
    warehouse: '电子仓',
    warehouseEn: 'Electronics Warehouse',
    reason: 'IQC 不合格',
    reasonEn: 'IQC rejected',
    itemCheckReport: 'ready',
    taxInvoice: 'pending',
    returnedLines: 1,
    returnedQty: 120,
    createdAt: '2026-03-12',
  },
  {
    id: '3',
    grtNo: 'GRT-F-2026-0009',
    status: 'draft',
    grnNo: 'GRN-I-2026-0004',
    poNo: 'PO-I-2026-0006',
    supplier: '上海医疗材料科技',
    supplierEn: 'Shanghai Medical Materials',
    warehouse: '原料仓',
    warehouseEn: 'Raw Materials Warehouse',
    reason: '包装破损',
    reasonEn: 'Packaging damaged',
    itemCheckReport: 'pending',
    taxInvoice: 'pending',
    returnedLines: 3,
    returnedQty: 18,
    createdAt: '2026-03-14',
  },
]

function Pill({
  label,
  tone,
}: {
  label: string
  tone: 'success' | 'warning' | 'danger' | 'neutral'
}) {
  const className = {
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    neutral: 'bg-neutral-100 text-neutral-600',
  }[tone]

  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{label}</span>
}

export default function GoodsReturn() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return goodsReturns
    const query = searchQuery.toLowerCase()
    return goodsReturns.filter((row) =>
      row.grtNo.toLowerCase().includes(query) ||
      row.grnNo.toLowerCase().includes(query) ||
      row.poNo.toLowerCase().includes(query) ||
      row.supplier.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const invoiceCounts = goodsReturns.reduce(
    (acc, row) => {
      acc[row.taxInvoice] += 1
      return acc
    },
    { uploaded: 0, pending: 0, blocked: 0 },
  )

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '供应商退货' : 'Goods Return'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '从收货与检验结果发起供应商退货，并跟踪检查报告与税票状态'
              : 'Supplier return workflow linked to GRN, inspection findings, and tax invoice status.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建退货单' : 'New Goods Return'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
            <Undo2 className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '退货单总数' : 'Returns'}</p>
            <p className="text-xl font-semibold text-neutral-900">{goodsReturns.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-50">
            <FileCheck2 className="h-5 w-5 text-success-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '检查报告已齐' : 'Reports Ready'}</p>
            <p className="text-xl font-semibold text-neutral-900">
              {goodsReturns.filter((row) => row.itemCheckReport === 'ready').length}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-50">
            <ReceiptText className="h-5 w-5 text-warning-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '税票待收' : 'Invoice Pending'}</p>
            <p className="text-xl font-semibold text-neutral-900">{invoiceCounts.pending}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-50">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '税票冻结' : 'Invoice Blocked'}</p>
            <p className="text-xl font-semibold text-neutral-900">{invoiceCounts.blocked}</p>
          </div>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索退货单号、收货单号、供应商...' : 'Search return no., GRN, supplier...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '退货单号' : 'Return No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">GRN</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">PO</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.supplier')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.warehouse')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '退货原因' : 'Reason'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '检查报告' : 'Check Report'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '税票状态' : 'Tax Invoice'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '退货数量' : 'Qty'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-medium text-primary-600 font-mono">{row.grtNo}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.grnNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.poNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-800">{language === 'zh-CN' ? row.supplier : row.supplierEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{language === 'zh-CN' ? row.warehouse : row.warehouseEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{language === 'zh-CN' ? row.reason : row.reasonEn}</td>
                  <td className="px-3 py-2">
                    <Pill
                      label={row.itemCheckReport === 'ready' ? (language === 'zh-CN' ? '已完成' : 'Ready') : (language === 'zh-CN' ? '待补' : 'Pending')}
                      tone={row.itemCheckReport === 'ready' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Pill
                      label={
                        row.taxInvoice === 'uploaded'
                          ? language === 'zh-CN' ? '已上传' : 'Uploaded'
                          : row.taxInvoice === 'blocked'
                            ? language === 'zh-CN' ? '冻结' : 'Blocked'
                            : language === 'zh-CN' ? '待收' : 'Pending'
                      }
                      tone={row.taxInvoice === 'uploaded' ? 'success' : row.taxInvoice === 'blocked' ? 'danger' : 'warning'}
                    />
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-neutral-900">{row.returnedQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
