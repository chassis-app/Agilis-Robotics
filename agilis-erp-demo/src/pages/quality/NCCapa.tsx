import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Plus, Search, Download, AlertTriangle } from 'lucide-react'
import type { DocumentStatus } from '@/types'

type NCSeverity = 'minor' | 'major' | 'critical'
type NCType = 'material' | 'process' | 'product'

interface NCRow {
  id: string
  ncNo: string
  status: DocumentStatus
  type: NCType
  severity: NCSeverity
  itemName: string
  itemNameEn: string
  lotNo: string
  description: string
  descriptionEn: string
  capaId: string
  createdAt: string
}

const mockNCs: NCRow[] = [
  { id: '1', ncNo: 'NC-2024-0001', status: 'approved', type: 'material', severity: 'major', itemName: '伺服电机模组', itemNameEn: 'Servo Motor Module', lotNo: 'LOT-20241203-002', description: '来料检验发现转速不达标，3/10样本不合格', descriptionEn: 'Incoming inspection found speed below spec, 3/10 samples failed', capaId: 'CAPA-2024-0001', createdAt: '2024-12-06' },
  { id: '2', ncNo: 'NC-2024-0002', status: 'in_approval', type: 'process', severity: 'critical', itemName: '手术臂关节模组', itemNameEn: 'Surgical Arm Joint Module', lotNo: 'LOT-20241205-003', description: '组装过程中发现扭矩校准超出公差范围', descriptionEn: 'Torque calibration out of tolerance during assembly', capaId: 'CAPA-2024-0002', createdAt: '2024-12-09' },
  { id: '3', ncNo: 'NC-2024-0003', status: 'submitted', type: 'product', severity: 'minor', itemName: '末端执行器组件', itemNameEn: 'End Effector Assembly', lotNo: 'LOT-20241207-004', description: '外观检验发现轻微划痕，不影响功能', descriptionEn: 'Cosmetic scratch found during visual inspection, no functional impact', capaId: '', createdAt: '2024-12-11' },
  { id: '4', ncNo: 'NC-2024-0004', status: 'draft', type: 'material', severity: 'major', itemName: '编码器组件', itemNameEn: 'Encoder Assembly', lotNo: 'LOT-20241210-005', description: '供应商发货数量不足且部分包装破损', descriptionEn: 'Supplier shipment short count with some packaging damage', capaId: '', createdAt: '2024-12-13' },
]

const severityConfig: Record<NCSeverity, { bg: string; text: string; label: string; labelEn: string }> = {
  minor: { bg: 'bg-warning-100', text: 'text-warning-700', label: '轻微', labelEn: 'Minor' },
  major: { bg: 'bg-danger-100', text: 'text-danger-700', label: '严重', labelEn: 'Major' },
  critical: { bg: 'bg-danger-500', text: 'text-white', label: '致命', labelEn: 'Critical' },
}

const typeLabels: Record<NCType, { label: string; labelEn: string }> = {
  material: { label: '物料', labelEn: 'Material' },
  process: { label: '制程', labelEn: 'Process' },
  product: { label: '产品', labelEn: 'Product' },
}

export default function NCCapa() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery) return mockNCs
    const q = searchQuery.toLowerCase()
    return mockNCs.filter(nc =>
      nc.ncNo.toLowerCase().includes(q) ||
      nc.itemName.toLowerCase().includes(q) ||
      nc.itemNameEn.toLowerCase().includes(q) ||
      nc.lotNo.toLowerCase().includes(q) ||
      nc.description.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '不合格品/纠正预防' : 'NC/CAPA'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {language === 'zh-CN' ? '不合格品报告与纠正/预防措施管理' : 'Nonconformance reports and corrective/preventive actions'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            {language === 'zh-CN' ? '新建NC报告' : 'New NC Report'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-danger-50">
            <AlertTriangle className="h-5 w-5 text-danger-500" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '致命不合格' : 'Critical NCs'}</p>
            <p className="text-xl font-semibold text-neutral-900">
              {mockNCs.filter(nc => nc.severity === 'critical').length}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-warning-50">
            <AlertTriangle className="h-5 w-5 text-warning-500" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '待处理' : 'Open NCs'}</p>
            <p className="text-xl font-semibold text-neutral-900">
              {mockNCs.filter(nc => nc.status !== 'approved' && nc.status !== 'cancelled').length}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-50">
            <AlertTriangle className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-neutral-500">{language === 'zh-CN' ? '关联CAPA' : 'Linked CAPAs'}</p>
            <p className="text-xl font-semibold text-neutral-900">
              {mockNCs.filter(nc => nc.capaId).length}
            </p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh-CN' ? '搜索NC编号、产品、批号...' : 'Search NC no., item, lot...'}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('quality.nc_no')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">
                  {language === 'zh-CN' ? '类型' : 'Type'}
                </th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('quality.severity')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('engineering.item_name')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('inventory.lot_no')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.description')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">CAPA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(nc => {
                const sevCfg = severityConfig[nc.severity]
                const typeLbl = typeLabels[nc.type]
                return (
                  <tr key={nc.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{nc.ncNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={nc.status} locale={language} />
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? typeLbl.label : typeLbl.labelEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                        sevCfg.bg, sevCfg.text,
                      )}>
                        {language === 'zh-CN' ? sevCfg.label : sevCfg.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-900">
                      {language === 'zh-CN' ? nc.itemName : nc.itemNameEn}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm font-mono text-neutral-600">{nc.lotNo}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm text-neutral-700 line-clamp-2 max-w-xs">
                        {language === 'zh-CN' ? nc.description : nc.descriptionEn}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {nc.capaId ? (
                        <span className="text-sm font-mono text-primary-600">{nc.capaId}</span>
                      ) : (
                        <span className="text-sm text-neutral-400">-</span>
                      )}
                    </td>
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
