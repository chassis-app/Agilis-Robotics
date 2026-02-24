import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

type ChangeType = 'ECR' | 'ECO'

interface ECRECORow {
  id: string
  docNo: string
  type: ChangeType
  status: DocumentStatus
  itemAffected: string
  itemAffectedEn: string
  description: string
  descriptionEn: string
  initiatedBy: string
  initiatedByEn: string
  date: string
}

const mockECRECO: ECRECORow[] = [
  { id: '1', docNo: 'ECR-2024-0001', type: 'ECR', status: 'approved', itemAffected: '伺服电机 MG-400', itemAffectedEn: 'Servo Motor MG-400', description: '更换供应商', descriptionEn: 'Change supplier', initiatedBy: '王芳', initiatedByEn: 'Wang Fang', date: '2024-12-01' },
  { id: '2', docNo: 'ECO-2024-0001', type: 'ECO', status: 'approved', itemAffected: 'PCB控制板 v3.2', itemAffectedEn: 'PCB Control Board v3.2', description: '版本升级至v3.3', descriptionEn: 'Upgrade to v3.3', initiatedBy: '王芳', initiatedByEn: 'Wang Fang', date: '2024-12-03' },
  { id: '3', docNo: 'ECR-2024-0002', type: 'ECR', status: 'in_approval', itemAffected: '钛合金轴', itemAffectedEn: 'Titanium Alloy Shaft', description: '材料规格变更', descriptionEn: 'Material spec change', initiatedBy: '李明', initiatedByEn: 'Li Ming', date: '2024-12-10' },
  { id: '4', docNo: 'ECO-2024-0002', type: 'ECO', status: 'submitted', itemAffected: '不锈钢外壳 A型', itemAffectedEn: 'SS Housing Type-A', description: '增加防水密封设计', descriptionEn: 'Add waterproof seal design', initiatedBy: '刘洋', initiatedByEn: 'Liu Yang', date: '2024-12-12' },
  { id: '5', docNo: 'ECR-2024-0003', type: 'ECR', status: 'draft', itemAffected: '密封O型圈', itemAffectedEn: 'Seal O-Ring', description: '替代材料评估', descriptionEn: 'Alternative material evaluation', initiatedBy: '赵静', initiatedByEn: 'Zhao Jing', date: '2024-12-15' },
  { id: '6', docNo: 'ECO-2024-0003', type: 'ECO', status: 'rejected', itemAffected: '轴承套件 BK-200', itemAffectedEn: 'Bearing Set BK-200', description: '公差调整', descriptionEn: 'Tolerance adjustment', initiatedBy: '王芳', initiatedByEn: 'Wang Fang', date: '2024-12-08' },
]

export default function ECRECO() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockECRECO.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.docNo.toLowerCase().includes(q) || r.itemAffected.toLowerCase().includes(q) || r.itemAffectedEn.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '工程变更' : 'ECR / ECO'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建ECR' : 'New ECR'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索文档编号、受影响物料...' : 'Search doc no., affected item...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '文档编号' : 'ECR/ECO No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '类型' : 'Type'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '受影响物料' : 'Item Affected'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '描述' : 'Description'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '发起人' : 'Initiated By'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '日期' : 'Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.docNo}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                      row.type === 'ECR' ? 'bg-info-100 text-info-700' : 'bg-primary-100 text-primary-700'
                    )}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.itemAffected : row.itemAffectedEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500 max-w-[200px] truncate">
                    {language === 'zh-CN' ? row.description : row.descriptionEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.initiatedBy : row.initiatedByEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.date}</td>
                  <td className="px-3 py-2 text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
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
