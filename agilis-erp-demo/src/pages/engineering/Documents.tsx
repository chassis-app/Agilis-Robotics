import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface DocRow {
  id: string
  docNo: string
  title: string
  titleEn: string
  category: string
  categoryEn: string
  revision: string
  status: DocumentStatus
  owner: string
  ownerEn: string
  lastUpdated: string
}

const mockDocs: DocRow[] = [
  { id: '1', docNo: 'DOC-001', title: '质量手册', titleEn: 'Quality Manual', category: '质量', categoryEn: 'Quality', revision: 'Rev 3.1', status: 'approved', owner: '赵静', ownerEn: 'Zhao Jing', lastUpdated: '2024-12-01' },
  { id: '2', docNo: 'DOC-002', title: '来料检验SOP', titleEn: 'Incoming Inspection SOP', category: '质量', categoryEn: 'Quality', revision: 'Rev 2.0', status: 'approved', owner: '赵静', ownerEn: 'Zhao Jing', lastUpdated: '2024-11-15' },
  { id: '3', docNo: 'DOC-003', title: '产品设计输入规范', titleEn: 'Product Design Input Spec', category: '工程', categoryEn: 'Engineering', revision: 'Rev 1.2', status: 'in_approval', owner: '王芳', ownerEn: 'Wang Fang', lastUpdated: '2024-12-10' },
  { id: '4', docNo: 'DOC-004', title: '供应商审核流程', titleEn: 'Supplier Audit Process', category: '采购', categoryEn: 'Procurement', revision: 'Rev 1.0', status: 'submitted', owner: '李明', ownerEn: 'Li Ming', lastUpdated: '2024-12-12' },
  { id: '5', docNo: 'DOC-005', title: '生产作业指导书', titleEn: 'Production Work Instructions', category: '生产', categoryEn: 'Manufacturing', revision: 'Rev 4.0', status: 'approved', owner: '刘洋', ownerEn: 'Liu Yang', lastUpdated: '2024-11-20' },
  { id: '6', docNo: 'DOC-006', title: '设备校准程序', titleEn: 'Equipment Calibration Procedure', category: '质量', categoryEn: 'Quality', revision: 'Rev 1.1', status: 'draft', owner: '赵静', ownerEn: 'Zhao Jing', lastUpdated: '2024-12-14' },
]

export default function Documents() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockDocs.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.docNo.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.titleEn.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '文档管理' : 'Document Management'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '上传文档' : 'Upload Document'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索文档编号、标题...' : 'Search doc no., title...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '文档编号' : 'Doc No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '标题' : 'Title'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '分类' : 'Category'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '版本' : 'Revision'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '负责人' : 'Owner'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '最后更新' : 'Last Updated'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.docNo}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.title : row.titleEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">
                    {language === 'zh-CN' ? row.category : row.categoryEn}
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">{row.revision}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.owner : row.ownerEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.lastUpdated}</td>
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
