import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Select'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/useAuthStore'
import { outstandingPOs, paymentModeLabels } from '@/mock/payment-requests'
import { ArrowLeft, Layers3, WandSparkles } from 'lucide-react'
import type { PaymentRequest } from '@/types'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

export default function PaymentRequestCreate() {
  const navigate = useNavigate()
  const { language } = useAuthStore()

  const vendorOptions = useMemo(() => {
    const uniqueVendors = Array.from(
      new Map(
        outstandingPOs.map(row => [
          row.supplierId,
          {
            value: row.supplierId,
            label: language === 'zh-CN' ? row.supplierName : row.supplierNameEn,
          },
        ]),
      ).values(),
    )

    return uniqueVendors
  }, [language])

  const [selectedVendorId, setSelectedVendorId] = useState(vendorOptions[0]?.value ?? '')
  const [selectedPOIds, setSelectedPOIds] = useState<string[]>([])

  const vendorPOs = outstandingPOs.filter(row => row.supplierId === selectedVendorId)

  const selectedPOs = vendorPOs.filter(row => selectedPOIds.includes(row.id))
  const totalSelectedAmount = selectedPOs.reduce((sum, row) => sum + row.outstandingAmount, 0)

  const toggleSelection = (poId: string) => {
    setSelectedPOIds(prev => (
      prev.includes(poId) ? prev.filter(id => id !== poId) : [...prev, poId]
    ))
  }

  const handleVendorChange = (vendorId: string) => {
    setSelectedVendorId(vendorId)
    setSelectedPOIds([])
  }

  const handleGenerate = () => {
    if (selectedPOs.length === 0) return

    const firstPO = selectedPOs[0]
    const generatedRequest: PaymentRequest = {
      id: 'payreq-generated',
      requestNo: 'PAY-REQ-2025-NEW',
      status: 'draft',
      supplierId: firstPO.supplierId,
      supplierName: firstPO.supplierName,
      supplierNameEn: firstPO.supplierNameEn,
      requesterName: '陈雨',
      requesterNameEn: 'Yu Chen',
      createdAt: '2025-01-16',
      totalAmount: totalSelectedAmount,
      currency: 'CNY',
      poCount: selectedPOs.length,
      reason: language === 'zh-CN'
        ? '按供应商汇总存在未付余额的采购订单，生成付款申请。'
        : 'Generate one payment request by grouping open vendor balances across selected POs.',
      lines: selectedPOs.map(row => ({
        id: `generated-${row.id}`,
        poId: row.id,
        poNo: row.poNo,
        scheduleId: `schedule-${row.id}`,
        scheduleLabel: language === 'zh-CN' ? '待生成付款计划' : 'Generated payment plan',
        mode: row.paymentModes[0],
        requestedAmount: row.outstandingAmount,
        paidAmount: 0,
        outstandingAmount: row.outstandingAmount,
        trigger: row.nextMilestone,
      })),
    }

    toast(
      'success',
      language === 'zh-CN'
        ? '已生成付款申请草稿'
        : 'Draft payment request generated',
    )

    navigate('/finance/payment-requests/payreq-generated', {
      state: { request: generatedRequest },
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '新建付款申请' : 'Create Payment Request'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN'
              ? '选择供应商后展示所有存在未付余额的PO，可选择1-N个PO生成一张付款申请。'
              : 'Choose a vendor, review all POs with outstanding balances, and generate one request from one or more POs.'}
          </p>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Select
            label={language === 'zh-CN' ? '选择供应商' : 'Choose Vendor'}
            value={selectedVendorId}
            onChange={(event) => handleVendorChange(event.target.value)}
            options={vendorOptions}
          />
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '已选PO' : 'Selected POs'}</p>
            <p className="text-lg font-semibold text-neutral-900 mt-1">{selectedPOs.length}</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-xs text-neutral-500">{language === 'zh-CN' ? '申请金额合计' : 'Selected Outstanding Amount'}</p>
            <p className="text-lg font-semibold text-neutral-900 mt-1">{formatCurrency(totalSelectedAmount)}</p>
          </div>
        </div>
      </Card>

      <Card padding="sm" className="overflow-hidden">
        <div className="flex items-center justify-between px-3 py-3 border-b border-neutral-200">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {language === 'zh-CN' ? '存在未付余额的采购订单' : 'POs with Outstanding Payment'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {language === 'zh-CN'
                ? '仅展示当前供应商下存在未申请或未支付余额的PO。'
                : 'Only approved/open POs with unpaid balances for the selected vendor are shown.'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            <Layers3 className="h-3.5 w-3.5" />
            {language === 'zh-CN' ? '支持1-N个PO合并申请' : 'Supports 1-N POs per request'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500"></th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'PO编号' : 'PO No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'PO日期' : 'PO Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? 'PO金额' : 'PO Amount'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '已申请' : 'Requested'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '已支付' : 'Paid'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '未付余额' : 'Outstanding'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '付款模式' : 'Payment Modes'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '下一付款节点' : 'Next Payable Milestone'}</th>
              </tr>
            </thead>
            <tbody>
              {vendorPOs.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selectedPOIds.includes(row.id)}
                      onChange={() => toggleSelection(row.id)}
                    />
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-primary-600">{row.poNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.poDate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-900 text-right">{formatCurrency(row.poAmount)}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-right">{formatCurrency(row.requestedAmount)}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700 text-right">{formatCurrency(row.paidAmount)}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-neutral-900 text-right">{formatCurrency(row.outstandingAmount)}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {row.paymentModes.map(mode => (
                      <span key={mode} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 mr-1 mb-1">
                        {language === 'zh-CN' ? paymentModeLabels[mode].zh : paymentModeLabels[mode].en}
                      </span>
                    ))}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.nextMilestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {language === 'zh-CN' ? '生成规则' : 'Generation Rule'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {language === 'zh-CN'
                ? '系统按当前所选供应商与PO组合生成一张付款申请，后续进入审批流。'
                : 'The system creates one payment request from the selected vendor and PO combination, then sends it into approval.'}
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={selectedPOs.length === 0}>
            <WandSparkles className="h-4 w-4" />
            {language === 'zh-CN' ? '生成付款申请' : 'Generate Payment Request'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
