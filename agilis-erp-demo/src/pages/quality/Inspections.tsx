import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Plus, Search, SlidersHorizontal, Download } from 'lucide-react'

type InspectionResult = 'pending' | 'pass' | 'fail' | 'conditional'
type InspectionType = 'incoming' | 'in_process' | 'final'

interface InspRow {
  id: string
  inspNo: string
  type: InspectionType
  itemName: string
  itemNameEn: string
  lotNo: string
  result: InspectionResult
  inspectorName: string
  inspectorNameEn: string
  inspectedDate: string
}

const mockInspections: InspRow[] = [
  { id: '1', inspNo: 'INS-2024-0001', type: 'incoming', itemName: '钛合金轴', itemNameEn: 'Titanium Alloy Shaft', lotNo: 'LOT-20241201-001', result: 'pass', inspectorName: '陈晓', inspectorNameEn: 'Xiao Chen', inspectedDate: '2024-12-05' },
  { id: '2', inspNo: 'INS-2024-0002', type: 'incoming', itemName: '伺服电机模组', itemNameEn: 'Servo Motor Module', lotNo: 'LOT-20241203-002', result: 'fail', inspectorName: '陈晓', inspectorNameEn: 'Xiao Chen', inspectedDate: '2024-12-06' },
  { id: '3', inspNo: 'INS-2024-0003', type: 'in_process', itemName: '手术臂关节模组', itemNameEn: 'Surgical Arm Joint Module', lotNo: 'LOT-20241205-003', result: 'pass', inspectorName: '周建', inspectorNameEn: 'Jian Zhou', inspectedDate: '2024-12-08' },
  { id: '4', inspNo: 'INS-2024-0004', type: 'final', itemName: '末端执行器组件', itemNameEn: 'End Effector Assembly', lotNo: 'LOT-20241207-004', result: 'conditional', inspectorName: '陈晓', inspectorNameEn: 'Xiao Chen', inspectedDate: '2024-12-10' },
  { id: '5', inspNo: 'INS-2024-0005', type: 'incoming', itemName: '编码器组件', itemNameEn: 'Encoder Assembly', lotNo: 'LOT-20241210-005', result: 'pending', inspectorName: '周建', inspectorNameEn: 'Jian Zhou', inspectedDate: '2024-12-12' },
  { id: '6', inspNo: 'INS-2024-0006', type: 'final', itemName: '控制电路板', itemNameEn: 'Control Circuit Board', lotNo: 'LOT-20241212-006', result: 'pass', inspectorName: '陈晓', inspectorNameEn: 'Xiao Chen', inspectedDate: '2024-12-14' },
]

const resultTabs: { id: string; key: InspectionResult | 'all' }[] = [
  { id: 'all', key: 'all' },
  { id: 'pending', key: 'pending' },
  { id: 'pass', key: 'pass' },
  { id: 'fail', key: 'fail' },
  { id: 'conditional', key: 'conditional' },
]

const resultConfig: Record<InspectionResult, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  pending: { bg: 'bg-neutral-100', text: 'text-neutral-600', dot: 'bg-neutral-400', label: '待检', labelEn: 'Pending' },
  pass: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '合格', labelEn: 'Pass' },
  fail: { bg: 'bg-danger-100', text: 'text-danger-700', dot: 'bg-danger-500', label: '不合格', labelEn: 'Fail' },
  conditional: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500', label: '有条件放行', labelEn: 'Conditional' },
}

const typeConfig: Record<InspectionType, { bg: string; text: string; label: string; labelEn: string }> = {
  incoming: { bg: 'bg-primary-100', text: 'text-primary-700', label: '来料', labelEn: 'Incoming' },
  in_process: { bg: 'bg-info-100', text: 'text-info-700', label: '制程', labelEn: 'In-Process' },
  final: { bg: 'bg-neutral-100', text: 'text-neutral-700', label: '终检', labelEn: 'Final' },
}

export default function Inspections() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [activeResult, setActiveResult] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = mockInspections
    if (activeResult !== 'all') {
      result = result.filter(insp => insp.result === activeResult)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(insp =>
        insp.inspNo.toLowerCase().includes(q) ||
        insp.itemName.toLowerCase().includes(q) ||
        insp.itemNameEn.toLowerCase().includes(q) ||
        insp.lotNo.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeResult, searchQuery])

  const resultCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockInspections.length }
    mockInspections.forEach(insp => { counts[insp.result] = (counts[insp.result] || 0) + 1 })
    return counts
  }, [])

  const getResultLabel = (key: string) => {
    if (key === 'all') return language === 'zh-CN' ? '全部' : 'All'
    const cfg = resultConfig[key as InspectionResult]
    return cfg ? (language === 'zh-CN' ? cfg.label : cfg.labelEn) : key
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {language === 'zh-CN' ? '质量检验' : 'Inspections'}
        </h1>
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

      {/* Result Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        {resultTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveResult(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeResult === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {getResultLabel(tab.key)}
            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
              activeResult === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'
            }`}>
              {resultCounts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索检验单号、产品、批号...' : 'Search inspection no., item, lot...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="secondary" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          {language === 'zh-CN' ? '更多筛选' : 'More Filters'}
        </Button>
      </div>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('quality.insp_no')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '类型' : 'Type'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('engineering.item_name')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('inventory.lot_no')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('quality.result')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '检验员' : 'Inspector'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.date')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(insp => {
                const rCfg = resultConfig[insp.result]
                const tCfg = typeConfig[insp.type]
                return (
                  <tr key={insp.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{insp.inspNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                        tCfg.bg, tCfg.text,
                      )}>
                        {language === 'zh-CN' ? tCfg.label : tCfg.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900">
                      {language === 'zh-CN' ? insp.itemName : insp.itemNameEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm font-mono text-neutral-600">{insp.lotNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                        rCfg.bg, rCfg.text,
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', rCfg.dot)} />
                        {language === 'zh-CN' ? rCfg.label : rCfg.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? insp.inspectorName : insp.inspectorNameEn}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{insp.inspectedDate}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            {t('common.total_records', { count: filtered.length })}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">1 / 1</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
