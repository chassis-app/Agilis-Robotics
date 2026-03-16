import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { ClipboardCheck, Download, Plus, Search, Undo2 } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface GrnRow {
  id: string
  grnNo: string
  status: DocumentStatus
  poNo: string
  supplier: string
  supplierEn: string
  receivedDate: string
  warehouse: string
  warehouseEn: string
  itemCheckReport: 'ready' | 'pending'
  taxInvoice: 'uploaded' | 'pending'
  goodsReturn: string
}

const grns: GrnRow[] = [
  {
    id: '1',
    grnNo: 'GRN-F-2026-0019',
    status: 'approved',
    poNo: 'PO-F-2026-0021',
    supplier: '苏州精密零件有限公司',
    supplierEn: 'Suzhou Precision Parts',
    receivedDate: '2026-03-10',
    warehouse: '机加仓',
    warehouseEn: 'Machining Warehouse',
    itemCheckReport: 'ready',
    taxInvoice: 'pending',
    goodsReturn: 'GRT-F-2026-0007',
  },
  {
    id: '2',
    grnNo: 'GRN-F-2026-0023',
    status: 'approved',
    poNo: 'PO-F-2026-0028',
    supplier: '深圳创新电子',
    supplierEn: 'Shenzhen Innovation Electronics',
    receivedDate: '2026-03-12',
    warehouse: '电子仓',
    warehouseEn: 'Electronics Warehouse',
    itemCheckReport: 'ready',
    taxInvoice: 'uploaded',
    goodsReturn: '-',
  },
]

export default function GoodsReceipt() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return grns
    const query = searchQuery.toLowerCase()
    return grns.filter((row) =>
      row.grnNo.toLowerCase().includes(query) ||
      row.poNo.toLowerCase().includes(query) ||
      row.supplier.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '收货管理' : 'Goods Receipts'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '收货后直接跟踪检查报告、税票状态以及供应商退货动作'
              : 'GRN cockpit for item check report follow-up, tax invoice tracking, and supplier return actions.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建收货单' : 'New GRN'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索收货单号、采购单号、供应商...' : 'Search GRN, PO, supplier...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">GRN</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">PO</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.supplier')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '收货日期' : 'Received Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.warehouse')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '检查报告' : 'Item Check Report'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '税票' : 'Tax Invoice'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '退货单' : 'Goods Return'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.grnNo}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.poNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.supplier : row.supplierEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{row.receivedDate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{language === 'zh-CN' ? row.warehouse : row.warehouseEn}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                      <ClipboardCheck className="h-3 w-3" />
                      {row.itemCheckReport === 'ready' ? (language === 'zh-CN' ? '已完成' : 'Ready') : (language === 'zh-CN' ? '待补' : 'Pending')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.taxInvoice === 'uploaded' ? (language === 'zh-CN' ? '已上传' : 'Uploaded') : (language === 'zh-CN' ? '待收' : 'Pending')}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary-600"
                      onClick={() => navigate('/procurement/goods-returns')}
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                      {row.goodsReturn}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
