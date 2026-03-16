import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/store/useAuthStore'
import {
  CheckCircle2, XCircle, Clock, FileText, ClipboardList,
  Factory, ShieldCheck, PenTool, CreditCard, RefreshCcw
} from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface ApprovalItem {
  id: string
  docNo: string
  type: 'pr' | 'po' | 'wo' | 'insp' | 'payment_request' | 'po_change'
  title: string
  titleEn: string
  requester: string
  department: string
  date: string
  amount?: string
  status: DocumentStatus
  urgency?: 'normal' | 'urgent'
}

const approvalItems: ApprovalItem[] = [
  { id: '1', docNo: 'PR-2024-0003', type: 'pr', title: '钛合金轴采购申请', titleEn: 'Titanium Alloy Shaft PR', requester: '王芳', department: '工程部', date: '2024-12-15', amount: '¥45,000', status: 'in_approval', urgency: 'urgent' },
  { id: '2', docNo: 'PR-2024-0004', type: 'pr', title: '伺服电机模组采购', titleEn: 'Servo Motor Module PR', requester: '李明', department: '供应链', date: '2024-12-14', amount: '¥128,000', status: 'in_approval' },
  { id: '3', docNo: 'PAY-REQ-2025-0002', type: 'payment_request', title: '深圳伺服科技 付款申请', titleEn: 'Shenzhen Servo Tech Payment Request', requester: '陈雨', department: '财务部', date: '2025-01-09', amount: '¥62,000', status: 'in_approval' },
  { id: '4', docNo: 'PO-2024-0002', type: 'po_change', title: '采购订单付款模式变更', titleEn: 'PO Payment Mode Change', requester: '李明', department: '供应链', date: '2025-01-08', amount: '¥128,000', status: 'in_approval', urgency: 'urgent' },
  { id: '5', docNo: 'PO-2024-0005', type: 'po', title: '轴承套件采购订单', titleEn: 'Bearing Set PO', requester: '李明', department: '供应链', date: '2024-12-12', amount: '¥12,000', status: 'in_approval' },
  { id: '6', docNo: 'WO-2024-0003', type: 'wo', title: '不锈钢外壳生产审批', titleEn: 'Stainless Steel Housing WO', requester: '刘洋', department: '生产部', date: '2024-12-11', status: 'submitted' },
]

const typeIcons = {
  pr: FileText,
  po: ClipboardList,
  wo: Factory,
  insp: ShieldCheck,
  payment_request: CreditCard,
  po_change: RefreshCcw,
}

const typeColors = {
  pr: 'bg-primary-50 text-primary-600',
  po: 'bg-success-50 text-success-600',
  wo: 'bg-warning-50 text-warning-600',
  insp: 'bg-info-50 text-info-600',
  payment_request: 'bg-primary-50 text-primary-600',
  po_change: 'bg-warning-50 text-warning-700',
}

export default function ApprovalInbox() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useAuthStore()
  const [items, setItems] = useState(approvalItems)
  const [signModalOpen, setSignModalOpen] = useState(false)
  const [signAction, setSignAction] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null)
  const [password, setPassword] = useState('')
  const [comment, setComment] = useState('')

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setSignAction({ id, action })
    setSignModalOpen(true)
  }

  const confirmSign = () => {
    if (!signAction) return
    setItems(prev => prev.filter(item => item.id !== signAction.id))
    setSignModalOpen(false)
    setPassword('')
    setComment('')
    toast(
      signAction.action === 'approve' ? 'success' : 'info',
      signAction.action === 'approve'
        ? (language === 'zh-CN' ? '已批准' : 'Approved successfully')
        : (language === 'zh-CN' ? '已驳回' : 'Rejected successfully')
    )
  }

  const navigateToDoc = (item: ApprovalItem) => {
    if (item.type === 'pr') navigate(`/procurement/purchase-requisitions/${item.docNo}`)
    else if (item.type === 'po') navigate(`/procurement/purchase-orders/${item.docNo}`)
    else if (item.type === 'po_change') navigate(`/procurement/purchase-orders/${item.docNo}`)
    else if (item.type === 'wo') navigate(`/manufacturing/work-orders/${item.docNo}`)
    else if (item.type === 'payment_request') navigate('/finance/payment-requests/payreq-2')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{t('approval.inbox_title')}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? `${items.length} 项待审批` : `${items.length} items pending approval`}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="h-12 w-12 text-success-500 mb-4" />
          <p className="text-base font-medium text-neutral-700">
            {language === 'zh-CN' ? '所有审批已处理完毕' : 'All approvals processed'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = typeIcons[item.type]
            return (
              <Card key={item.id} hover className="!p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[item.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigateToDoc(item)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-neutral-900 font-mono">{item.docNo}</span>
                      <StatusBadge status={item.status} locale={language} />
                      {item.type === 'payment_request' && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded">
                          {language === 'zh-CN' ? '付款申请' : 'Payment Request'}
                        </span>
                      )}
                      {item.type === 'po_change' && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-warning-50 text-warning-700 rounded">
                          {language === 'zh-CN' ? '付款模式变更' : 'Payment Mode Change'}
                        </span>
                      )}
                      {item.urgency === 'urgent' && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-danger-50 text-danger-600 rounded">
                          {language === 'zh-CN' ? '紧急' : 'Urgent'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 mt-0.5 truncate">
                      {language === 'zh-CN' ? item.title : item.titleEn}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                      <span>{item.requester} · {item.department}</span>
                      <span>{item.date}</span>
                      {item.amount && <span className="font-medium text-neutral-600">{item.amount}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAction(item.id, 'reject')}
                    >
                      <XCircle className="h-4 w-4 text-danger-500" />
                      {t('common.reject')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(item.id, 'approve')}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t('common.approve')}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* E-Signature Modal */}
      <Modal
        open={signModalOpen}
        onClose={() => { setSignModalOpen(false); setPassword(''); setComment('') }}
        title={t('approval.sign_confirm')}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setSignModalOpen(false); setPassword(''); setComment('') }}>
              {t('common.cancel')}
            </Button>
            <Button
              variant={signAction?.action === 'approve' ? 'primary' : 'danger'}
              onClick={confirmSign}
              disabled={!password}
            >
              <PenTool className="h-4 w-4" />
              {t('approval.sign_button')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">{t('approval.sign_prompt')}</p>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-50 border border-warning-100">
            <Clock className="h-5 w-5 text-warning-500 shrink-0 mt-0.5" />
            <div className="text-sm text-warning-700">
              {signAction?.action === 'approve'
                ? (language === 'zh-CN' ? '您即将批准此文档。此操作将被记录在审计日志中。' : 'You are about to approve this document. This action will be recorded in the audit trail.')
                : (language === 'zh-CN' ? '您即将驳回此文档。此操作将被记录在审计日志中。' : 'You are about to reject this document. This action will be recorded in the audit trail.')
              }
            </div>
          </div>
          <Input
            label={t('approval.password')}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">{t('approval.comment')}</label>
            <textarea
              className="px-3 py-2 rounded-md border border-neutral-300 text-sm resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={language === 'zh-CN' ? '审批意见（可选）' : 'Comment (optional)'}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
