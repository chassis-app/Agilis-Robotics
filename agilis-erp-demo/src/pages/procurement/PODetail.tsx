import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowLeft, Pencil, Send, Printer, Download } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface POLineItem {
  id: string
  lineNo: number
  itemNo: string
  itemName: string
  itemNameEn: string
  quantity: number
  uom: string
  unitPrice: number
  amount: number
  receivedQty: number
}

const poData = {
  poNo: 'PO-2024-0002',
  status: 'approved' as DocumentStatus,
  supplierName: '深圳伺服科技股份有限公司',
  supplierNameEn: 'Shenzhen Servo Tech Co., Ltd.',
  supplierContact: '张经理',
  supplierEmail: 'zhang@servotech.cn',
  buyerName: '李明',
  buyerNameEn: 'Ming Li',
  paymentTerms: 'Net 30',
  deliveryDate: '2024-12-25',
  currency: 'CNY',
  totalAmount: 128000,
  createdAt: '2024-12-04',
  prRef: 'PR-2024-0002',
  notes: '手术机器人项目订单，请严格按照图纸要求生产。',
  notesEn: 'Surgical robot project order. Please strictly follow the drawing specifications.',
  lines: [
    { id: '1', lineNo: 1, itemNo: 'ITM-0002', itemName: '钛合金轴', itemNameEn: 'Titanium Alloy Shaft', quantity: 20, uom: 'EA', unitPrice: 2500, amount: 50000, receivedQty: 20 },
    { id: '2', lineNo: 2, itemNo: 'ITM-0003', itemName: '伺服电机模组', itemNameEn: 'Servo Motor Module', quantity: 10, uom: 'EA', unitPrice: 4200, amount: 42000, receivedQty: 8 },
    { id: '3', lineNo: 3, itemNo: 'ITM-0015', itemName: '编码器组件', itemNameEn: 'Encoder Assembly', quantity: 10, uom: 'EA', unitPrice: 1800, amount: 18000, receivedQty: 0 },
    { id: '4', lineNo: 4, itemNo: 'ITM-0018', itemName: '电源模块', itemNameEn: 'Power Supply Module', quantity: 5, uom: 'EA', unitPrice: 3600, amount: 18000, receivedQty: 5 },
  ] as POLineItem[],
}

export default function PODetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{poData.poNo}</h1>
            <StatusBadge status={poData.status} locale={language} />
          </div>
          <p className="text-sm text-neutral-500 mt-1">{t('po.detail_title')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Printer className="h-4 w-4" />
            {language === 'zh-CN' ? '打印' : 'Print'}
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button variant="secondary" size="sm">
            <Pencil className="h-4 w-4" />
            {t('common.edit')}
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4" />
            {t('common.submit')}
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">{t('po.po_no')}</label>
              <p className="text-sm font-mono font-medium text-neutral-900">{poData.poNo}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{t('common.supplier')}</label>
              <p className="text-sm text-neutral-900">
                {language === 'zh-CN' ? poData.supplierName : poData.supplierNameEn}
              </p>
              <p className="text-xs text-neutral-400">{poData.supplierContact} | {poData.supplierEmail}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{t('po.buyer')}</label>
              <p className="text-sm text-neutral-900">{language === 'zh-CN' ? poData.buyerName : poData.buyerNameEn}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">{t('po.payment_terms')}</label>
              <p className="text-sm text-neutral-900">{poData.paymentTerms}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{t('po.delivery_date')}</label>
              <p className="text-sm text-neutral-900">{poData.deliveryDate}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{t('common.total')}</label>
              <p className="text-lg font-semibold text-neutral-900">{formatAmount(poData.totalAmount)}</p>
            </div>
          </div>
        </div>
        {poData.notes && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <label className="text-xs text-neutral-500">{t('common.notes')}</label>
            <p className="text-sm text-neutral-700 mt-1">{language === 'zh-CN' ? poData.notes : poData.notesEn}</p>
          </div>
        )}
      </Card>

      {/* Line Items */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'zh-CN' ? '订单明细' : 'Line Items'}
          </h3>
          <span className="text-sm text-neutral-500">{poData.lines.length} {language === 'zh-CN' ? '项' : 'items'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">#</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('engineering.item_no')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('engineering.item_name')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('common.quantity')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.uom')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('common.unit_price')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('common.amount')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('po.received_qty')}</th>
              </tr>
            </thead>
            <tbody>
              {poData.lines.map(line => {
                const receivePct = line.quantity > 0 ? (line.receivedQty / line.quantity) * 100 : 0
                return (
                  <tr key={line.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.lineNo}</td>
                    <td className="px-3 py-2">
                      <span className="text-sm font-mono text-primary-600">{line.itemNo}</span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900">
                      {language === 'zh-CN' ? line.itemName : line.itemNameEn}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{line.quantity}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{line.uom}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 text-right">{formatAmount(line.unitPrice)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">{formatAmount(line.amount)}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-sm font-medium ${
                          receivePct >= 100 ? 'text-success-600' :
                          receivePct > 0 ? 'text-warning-600' :
                          'text-neutral-400'
                        }`}>
                          {line.receivedQty}/{line.quantity}
                        </span>
                        <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              receivePct >= 100 ? 'bg-success-500' :
                              receivePct > 0 ? 'bg-warning-500' :
                              'bg-neutral-300'
                            }`}
                            style={{ width: `${Math.min(100, receivePct)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-neutral-200 bg-neutral-50">
                <td colSpan={6} className="px-3 py-2 text-sm font-medium text-neutral-900 text-right">{t('common.total')}</td>
                <td className="px-3 py-2 text-sm font-semibold text-neutral-900 text-right">{formatAmount(poData.totalAmount)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
