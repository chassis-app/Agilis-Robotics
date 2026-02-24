import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Plus, Search, Pencil } from 'lucide-react'

type PolicyStatus = 'active' | 'inactive'

interface PolicyRow {
  id: string
  name: string
  nameEn: string
  documentType: string
  documentTypeEn: string
  levels: number
  approverRoles: string
  approverRolesEn: string
  status: PolicyStatus
}

const mockPolicies: PolicyRow[] = [
  { id: '1', name: '采购申请审批', nameEn: 'Purchase Requisition Approval', documentType: '采购申请', documentTypeEn: 'Purchase Requisition', levels: 2, approverRoles: '供应链主管 → 总经理', approverRolesEn: 'SC Lead → GM', status: 'active' },
  { id: '2', name: '采购订单审批', nameEn: 'Purchase Order Approval', documentType: '采购订单', documentTypeEn: 'Purchase Order', levels: 2, approverRoles: '供应链主管 → 总经理', approverRolesEn: 'SC Lead → GM', status: 'active' },
  { id: '3', name: '工单审批', nameEn: 'Work Order Approval', documentType: '生产工单', documentTypeEn: 'Work Order', levels: 1, approverRoles: '生产主管', approverRolesEn: 'Production Lead', status: 'active' },
  { id: '4', name: '工程变更审批', nameEn: 'ECR/ECO Approval', documentType: 'ECR/ECO', documentTypeEn: 'ECR/ECO', levels: 3, approverRoles: '工程师 → 品质主管 → 总经理', approverRolesEn: 'Engineer → Quality Lead → GM', status: 'active' },
  { id: '5', name: '不合格品处理', nameEn: 'NC Disposition Approval', documentType: '不合格报告', documentTypeEn: 'NC Report', levels: 2, approverRoles: '品质主管 → 总经理', approverRolesEn: 'Quality Lead → GM', status: 'inactive' },
]

const statusStyles: Record<PolicyStatus, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  active: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '启用', labelEn: 'Active' },
  inactive: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400', label: '停用', labelEn: 'Inactive' },
}

export default function ApprovalPolicies() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockPolicies.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.name.toLowerCase().includes(q) || r.nameEn.toLowerCase().includes(q) || r.documentType.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '审批策略' : 'Approval Policies'}
        </h1>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建策略' : 'New Policy'}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索策略名称...' : 'Search policy name...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '策略名称' : 'Policy Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '文档类型' : 'Document Type'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '层级' : 'Levels'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '审批人角色' : 'Approver Roles'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const config = statusStyles[row.status]
                return (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900">
                      {language === 'zh-CN' ? row.name : row.nameEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-700">
                        {language === 'zh-CN' ? row.documentType : row.documentTypeEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700 text-center">{row.levels}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500">
                      {language === 'zh-CN' ? row.approverRoles : row.approverRolesEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
                        {language === 'zh-CN' ? config.label : config.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: filtered.length })}
          </span>
        </div>
      </Card>
    </div>
  )
}
