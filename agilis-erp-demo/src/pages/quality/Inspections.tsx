import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { Download, Plus } from 'lucide-react'

const inspections = [
  {
    inspNo: 'INS-2026-0010',
    type: 'Incoming',
    item: '钛合金传动轴',
    lotNo: 'LOT-TI-001',
    sourceDoc: 'GRN-F-2026-0019',
    reportDoc: 'ICR-2026-0008',
    internalQc: '-',
    template: 'Incoming Category-A Metal',
  },
  {
    inspNo: 'INS-2026-0012',
    type: 'Internal QC',
    item: '手术机器人整机',
    lotNo: 'PB-2026-0012-01',
    sourceDoc: 'BO-F-2026-0012',
    reportDoc: 'IQC-2026-0007',
    internalQc: 'IQC-2026-0007',
    template: 'EU Category-A Final Assembly',
  },
]

export default function Inspections() {
  const { t } = useTranslation()
  const { language } = useAuthStore()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{language === 'zh-CN' ? '检验管理' : 'Inspections'}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '连接收货检查报告、内部检验单与模板来源'
              : 'Inspection register linked to goods receipt reports, internal QC documents, and source templates.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建检验' : 'New Inspection'}
          </Button>
        </div>
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '检验单号' : 'Inspection No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '类型' : 'Type'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料 / 批次' : 'Item / Lot'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '来源文档' : 'Source Document'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '检查报告' : 'Report Document'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '内部检验' : 'Internal QC'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '模板来源' : 'Template Source'}</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((row) => (
                <tr key={row.inspNo} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.inspNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.type}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">
                    <div>{row.item}</div>
                    <div className="font-mono text-xs text-neutral-400">{row.lotNo}</div>
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-700">{row.sourceDoc}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-700">{row.reportDoc}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-700">{row.internalQc}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{row.template}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
