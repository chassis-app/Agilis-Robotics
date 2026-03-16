import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { AlertTriangle, GitBranch, Plus } from 'lucide-react'
import type { DocumentStatus } from '@/types'

const capas = [
  {
    capaNo: 'CAPA-2026-0003',
    status: 'approved' as DocumentStatus,
    complaint: 'CMP-2026-0011',
    ecr: 'ECR-2026-0005',
    bomChange: 'BOM-ITM-0015 Rev.04',
    summary: 'Servo shaft material update after EU complaint trend analysis',
  },
  {
    capaNo: 'CAPA-2026-0005',
    status: 'in_approval' as DocumentStatus,
    complaint: 'CMP-2026-0012',
    ecr: 'ECR-2026-0006',
    bomChange: 'BOM-ITM-0004 Rev.05',
    summary: 'Controller-board material and component adjustment',
  },
]

export default function NCCapa() {
  const { language } = useAuthStore()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{language === 'zh-CN' ? 'CAPA 流程' : 'CAPA Workflow'}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '将客诉、CAPA、ECR、BOM 变更与新版本统一展示'
              : 'Unified view of complaint, CAPA, ECR, BOM change, and resulting version release.'}
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {language === 'zh-CN' ? '新建 CAPA' : 'New CAPA'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-50">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '活动 CAPA' : 'Open CAPA'}</p>
            <p className="text-xl font-semibold text-neutral-900">{capas.length}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '已触发 ECR' : 'Triggered ECR'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{capas.filter((row) => row.ecr).length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '已更新 BOM 版本' : 'BOM Version Updated'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">{capas.filter((row) => row.bomChange).length}</p>
        </Card>
      </div>

      <Card className="space-y-4">
        {capas.map((row) => (
          <div key={row.capaNo} className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-neutral-900 font-mono">{row.capaNo}</h3>
                  <StatusBadge status={row.status} locale={language} />
                </div>
                <p className="mt-2 text-sm text-neutral-600">{row.summary}</p>
              </div>
              <Button variant="secondary" size="sm">
                <GitBranch className="h-4 w-4" />
                {language === 'zh-CN' ? '查看变更链' : 'View Change Chain'}
              </Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">{language === 'zh-CN' ? 'Complaint' : 'Complaint'}</p>
                <p className="mt-1 text-sm font-mono text-neutral-900">{row.complaint}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">CAPA</p>
                <p className="mt-1 text-sm font-mono text-neutral-900">{row.capaNo}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">ECR</p>
                <p className="mt-1 text-sm font-mono text-neutral-900">{row.ecr}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">{language === 'zh-CN' ? 'BOM 新版本' : 'New BOM Version'}</p>
                <p className="mt-1 text-sm text-neutral-900">{row.bomChange}</p>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
