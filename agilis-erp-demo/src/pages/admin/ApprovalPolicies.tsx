import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'

type PolicyStatus = 'active' | 'inactive'

const policies = [
  { id: '1', name: '領料审批', nameEn: 'Material Withdrawal Request Approval', documentType: '領料', documentTypeEn: 'Material Withdrawal Request', levels: 2, approvers: '仓库主管 → 生产主管', approversEn: 'Warehouse Lead → Production Lead', status: 'active' as PolicyStatus },
  { id: '2', name: '發料确认', nameEn: 'Material Withdrawal Confirmation', documentType: '發料', documentTypeEn: 'Material Withdrawal Confirmation', levels: 1, approvers: '仓库主管', approversEn: 'Warehouse Lead', status: 'active' as PolicyStatus },
  { id: '3', name: '供应商退货审批', nameEn: 'Goods Return Approval', documentType: '退货单', documentTypeEn: 'Goods Return', levels: 2, approvers: '采购主管 → 财务主管', approversEn: 'Procurement Lead → Finance Lead', status: 'active' as PolicyStatus },
  { id: '4', name: 'CAPA 变更链审批', nameEn: 'CAPA Change Chain Approval', documentType: 'CAPA / ECR', documentTypeEn: 'CAPA / ECR', levels: 3, approvers: '质量主管 → 工程主管 → 总经理', approversEn: 'Quality Lead → Engineering Lead → GM', status: 'active' as PolicyStatus },
]

const statusStyles = {
  active: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500' },
  inactive: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400' },
}

export default function ApprovalPolicies() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = policies.filter((row) => !searchQuery || row.name.toLowerCase().includes(searchQuery.toLowerCase()) || row.documentType.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{language === 'zh-CN' ? '审批策略' : 'Approval Policies'}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '新增領料 / 發料 / 退货与 CAPA 变更链审批策略'
              : 'Approval policies now cover withdrawal request, withdrawal confirmation, goods return, and CAPA change-chain flows.'}
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建策略' : 'New Policy'}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索策略或文档类型...' : 'Search policy or document type...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '审批角色' : 'Approvers'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const config = statusStyles[row.status]
                return (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900">{language === 'zh-CN' ? row.name : row.nameEn}</td>
                    <td className="px-3 py-2 text-sm text-neutral-700">{language === 'zh-CN' ? row.documentType : row.documentTypeEn}</td>
                    <td className="px-3 py-2 text-center text-sm text-neutral-700">{row.levels}</td>
                    <td className="px-3 py-2 text-sm text-neutral-600">{language === 'zh-CN' ? row.approvers : row.approversEn}</td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium', config.bg, config.text)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
                        {row.status}
                      </span>
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
