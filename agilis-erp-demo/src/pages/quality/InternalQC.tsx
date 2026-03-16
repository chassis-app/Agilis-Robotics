import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/store/useAuthStore'
import { ClipboardCheck, FileStack, Plus, Printer, Search, WandSparkles } from 'lucide-react'
import type { DocumentStatus } from '@/types'

interface InternalQcRow {
  id: string
  qcNo: string
  status: DocumentStatus
  buildOrderNo: string
  batchNo: string
  market: string
  itemNo: string
  itemName: string
  itemNameEn: string
  qcTemplate: string
  sampleRule: string
  sampleQty: number
  generatedForm: 'ready' | 'pending'
}

const internalQcRows: InternalQcRow[] = [
  {
    id: '1',
    qcNo: 'IQC-2026-0007',
    status: 'approved',
    buildOrderNo: 'BO-F-2026-0012',
    batchNo: 'PB-2026-0012-01',
    market: 'EU',
    itemNo: 'FG-001',
    itemName: '手术机器人手臂组件',
    itemNameEn: 'Surgical Robot Arm Assembly',
    qcTemplate: 'EU Category-A Final Assembly',
    sampleRule: 'AQL 1.0 / Major 1.0 / Minor 2.5',
    sampleQty: 8,
    generatedForm: 'ready',
  },
  {
    id: '2',
    qcNo: 'IQC-2026-0008',
    status: 'in_approval',
    buildOrderNo: 'BO-I-2026-0004',
    batchNo: 'PB-2026-0004-02',
    market: 'CN',
    itemNo: 'SP-002',
    itemName: '控制系统半成品',
    itemNameEn: 'Control System Semi Product',
    qcTemplate: 'CN Category-B Semi Product',
    sampleRule: 'AQL 0.65 / Major 0.65 / Minor 1.5',
    sampleQty: 5,
    generatedForm: 'ready',
  },
  {
    id: '3',
    qcNo: 'IQC-2026-0009',
    status: 'draft',
    buildOrderNo: 'BO-F-2026-0016',
    batchNo: 'PB-2026-0016-01',
    market: 'US',
    itemNo: 'FG-003',
    itemName: '末端执行器套件',
    itemNameEn: 'End Effector Kit',
    qcTemplate: 'US Category-C Final Packout',
    sampleRule: 'AQL 1.5 / Major 1.0 / Minor 2.5',
    sampleQty: 13,
    generatedForm: 'pending',
  },
]

export default function InternalQC() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return internalQcRows
    const query = searchQuery.toLowerCase()
    return internalQcRows.filter((row) =>
      row.qcNo.toLowerCase().includes(query) ||
      row.buildOrderNo.toLowerCase().includes(query) ||
      row.batchNo.toLowerCase().includes(query) ||
      row.itemNo.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '内部检验' : 'Internal QC'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '根据市场与物料分类字段自动计算抽检数，并生成可打印检验包'
              : 'Generate printable QC packets by market, category fields, and AQL rules.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/quality/internal-qc/templates')}>
            <FileStack className="h-4 w-4" />
            {language === 'zh-CN' ? '模板编辑器' : 'Template Editor'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建内部检验' : 'New Internal QC'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
            <ClipboardCheck className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '检验批次' : 'QC Batches'}</p>
            <p className="text-xl font-semibold text-neutral-900">{internalQcRows.length}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '已生成表单' : 'Generated Forms'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">
            {internalQcRows.filter((row) => row.generatedForm === 'ready').length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '平均抽检数' : 'Avg. Sample Qty'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">
            {Math.round(internalQcRows.reduce((sum, row) => sum + row.sampleQty, 0) / internalQcRows.length)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '待打印' : 'Awaiting Print'}</p>
          <p className="mt-2 text-xl font-semibold text-neutral-900">
            {internalQcRows.filter((row) => row.generatedForm === 'ready').length}
          </p>
        </Card>
      </div>

      <Card className="bg-neutral-950 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold">
              {language === 'zh-CN' ? '自动生成逻辑' : 'Auto-generation Logic'}
            </h3>
            <p className="mt-1 text-sm text-white/70">
              {language === 'zh-CN'
                ? 'Build Order 市场 + Category A/B/C + AQL 规则 = 固定版式 QC Form'
                : 'Build-order market + Category A/B/C + AQL = fixed QC form packet.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <WandSparkles className="h-4 w-4" />
              {language === 'zh-CN' ? '重新计算抽检' : 'Recalculate AQL'}
            </Button>
            <Button variant="secondary" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Printer className="h-4 w-4" />
              {language === 'zh-CN' ? '打印检验包' : 'Print Packet'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={language === 'zh-CN' ? '搜索检验单、Build Order、批次...' : 'Search QC no., build order, batch...'}
          className="h-9 w-full rounded-md border border-neutral-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '内部检验单' : 'Internal QC No.'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? 'Build Order' : 'Build Order'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '生产批次' : 'Batch'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '市场' : 'Market'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '模板' : 'Template'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '抽检规则' : 'AQL Rule'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '抽检数' : 'Sample Qty'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '表单' : 'Form'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2 text-sm font-mono font-medium text-primary-600">{row.qcNo}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} locale={language} />
                  </td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.buildOrderNo}</td>
                  <td className="px-3 py-2 text-sm font-mono text-neutral-600">{row.batchNo}</td>
                  <td className="px-3 py-2 text-sm text-neutral-700">{row.market}</td>
                  <td className="px-3 py-2 text-sm text-neutral-800">{row.qcTemplate}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{row.sampleRule}</td>
                  <td className="px-3 py-2 text-right text-sm font-semibold text-neutral-900">{row.sampleQty}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">
                    {row.generatedForm === 'ready'
                      ? language === 'zh-CN' ? '可打印' : 'Printable'
                      : language === 'zh-CN' ? '待生成' : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
