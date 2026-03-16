import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { GitBranch, Plus, Search } from 'lucide-react'
import type { DocumentStatus } from '@/types'

const changes = [
  {
    docNo: 'ECR-2026-0005',
    status: 'approved' as DocumentStatus,
    reason: 'CAPA',
    affectedItem: 'ITM-0002',
    linkedComplaint: 'CMP-2026-0011',
    linkedCapa: 'CAPA-2026-0003',
    bomVersion: 'BOM-ITM-0015 Rev.04',
  },
  {
    docNo: 'ECR-2026-0006',
    status: 'in_approval' as DocumentStatus,
    reason: 'material change',
    affectedItem: 'ITM-0012',
    linkedComplaint: '-',
    linkedCapa: 'CAPA-2026-0005',
    bomVersion: 'BOM-ITM-0004 Rev.05',
  },
]

export default function ECRECO() {
  const { language } = useAuthStore()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = changes.filter((row) => !searchQuery || row.docNo.toLowerCase().includes(searchQuery.toLowerCase()) || row.affectedItem.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{language === 'zh-CN' ? '工程变更' : 'ECR / ECO'}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '按 Complaint > CAPA > ECR > BOM 变更 > 新版本 的链路管理工程变更'
              : 'Engineering change flow aligned to Complaint > CAPA > ECR > BOM Change > New Version.'}
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建 ECR' : 'New ECR'}
        </Button>
      </div>

      <Card className="bg-neutral-950 text-white">
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-white/80" />
          <p className="text-sm text-white/80">
            {language === 'zh-CN'
              ? '规范原因固定为：CAPA / material change / parts change'
              : 'Spec reasons are now normalized to CAPA / material change / parts change.'}
          </p>
        </div>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索 ECR 或料号...' : 'Search ECR or item...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">ECR</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '变更原因' : 'Reason'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '受影响料号' : 'Affected Item'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '客诉' : 'Complaint'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">CAPA</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '新 BOM 版本' : 'New BOM Version'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.docNo} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.docNo}</td>
                  <td className="px-3 py-2"><StatusBadge status={row.status} locale={language} /></td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.reason}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-700">{row.affectedItem}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-700">{row.linkedComplaint}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-700">{row.linkedCapa}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.bomVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
