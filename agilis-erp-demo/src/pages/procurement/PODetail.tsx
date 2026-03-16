import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { paymentModeLabels } from '@/mock/payment-requests'
import { AlertTriangle, ArrowLeft, CreditCard, Download, Pencil, Printer, Send } from 'lucide-react'
import type { DocumentStatus, PaymentMode } from '@/types'

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

interface POPaymentPlan {
  id: string
  label: string
  mode: PaymentMode
  trigger: string
  percentage: number
  amount: number
  requestedAmount: number
  paidAmount: number
  status: 'open' | 'requested' | 'paid'
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
  outstandingAmount: 90000,
  createdAt: '2024-12-04',
  prRef: 'PR-2024-0002',
  notes: '手术机器人项目订单，请严格按照图纸要求生产。',
  notesEn: 'Surgical robot project order. Please strictly follow the drawing specifications.',
  paymentSummary: {
    hasMixedModes: true,
    reapprovalRequired: true,
    changedFrom: 'Net 30',
    changedTo: '30% Prepay + 40% COD + 30% Monthly Payment',
  },
  paymentPlan: [
    { id: 'pp-1', label: '30% Prepay', mode: 'prepay' as const, trigger: 'Before production start', percentage: 30, amount: 38400, requestedAmount: 38000, paidAmount: 38000, status: 'paid' as const },
    { id: 'pp-2', label: '40% COD', mode: 'cod' as const, trigger: 'On accepted goods receipt', percentage: 40, amount: 51200, requestedAmount: 32000, paidAmount: 0, status: 'requested' as const },
    { id: 'pp-3', label: '30% Monthly Payment', mode: 'monthly' as const, trigger: 'Month-end verified statement', percentage: 30, amount: 38400, requestedAmount: 0, paidAmount: 0, status: 'open' as const },
  ] as POPaymentPlan[],
  paymentRequests: [
    { id: 'payreq-1', requestNo: 'PAY-REQ-2025-0001', amount: 38000, status: 'approved' as DocumentStatus },
    { id: 'payreq-2', requestNo: 'PAY-REQ-2025-0002', amount: 32000, status: 'in_approval' as DocumentStatus },
  ],
  lines: [
    { id: '1', lineNo: 1, itemNo: 'ITM-0002', itemName: '钛合金轴', itemNameEn: 'Titanium Alloy Shaft', quantity: 20, uom: 'EA', unitPrice: 2500, amount: 50000, receivedQty: 20 },
    { id: '2', lineNo: 2, itemNo: 'ITM-0003', itemName: '伺服电机模组', itemNameEn: 'Servo Motor Module', quantity: 10, uom: 'EA', unitPrice: 4200, amount: 42000, receivedQty: 8 },
    { id: '3', lineNo: 3, itemNo: 'ITM-0015', itemName: '编码器组件', itemNameEn: 'Encoder Assembly', quantity: 10, uom: 'EA', unitPrice: 1800, amount: 18000, receivedQty: 0 },
    { id: '4', lineNo: 4, itemNo: 'ITM-0018', itemName: '电源模块', itemNameEn: 'Power Supply Module', quantity: 5, uom: 'EA', unitPrice: 3600, amount: 18000, receivedQty: 5 },
  ] as POLineItem[],
}

export default function PODetail() {
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
          <Button variant="secondary" size="sm" onClick={() => navigate('/finance/payment-requests')}>
            <CreditCard className="h-4 w-4" />
            {language === 'zh-CN' ? '付款申请' : 'Payment Requests'}
          </Button>
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
              <p className="text-sm text-neutral-900">
                {poData.paymentSummary.hasMixedModes
                  ? (language === 'zh-CN' ? '混合付款模式' : 'Mixed payment modes')
                  : poData.paymentTerms}
              </p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{t('po.delivery_date')}</label>
              <p className="text-sm text-neutral-900">{poData.deliveryDate}</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '未付余额' : 'Outstanding Payment'}</label>
              <p className="text-lg font-semibold text-neutral-900">{formatAmount(poData.outstandingAmount)}</p>
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

      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-neutral-900">
                {language === 'zh-CN' ? '付款计划' : 'Payment Plan'}
              </h3>
              {poData.paymentSummary.hasMixedModes && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                  {language === 'zh-CN' ? '同一PO混合付款模式' : 'Mixed modes in same PO'}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {language === 'zh-CN'
                ? '同一张PO内允许预付款、货到付款、月结混合存在，并按付款节点生成申请。'
                : 'Prepay, COD, and monthly settlement can coexist in the same PO and generate payment requests by milestone.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/finance/payment-requests')}>
              {language === 'zh-CN' ? '查看付款申请' : 'View Requests'}
            </Button>
            <Button size="sm" onClick={() => navigate('/finance/payment-requests/new')}>
              <CreditCard className="h-4 w-4" />
              {language === 'zh-CN' ? '生成付款申请' : 'Generate Payment Request'}
            </Button>
          </div>
        </div>

        {poData.paymentSummary.reapprovalRequired && (
          <div className="flex items-start gap-3 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning-800">
                {language === 'zh-CN' ? '付款模式变更需重新审批' : 'Payment mode change requires re-approval'}
              </p>
              <p className="text-sm text-warning-700 mt-1">
                {language === 'zh-CN'
                  ? `原付款条件为 ${poData.paymentSummary.changedFrom}，当前变更为 ${poData.paymentSummary.changedTo}。`
                  : `Original payment terms were ${poData.paymentSummary.changedFrom}; current plan is ${poData.paymentSummary.changedTo}.`}
              </p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '付款阶段' : 'Schedule'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '付款模式' : 'Mode'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '触发条件' : 'Trigger'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '计划金额' : 'Planned Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '已申请' : 'Requested'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '已支付' : 'Paid'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '待付余额' : 'Outstanding'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody>
              {poData.paymentPlan.map(stage => {
                const outstanding = stage.amount - stage.paidAmount
                const stageStatusLabel = {
                  open: language === 'zh-CN' ? '待申请' : 'Open',
                  requested: language === 'zh-CN' ? '申请中' : 'Requested',
                  paid: language === 'zh-CN' ? '已支付' : 'Paid',
                }[stage.status]

                return (
                  <tr key={stage.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-sm text-neutral-900">
                      <div className="font-medium">{stage.label}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{stage.percentage}%</div>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? paymentModeLabels[stage.mode].zh : paymentModeLabels[stage.mode].en}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{stage.trigger}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900 text-right">{formatAmount(stage.amount)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">{formatAmount(stage.requestedAmount)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-right">{formatAmount(stage.paidAmount)}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-neutral-900 text-right">{formatAmount(outstanding)}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{stageStatusLabel}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-neutral-200">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">
            {language === 'zh-CN' ? '已生成付款申请' : 'Generated Payment Requests'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {poData.paymentRequests.map(request => (
              <button
                key={request.id}
                onClick={() => navigate(`/finance/payment-requests/${request.id}`)}
                className="rounded-lg border border-neutral-200 px-4 py-3 text-left hover:border-primary-300 hover:bg-primary-50/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium font-mono text-primary-600">{request.requestNo}</span>
                  <StatusBadge status={request.status} locale={language} />
                </div>
                <p className="text-sm text-neutral-700 mt-2">{formatAmount(request.amount)}</p>
              </button>
            ))}
          </div>
        </div>
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
