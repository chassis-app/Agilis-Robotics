import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { paymentModeLabels, paymentRequests } from '@/mock/payment-requests'
import { CreditCard, Plus, Receipt, Workflow } from 'lucide-react'
import type { PaymentMode } from '@/types'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

function getModeSummary(modes: PaymentMode[], language: string) {
  return modes
    .map(mode => (language === 'zh-CN' ? paymentModeLabels[mode].zh : paymentModeLabels[mode].en))
    .join(' / ')
}

export default function PaymentRequestList() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()

  const stats = useMemo(() => {
    const inApproval = paymentRequests.filter(request => request.status === 'in_approval').length
    const draft = paymentRequests.filter(request => request.status === 'draft').length
    const totalAmount = paymentRequests.reduce((sum, request) => sum + request.totalAmount, 0)

    return { inApproval, draft, totalAmount }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '付款申请' : 'Payment Requests'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN'
              ? '按供应商汇总存在未付余额的采购订单，并生成审批中的付款申请。'
              : 'Group open vendor balances across one or more POs and submit payment requests for approval.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/finance/ap-reconciliation')}>
            <Receipt className="h-4 w-4" />
            {language === 'zh-CN' ? '查看应付对账' : 'View AP Reconciliation'}
          </Button>
          <Button size="sm" onClick={() => navigate('/finance/payment-requests/new')}>
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建付款申请' : 'New Payment Request'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '审批中申请' : 'In Approval'}</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{stats.inApproval}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center">
              <Workflow className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '草稿申请' : 'Draft Requests'}</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{stats.draft}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '申请总额' : 'Requested Amount'}</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '付款申请号' : 'Request No'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '供应商' : 'Vendor'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '关联PO' : 'Linked POs'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '付款模式' : 'Payment Modes'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {language === 'zh-CN' ? '申请金额' : 'Requested Amount'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {t('common.created_at')}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {t('common.status')}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentRequests.map(request => {
                const modes = Array.from(new Set(request.lines.map(line => line.mode)))

                return (
                  <tr key={request.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-2">
                      <button
                        className="text-sm font-medium text-primary-600 font-mono"
                        onClick={() => navigate(`/finance/payment-requests/${request.id}`)}
                      >
                        {request.requestNo}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? request.supplierName : request.supplierNameEn}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      <span className="font-medium text-neutral-900">{request.poCount}</span>{' '}
                      {language === 'zh-CN' ? '个PO' : 'POs'}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {getModeSummary(modes, language)}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900 font-medium text-right">
                      {formatCurrency(request.totalAmount)}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{request.createdAt}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={request.status} locale={language} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/finance/payment-requests/${request.id}`)}
                      >
                        {t('common.details')}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
