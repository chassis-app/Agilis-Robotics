import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { useAuthStore } from '@/store/useAuthStore'
import {
  ArrowLeft, Pencil, Send, CheckCircle2, XCircle,
  Clock, FileText, PenTool, Paperclip
} from 'lucide-react'
import type { DocumentStatus, ApprovalStep, AuditEntry } from '@/types'

const prData = {
  prNo: 'PR-2024-0003',
  status: 'in_approval' as DocumentStatus,
  requester: '王芳',
  requesterEn: 'Fang Wang',
  department: '工程部',
  departmentEn: 'Engineering',
  priority: 'urgent' as const,
  requiredDate: '2024-12-25',
  createdAt: '2024-12-05 10:30',
  notes: '手术机器人项目紧急需求，请尽快处理。',
  notesEn: 'Urgent request for surgical robot project, please process ASAP.',
  totalAmount: '¥92,000',
  lines: [
    { id: '1', lineNo: 1, itemNo: 'ITM-0002', itemName: '钛合金轴', itemNameEn: 'Titanium Alloy Shaft', revision: 'A', quantity: 20, uom: 'EA', warehouseName: '主仓库', requiredDate: '2024-12-25', estimatedUnitPrice: 2500, currency: 'CNY', stockStatus: 'low' as const },
    { id: '2', lineNo: 2, itemNo: 'ITM-0003', itemName: '伺服电机模组', itemNameEn: 'Servo Motor Module', revision: 'B', quantity: 10, uom: 'EA', warehouseName: '主仓库', requiredDate: '2024-12-25', estimatedUnitPrice: 4200, currency: 'CNY', stockStatus: 'out' as const },
    { id: '3', lineNo: 3, itemNo: 'ITM-0011', itemName: '轴承套件', itemNameEn: 'Bearing Set', revision: 'A', quantity: 50, uom: 'SET', warehouseName: '主仓库', requiredDate: '2024-12-28', estimatedUnitPrice: 0, currency: 'CNY', stockStatus: 'sufficient' as const },
    { id: '4', lineNo: 4, itemNo: 'ITM-0005', itemName: '硅胶末端执行器头', itemNameEn: 'Silicone End Effector Tip', revision: 'C', quantity: 30, uom: 'EA', warehouseName: '主仓库', requiredDate: '2024-12-30', estimatedUnitPrice: 0, currency: 'CNY', stockStatus: 'sufficient' as const },
  ],
}

const approvalSteps: ApprovalStep[] = [
  { id: '1', step: 1, role: '部门经理', approverName: '张伟', approverId: 'u1', decision: 'approved', comment: '同意，项目需要。', timestamp: '2024-12-06 09:15', signatureHash: 'a3f2...8b1c', verified: true },
  { id: '2', step: 2, role: '供应链经理', approverName: '李明', approverId: 'u2', decision: 'pending', comment: null, timestamp: null, signatureHash: null, verified: false },
  { id: '3', step: 3, role: '总经理', approverName: '黄强', approverId: 'u7', decision: null, comment: null, timestamp: null, signatureHash: null, verified: false },
]

const auditEntries: AuditEntry[] = [
  { id: '1', entityType: 'purchase_requisition', entityId: 'PR-2024-0003', action: 'create', field: null, oldValue: null, newValue: null, userId: 'u3', userName: '王芳', timestamp: '2024-12-05 10:30', ipAddress: '192.168.1.100' },
  { id: '2', entityType: 'purchase_requisition', entityId: 'PR-2024-0003', action: 'update', field: 'priority', oldValue: 'normal', newValue: 'urgent', userId: 'u3', userName: '王芳', timestamp: '2024-12-05 10:45', ipAddress: '192.168.1.100' },
  { id: '3', entityType: 'purchase_requisition', entityId: 'PR-2024-0003', action: 'submit', field: 'status', oldValue: 'draft', newValue: 'submitted', userId: 'u3', userName: '王芳', timestamp: '2024-12-05 11:00', ipAddress: '192.168.1.100' },
  { id: '4', entityType: 'purchase_requisition', entityId: 'PR-2024-0003', action: 'approve', field: 'status', oldValue: 'submitted', newValue: 'in_approval', userId: 'u1', userName: '张伟', timestamp: '2024-12-06 09:15', ipAddress: '192.168.1.101' },
]

export default function PRDetail() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [activeTab, setActiveTab] = useState('details')

  const tabs = [
    { id: 'details', label: language === 'zh-CN' ? '申请详情' : 'Details' },
    { id: 'approvals', label: language === 'zh-CN' ? '审批流程' : 'Approvals' },
    { id: 'documents', label: language === 'zh-CN' ? '相关文档' : 'Documents' },
    { id: 'audit', label: language === 'zh-CN' ? '审计日志' : 'Audit Trail' },
  ]

  const stockIcon = (status: 'sufficient' | 'low' | 'out') => {
    if (status === 'sufficient') return <CheckCircle2 className="h-4 w-4 text-success-500" />
    if (status === 'low') return <Clock className="h-4 w-4 text-warning-500" />
    return <XCircle className="h-4 w-4 text-danger-500" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900 font-mono">{prData.prNo}</h1>
            <StatusBadge status={prData.status} locale={language} />
            {prData.priority === 'urgent' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-danger-50 text-danger-600 rounded">{t('common.urgent')}</span>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1">{t('pr.detail_title')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Pencil className="h-4 w-4" />{t('common.edit')}</Button>
          <Button size="sm"><Send className="h-4 w-4" />{t('common.submit')}</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Header Fields - 2 column grid */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-500">{t('pr.pr_no')}</label>
                  <p className="text-sm font-mono font-medium text-neutral-900">{prData.prNo}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{t('common.requester')}</label>
                  <p className="text-sm text-neutral-900">{language === 'zh-CN' ? prData.requester : prData.requesterEn}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{t('common.required_date')}</label>
                  <p className="text-sm text-neutral-900">{prData.requiredDate}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-500">{t('common.status')}</label>
                  <div className="mt-0.5"><StatusBadge status={prData.status} locale={language} /></div>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{t('common.department')}</label>
                  <p className="text-sm text-neutral-900">{language === 'zh-CN' ? prData.department : prData.departmentEn}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">{t('common.priority')}</label>
                  <p className="text-sm text-neutral-900">{prData.priority === 'urgent' ? t('common.urgent') : t('common.normal')}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <label className="text-xs text-neutral-500">{t('common.notes')}</label>
              <p className="text-sm text-neutral-700 mt-1">{language === 'zh-CN' ? prData.notes : prData.notesEn}</p>
            </div>
          </Card>

          {/* Line Items */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900">{t('pr.line_items')}</h3>
              <span className="text-sm text-neutral-500">{prData.lines.length} {language === 'zh-CN' ? '项' : 'items'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">#</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.item')}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.revision')}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.quantity')}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.uom')}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.warehouse')}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.required_date')}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{t('pr.estimated_price')}</th>
                    <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('pr.stock_info')}</th>
                  </tr>
                </thead>
                <tbody>
                  {prData.lines.map(line => (
                    <tr key={line.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-3 py-2 text-sm text-neutral-500">{line.lineNo}</td>
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-neutral-900">{language === 'zh-CN' ? line.itemName : line.itemNameEn}</div>
                        <div className="text-xs text-neutral-400 font-mono">{line.itemNo}</div>
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{line.revision}</td>
                      <td className="px-3 py-2 text-sm text-neutral-900 font-medium">{line.quantity}</td>
                      <td className="px-3 py-2 text-sm text-neutral-500">{line.uom}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{line.warehouseName}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{line.requiredDate}</td>
                      <td className="px-3 py-2 text-sm text-neutral-900 text-right">
                        {line.estimatedUnitPrice > 0 ? `¥${line.estimatedUnitPrice.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-3 py-2">{stockIcon(line.stockStatus)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-neutral-200 bg-neutral-50">
                    <td colSpan={7} className="px-3 py-2 text-sm font-medium text-neutral-900 text-right">{t('common.total')}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-neutral-900 text-right">{prData.totalAmount}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Visual Timeline */}
          <Card>
            <h3 className="text-base font-semibold text-neutral-900 mb-6">{language === 'zh-CN' ? '审批流程' : 'Approval Flow'}</h3>
            <div className="flex items-start justify-between px-4">
              {approvalSteps.map((step, i) => {
                const isLast = i === approvalSteps.length - 1
                return (
                  <div key={step.id} className="flex-1 flex flex-col items-center relative">
                    {/* Connecting line */}
                    {!isLast && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                        step.decision === 'approved' ? 'bg-success-500' : 'bg-neutral-300'
                      }`} />
                    )}
                    {/* Circle */}
                    <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center ${
                      step.decision === 'approved' ? 'bg-success-500' :
                      step.decision === 'rejected' ? 'bg-danger-500' :
                      step.decision === 'pending' ? 'bg-warning-500' :
                      'bg-neutral-300'
                    }`}>
                      {step.decision === 'approved' && <CheckCircle2 className="h-5 w-5 text-white" />}
                      {step.decision === 'rejected' && <XCircle className="h-5 w-5 text-white" />}
                      {step.decision === 'pending' && <Clock className="h-5 w-5 text-white" />}
                      {!step.decision && <span className="h-3 w-3 rounded-full bg-white" />}
                    </div>
                    {/* Info */}
                    <div className="text-center mt-3">
                      <p className="text-sm font-medium text-neutral-900">{step.approverName}</p>
                      <p className="text-xs text-neutral-500">{step.role}</p>
                      {step.timestamp && <p className="text-xs text-neutral-400 mt-1">{step.timestamp}</p>}
                      {step.comment && <p className="text-xs text-neutral-600 mt-1 italic">"{step.comment}"</p>}
                      {step.verified && (
                        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-success-600">
                          <PenTool className="h-3 w-3" />
                          <span>{t('approval.verified')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Approval History Table */}
          <Card>
            <h3 className="text-base font-semibold text-neutral-900 mb-4">{t('pr.approval_history')}</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('approval.step')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('approval.approver')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('approval.role')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('approval.decision')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('approval.comment')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.date')}</th>
                  <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('approval.signature')}</th>
                </tr>
              </thead>
              <tbody>
                {approvalSteps.map(step => (
                  <tr key={step.id} className="border-b border-neutral-100">
                    <td className="px-3 py-2 text-sm text-neutral-700">{step.step}</td>
                    <td className="px-3 py-2 text-sm text-neutral-900">{step.approverName}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{step.role}</td>
                    <td className="px-3 py-2">
                      {step.decision === 'approved' && <span className="text-sm text-success-600 font-medium">{t('common.approve')}</span>}
                      {step.decision === 'rejected' && <span className="text-sm text-danger-600 font-medium">{t('common.reject')}</span>}
                      {step.decision === 'pending' && <span className="text-sm text-warning-600">{t('approval.pending')}</span>}
                      {!step.decision && <span className="text-sm text-neutral-400">-</span>}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{step.comment || '-'}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{step.timestamp || '-'}</td>
                    <td className="px-3 py-2">
                      {step.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success-600">
                          <CheckCircle2 className="h-3 w-3" /> {t('approval.verified')}
                        </span>
                      ) : (
                        <span className="text-sm text-neutral-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {activeTab === 'documents' && (
        <Card className="flex flex-col items-center justify-center py-16">
          <Paperclip className="h-12 w-12 text-neutral-300 mb-4" />
          <p className="text-base font-medium text-neutral-700">
            {language === 'zh-CN' ? '暂无相关文档' : 'No related documents'}
          </p>
          <Button variant="secondary" size="sm" className="mt-4">
            <Paperclip className="h-4 w-4" />
            {language === 'zh-CN' ? '上传文档' : 'Upload Document'}
          </Button>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <h3 className="text-base font-semibold text-neutral-900 mb-4">{t('pr.audit_trail')}</h3>
          <div className="space-y-4">
            {auditEntries.map((entry, i) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    entry.action === 'create' ? 'bg-success-100 text-success-600' :
                    entry.action === 'update' ? 'bg-primary-100 text-primary-600' :
                    entry.action === 'submit' ? 'bg-warning-100 text-warning-600' :
                    'bg-info-100 text-info-600'
                  }`}>
                    {entry.action === 'create' && <FileText className="h-4 w-4" />}
                    {entry.action === 'update' && <Pencil className="h-4 w-4" />}
                    {entry.action === 'submit' && <Send className="h-4 w-4" />}
                    {entry.action === 'approve' && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  {i < auditEntries.length - 1 && <div className="w-px flex-1 bg-neutral-200 my-1" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900">{entry.userName}</span>
                    <span className="text-sm text-neutral-600">
                      {entry.action === 'create' && (language === 'zh-CN' ? '创建了文档' : 'created the document')}
                      {entry.action === 'update' && (language === 'zh-CN' ? `修改了 ${entry.field}` : `updated ${entry.field}`)}
                      {entry.action === 'submit' && (language === 'zh-CN' ? '提交了文档' : 'submitted the document')}
                      {entry.action === 'approve' && (language === 'zh-CN' ? '批准了文档' : 'approved the document')}
                    </span>
                  </div>
                  {entry.oldValue && entry.newValue && (
                    <div className="mt-1 text-xs">
                      <span className="line-through text-neutral-400">{entry.oldValue}</span>
                      <span className="mx-1 text-neutral-400">→</span>
                      <span className="text-primary-600 font-medium">{entry.newValue}</span>
                    </div>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
