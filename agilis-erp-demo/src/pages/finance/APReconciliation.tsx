import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { Download, Paperclip, ReceiptText, Search } from 'lucide-react'

interface APRow {
  id: string
  invoiceNo: string
  poNo: string
  grnNo: string
  goodsReturnNo: string
  supplier: string
  supplierEn: string
  invoiceAmount: string
  poAmount: string
  invoiceStatus: 'uploaded' | 'pending' | 'blocked'
  fileName: string
}

const apRows: APRow[] = [
  {
    id: '1',
    invoiceNo: 'INV-2026-0008',
    poNo: 'PO-F-2026-0021',
    grnNo: 'GRN-F-2026-0019',
    goodsReturnNo: 'GRT-F-2026-0007',
    supplier: '苏州精密零件有限公司',
    supplierEn: 'Suzhou Precision Parts',
    invoiceAmount: '¥42,800',
    poAmount: '¥45,000',
    invoiceStatus: 'blocked',
    fileName: 'vat-invoice-return-hold.pdf',
  },
  {
    id: '2',
    invoiceNo: 'INV-2026-0011',
    poNo: 'PO-F-2026-0028',
    grnNo: 'GRN-F-2026-0023',
    goodsReturnNo: '-',
    supplier: '深圳创新电子',
    supplierEn: 'Shenzhen Innovation Electronics',
    invoiceAmount: '¥245,000',
    poAmount: '¥245,000',
    invoiceStatus: 'uploaded',
    fileName: 'vat-invoice-shenzhen-0011.pdf',
  },
  {
    id: '3',
    invoiceNo: 'INV-2026-0012',
    poNo: 'PO-I-2026-0006',
    grnNo: 'GRN-I-2026-0004',
    goodsReturnNo: '-',
    supplier: '上海医疗材料科技',
    supplierEn: 'Shanghai Medical Materials',
    invoiceAmount: '—',
    poAmount: '¥18,600',
    invoiceStatus: 'pending',
    fileName: '—',
  },
]

export default function APReconciliation() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return apRows
    const query = searchQuery.toLowerCase()
    return apRows.filter((row) =>
      row.invoiceNo.toLowerCase().includes(query) ||
      row.poNo.toLowerCase().includes(query) ||
      row.grnNo.toLowerCase().includes(query) ||
      row.supplier.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const invoiceTone = (status: APRow['invoiceStatus']) =>
    status === 'uploaded'
      ? 'bg-success-100 text-success-700'
      : status === 'blocked'
        ? 'bg-danger-100 text-danger-700'
        : 'bg-warning-100 text-warning-700'

  const invoiceLabel = (status: APRow['invoiceStatus']) => {
    if (status === 'uploaded') return language === 'zh-CN' ? '已上传' : 'Uploaded'
    if (status === 'blocked') return language === 'zh-CN' ? '退货冻结' : 'Blocked by Return'
    return language === 'zh-CN' ? '待收票' : 'Pending'
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '应付对账' : 'AP Reconciliation'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '管理税票状态、税票附件上传，以及退货导致的财务冻结'
              : 'Track tax invoice status, uploaded files, and return-driven finance holds.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Paperclip className="h-4 w-4" />
            {language === 'zh-CN' ? '上传税票' : 'Upload Invoice'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '已上传税票' : 'Uploaded Invoices'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{apRows.filter((row) => row.invoiceStatus === 'uploaded').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '待收票' : 'Pending Invoices'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{apRows.filter((row) => row.invoiceStatus === 'pending').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '退货冻结' : 'Blocked by Return'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{apRows.filter((row) => row.invoiceStatus === 'blocked').length}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索发票号、PO、GRN、供应商...' : 'Search invoice, PO, GRN, supplier...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '发票号' : 'Invoice No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">PO</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">GRN</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '退货单' : 'Return No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.supplier')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '发票金额' : 'Invoice Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? 'PO 金额' : 'PO Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '税票状态' : 'Tax Invoice Status'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '附件' : 'Attachment'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.invoiceNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.poNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.grnNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.goodsReturnNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.supplier : row.supplierEn}</td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-neutral-900">{row.invoiceAmount}</td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-neutral-900">{row.poAmount}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${invoiceTone(row.invoiceStatus)}`}>
                      <ReceiptText className="mr-1 h-3 w-3" />
                      {invoiceLabel(row.invoiceStatus)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.fileName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
