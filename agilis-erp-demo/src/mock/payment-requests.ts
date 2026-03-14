import type { PaymentMode, PaymentRequest } from '@/types'

export interface OutstandingPOOption {
  id: string
  poNo: string
  supplierId: string
  supplierName: string
  supplierNameEn: string
  poDate: string
  poAmount: number
  requestedAmount: number
  paidAmount: number
  outstandingAmount: number
  nextMilestone: string
  paymentModes: PaymentMode[]
}

export const paymentModeLabels: Record<PaymentMode, { zh: string; en: string }> = {
  prepay: { zh: '预付款', en: 'Prepay' },
  cod: { zh: '货到付款', en: 'COD' },
  monthly: { zh: '月结', en: 'Monthly Payment' },
}

export const outstandingPOs: OutstandingPOOption[] = [
  {
    id: 'opo-1',
    poNo: 'PO-2024-0002',
    supplierId: 'sup2',
    supplierName: '深圳伺服科技股份有限公司',
    supplierNameEn: 'Shenzhen Servo Tech Co., Ltd.',
    poDate: '2024-12-04',
    poAmount: 128000,
    requestedAmount: 68000,
    paidAmount: 38000,
    outstandingAmount: 90000,
    nextMilestone: 'COD on remaining goods receipt',
    paymentModes: ['prepay', 'cod', 'monthly'],
  },
  {
    id: 'opo-2',
    poNo: 'PO-2024-0011',
    supplierId: 'sup2',
    supplierName: '深圳伺服科技股份有限公司',
    supplierNameEn: 'Shenzhen Servo Tech Co., Ltd.',
    poDate: '2024-12-18',
    poAmount: 86000,
    requestedAmount: 20000,
    paidAmount: 20000,
    outstandingAmount: 66000,
    nextMilestone: 'Monthly settlement due on 2025-01-31',
    paymentModes: ['monthly'],
  },
  {
    id: 'opo-3',
    poNo: 'PO-2024-0008',
    supplierId: 'sup3',
    supplierName: '苏州精密零件有限公司',
    supplierNameEn: 'Suzhou Precision Parts Co., Ltd.',
    poDate: '2024-12-09',
    poAmount: 45000,
    requestedAmount: 15000,
    paidAmount: 15000,
    outstandingAmount: 30000,
    nextMilestone: 'COD on final inspection release',
    paymentModes: ['prepay', 'cod'],
  },
  {
    id: 'opo-4',
    poNo: 'PO-2024-0010',
    supplierId: 'sup3',
    supplierName: '苏州精密零件有限公司',
    supplierNameEn: 'Suzhou Precision Parts Co., Ltd.',
    poDate: '2024-12-22',
    poAmount: 73500,
    requestedAmount: 0,
    paidAmount: 0,
    outstandingAmount: 73500,
    nextMilestone: '30% prepay required before supplier start',
    paymentModes: ['prepay', 'monthly'],
  },
]

export const paymentRequests: PaymentRequest[] = [
  {
    id: 'payreq-1',
    requestNo: 'PAY-REQ-2025-0001',
    status: 'approved',
    supplierId: 'sup2',
    supplierName: '深圳伺服科技股份有限公司',
    supplierNameEn: 'Shenzhen Servo Tech Co., Ltd.',
    requesterName: '李明',
    requesterNameEn: 'Ming Li',
    createdAt: '2025-01-03',
    totalAmount: 38000,
    currency: 'CNY',
    poCount: 1,
    reason: 'PO-2024-0002 30% prepay before production',
    lines: [
      {
        id: 'prl-1',
        poId: 'po-2024-0002',
        poNo: 'PO-2024-0002',
        scheduleId: 'ps-1',
        scheduleLabel: '30% Prepay',
        mode: 'prepay',
        requestedAmount: 38000,
        paidAmount: 38000,
        outstandingAmount: 0,
        trigger: 'Before production start',
      },
    ],
  },
  {
    id: 'payreq-2',
    requestNo: 'PAY-REQ-2025-0002',
    status: 'in_approval',
    supplierId: 'sup2',
    supplierName: '深圳伺服科技股份有限公司',
    supplierNameEn: 'Shenzhen Servo Tech Co., Ltd.',
    requesterName: '陈雨',
    requesterNameEn: 'Yu Chen',
    createdAt: '2025-01-09',
    totalAmount: 62000,
    currency: 'CNY',
    poCount: 2,
    reason: 'Combine COD and month-end settlements for open vendor balance',
    lines: [
      {
        id: 'prl-2',
        poId: 'po-2024-0002',
        poNo: 'PO-2024-0002',
        scheduleId: 'ps-2',
        scheduleLabel: '40% COD',
        mode: 'cod',
        requestedAmount: 32000,
        paidAmount: 0,
        outstandingAmount: 32000,
        trigger: 'On accepted goods receipt',
      },
      {
        id: 'prl-3',
        poId: 'po-2024-0011',
        poNo: 'PO-2024-0011',
        scheduleId: 'ps-3',
        scheduleLabel: 'Month-end settlement',
        mode: 'monthly',
        requestedAmount: 30000,
        paidAmount: 0,
        outstandingAmount: 30000,
        trigger: 'End of month statement',
      },
    ],
  },
  {
    id: 'payreq-3',
    requestNo: 'PAY-REQ-2025-0003',
    status: 'draft',
    supplierId: 'sup3',
    supplierName: '苏州精密零件有限公司',
    supplierNameEn: 'Suzhou Precision Parts Co., Ltd.',
    requesterName: '赵静',
    requesterNameEn: 'Jing Zhao',
    createdAt: '2025-01-14',
    totalAmount: 52050,
    currency: 'CNY',
    poCount: 2,
    reason: 'Initial request for mixed prepay and monthly terms',
    lines: [
      {
        id: 'prl-4',
        poId: 'po-2024-0008',
        poNo: 'PO-2024-0008',
        scheduleId: 'ps-4',
        scheduleLabel: 'COD on final inspection',
        mode: 'cod',
        requestedAmount: 18000,
        paidAmount: 0,
        outstandingAmount: 18000,
        trigger: 'After incoming inspection release',
      },
      {
        id: 'prl-5',
        poId: 'po-2024-0010',
        poNo: 'PO-2024-0010',
        scheduleId: 'ps-5',
        scheduleLabel: '30% Prepay',
        mode: 'prepay',
        requestedAmount: 22050,
        paidAmount: 0,
        outstandingAmount: 22050,
        trigger: 'Before supplier starts work',
      },
      {
        id: 'prl-6',
        poId: 'po-2024-0010',
        poNo: 'PO-2024-0010',
        scheduleId: 'ps-6',
        scheduleLabel: 'Monthly settlement',
        mode: 'monthly',
        requestedAmount: 12000,
        paidAmount: 0,
        outstandingAmount: 12000,
        trigger: 'Month-end verified statement',
      },
    ],
  },
]
