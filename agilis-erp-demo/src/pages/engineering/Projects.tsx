import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuthStore } from '@/store/useAuthStore'
import { Plus, Download, Search, Eye } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface ProjectRow {
  id: string
  projectNo: string
  name: string
  nameEn: string
  status: DocumentStatus
  phase: string
  phaseEn: string
  lead: string
  leadEn: string
  startDate: string
  endDate: string
  progress: number
}

const mockProjects: ProjectRow[] = [
  { id: '1', projectNo: 'PRJ-2024-001', name: '内窥镜导管 Gen3', nameEn: 'Endoscope Catheter Gen3', status: 'approved', phase: '量产准备', phaseEn: 'Mass Production Prep', lead: '王芳', leadEn: 'Wang Fang', startDate: '2024-06-01', endDate: '2025-03-31', progress: 72 },
  { id: '2', projectNo: 'PRJ-2024-002', name: '手术机器人臂 v2', nameEn: 'Surgical Robot Arm v2', status: 'approved', phase: '设计验证', phaseEn: 'Design Verification', lead: '刘洋', leadEn: 'Liu Yang', startDate: '2024-08-15', endDate: '2025-06-30', progress: 45 },
  { id: '3', projectNo: 'PRJ-2024-003', name: '无线控制模块', nameEn: 'Wireless Control Module', status: 'in_approval', phase: '概念设计', phaseEn: 'Concept Design', lead: '王芳', leadEn: 'Wang Fang', startDate: '2024-11-01', endDate: '2025-08-31', progress: 15 },
  { id: '4', projectNo: 'PRJ-2024-004', name: '柔性传感器阵列', nameEn: 'Flexible Sensor Array', status: 'submitted', phase: '需求分析', phaseEn: 'Requirements Analysis', lead: '赵静', leadEn: 'Zhao Jing', startDate: '2024-12-01', endDate: '2025-09-30', progress: 8 },
  { id: '5', projectNo: 'PRJ-2024-005', name: '高精度定位系统', nameEn: 'High Precision Positioning', status: 'approved', phase: '试产', phaseEn: 'Pilot Production', lead: '刘洋', leadEn: 'Liu Yang', startDate: '2024-03-01', endDate: '2025-01-31', progress: 92 },
]

export default function Projects() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockProjects.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.projectNo.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.nameEn.toLowerCase().includes(q)
  })

  const getProgressColor = (pct: number): 'success' | 'primary' | 'warning' | 'danger' => {
    if (pct >= 80) return 'success'
    if (pct >= 50) return 'primary'
    if (pct >= 25) return 'warning'
    return 'danger'
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '项目管理' : 'Project Management'}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建项目' : 'New Project'}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索项目编号、名称...' : 'Search project no., name...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '项目编号' : 'Project No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '项目名称' : 'Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '阶段' : 'Phase'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '负责人' : 'Lead'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '开始日期' : 'Start Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '结束日期' : 'End Date'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 w-36">{language === 'zh-CN' ? '进度' : 'Progress'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-center">{language === 'zh-CN' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-primary-600 font-mono">{row.projectNo}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.name : row.nameEn}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">
                    {language === 'zh-CN' ? row.phase : row.phaseEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    {language === 'zh-CN' ? row.lead : row.leadEn}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.startDate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-500">{row.endDate}</td>
                  <td className="px-3 py-2">
                    <ProgressBar value={row.progress} color={getProgressColor(row.progress)} showLabel size="md" />
                  </td>
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
