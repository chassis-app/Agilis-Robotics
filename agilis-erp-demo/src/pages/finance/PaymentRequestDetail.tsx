import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { paymentModeLabels, paymentRequests } from '@/mock/payment-requests'
import { ArrowLeft, Send, ShieldAlert } from 'lucide-react'
import type { PaymentRequest } from '@/types'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

export default function PaymentRequestDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()

  const locationRequest = (location.state as { request?: PaymentRequest } | null)?.request
  const request = useMemo(
    () => locationRequest ?? paymentRequests.find(item => item.id === id) ?? paymentRequests[0],
    [id, locationRequest],
  )

  const uniquePOs = Array.from(new Set(request.lines.map(line => line.poNo)))
  const requestedAmount = request.lines.reduce((sum, line) => sum + line.requestedAmount, 0)
  const paidAmount = request.lines.reduce((sum, line) => sum + line.paidAmount, 0)
  const outstandingAmount = request.lines.reduce((sum, line) => sum + line.outstandingAmount, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{request.requestNo}</h1>
            <StatusBadge status={request.status} locale={language} />
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN'
              ? '付款申请按供应商整合多个存在未付余额的PO，并进入审批流。'
              : 'Payment requests consolidate one or more open POs for the same vendor and move through approval.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/finance/payment-requests')}>
            {language === 'zh-CN' ? '返回列表' : 'Back to List'}
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4" />
            {request.status === 'draft'
              ? (language === 'zh-CN' ? '提交审批' : 'Submit for Approval')
              : t('common.submit')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '申请金额' : 'Requested Amount'}</p>
          <p className="text-xl font-semibold text-neutral-900 mt-1">{formatCurrency(requestedAmount)}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '已支付' : 'Paid'}</p>
          <p className="text-xl font-semibold text-neutral-900 mt-1">{formatCurrency(paidAmount)}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '剩余待付' : 'Outstanding'}</p>
          <p className="text-xl font-semibold text-neutral-900 mt-1">{formatCurrency(outstandingAmount)}</p>
        </Card>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '供应商' : 'Vendor'}</label>
              <p className="text-sm text-neutral-900">
                {language === 'zh-CN' ? request.supplierName : request.supplierNameEn}
              </p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '申请人' : 'Requester'}</label>
              <p className="text-sm text-neutral-900">
                {language === 'zh-CN' ? request.requesterName : request.requesterNameEn}
              </p>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{t('common.created_at')}</label>
              <p className="text-sm text-neutral-900">{request.createdAt}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '关联PO' : 'Linked POs'}</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {uniquePOs.map(poNo => (
                  <button
                    key={poNo}
                    onClick={() => navigate(`/procurement/purchase-orders/${poNo}`)}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                  >
                    {poNo}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '付款原因' : 'Reason'}</label>
              <p className="text-sm text-neutral-700">{request.reason}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-warning-200 bg-warning-50">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-warning-600 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-warning-800">
              {language === 'zh-CN' ? '审批控制' : 'Approval Control'}
            </h2>
            <p className="text-sm text-warning-700 mt-1">
              {language === 'zh-CN'
                ? '若来源PO的付款模式发生变更，系统应重新触发审批，旧付款申请标记为需复核。'
                : 'If the source PO payment mode changes, approval must restart and existing payment requests should be flagged for review.'}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="sm" className="overflow-hidden">
        <div className="px-3 py-3 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">
            {language === 'zh-CN' ? '付款申请明细' : 'Payment Request Lines'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'PO编号' : 'PO No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '付款阶段' : 'Schedule'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '付款模式' : 'Mode'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '触发条件' : 'Trigger'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '申请金额' : 'Requested'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '已支付' : 'Paid'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '未付余额' : 'Outstanding'}</th>
              </tr>
            </thead>
            <tbody>
              {request.lines.map(line => (
                <tr key={line.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono text-primary-600">{line.poNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900">{line.scheduleLabel}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? paymentModeLabels[line.mode].zh : paymentModeLabels[line.mode].en}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{line.trigger}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900 text-right">{formatCurrency(line.requestedAmount)}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-right">{formatCurrency(line.paidAmount)}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-neutral-900 text-right">{formatCurrency(line.outstandingAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
