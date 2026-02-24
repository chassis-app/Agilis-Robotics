import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { FileBarChart, ClipboardList, AlertTriangle, TrendingUp, GraduationCap, FileCheck, ScanBarcode } from 'lucide-react'
import type { ReactNode } from 'react'

interface ReportCard {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: ReactNode
  iconBg: string
}

const reports: ReportCard[] = [
  {
    id: 'audit-trail',
    title: '审计追踪报表',
    titleEn: 'Audit Trail Report',
    description: '完整的操作审计日志，满足21 CFR Part 11合规要求',
    descriptionEn: 'Complete audit log compliant with 21 CFR Part 11 requirements',
    icon: <ClipboardList className="h-5 w-5" />,
    iconBg: 'bg-primary-50 text-primary-600',
  },
  {
    id: 'capa-summary',
    title: 'CAPA汇总报表',
    titleEn: 'CAPA Summary',
    description: '纠正与预防措施的执行状态、到期预警及效果评估',
    descriptionEn: 'CAPA execution status, due date alerts and effectiveness evaluation',
    icon: <AlertTriangle className="h-5 w-5" />,
    iconBg: 'bg-warning-50 text-warning-600',
  },
  {
    id: 'nc-trending',
    title: '不合格趋势分析',
    titleEn: 'Nonconformance Trending',
    description: '按类型、严重程度和时间维度的不合格报告趋势',
    descriptionEn: 'NC report trends by type, severity and time dimension',
    icon: <TrendingUp className="h-5 w-5" />,
    iconBg: 'bg-danger-50 text-danger-600',
  },
  {
    id: 'training-records',
    title: '培训记录报表',
    titleEn: 'Training Records',
    description: '人员培训完成状态、到期提醒及合规覆盖率',
    descriptionEn: 'Staff training completion, expiry alerts and compliance coverage',
    icon: <GraduationCap className="h-5 w-5" />,
    iconBg: 'bg-success-50 text-success-600',
  },
  {
    id: 'document-control',
    title: '文控报表',
    titleEn: 'Document Control',
    description: '受控文档的版本状态、审批周期及过期文档统计',
    descriptionEn: 'Controlled document version status, review cycles and expired docs',
    icon: <FileCheck className="h-5 w-5" />,
    iconBg: 'bg-info-50 text-info-600',
  },
  {
    id: 'udi-compliance',
    title: 'UDI合规报表',
    titleEn: 'UDI Compliance',
    description: 'UDI标识分配状态、GUDID提交进度及合规覆盖率',
    descriptionEn: 'UDI assignment status, GUDID submission progress and compliance rate',
    icon: <ScanBarcode className="h-5 w-5" />,
    iconBg: 'bg-neutral-100 text-neutral-600',
  },
]

export default function ReportsCompliance() {
  const { t } = useTranslation()
  const { language } = useAuthStore()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '合规报表' : 'Compliance Reports'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map(report => (
          <Card key={report.id} className="flex flex-col">
            <div className="flex items-start gap-3 mb-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${report.iconBg}`}>
                {report.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {language === 'zh-CN' ? report.title : report.titleEn}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {language === 'zh-CN' ? report.description : report.descriptionEn}
                </p>
              </div>
            </div>
            <div className="mt-auto pt-2">
              <Button variant="secondary" size="sm" className="w-full">
                <FileBarChart className="h-4 w-4" />
                {language === 'zh-CN' ? '生成报表' : 'Generate'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
