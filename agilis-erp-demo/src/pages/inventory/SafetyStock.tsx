import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { Download, Search, AlertTriangle } from 'lucide-react'

type StockLevel = 'ok' | 'low' | 'critical'

interface SafetyStockRow {
  id: string
  itemNo: string
  itemName: string
  itemNameEn: string
  currentStock: number
  safetyStock: number
  reorderPoint: number
  level: StockLevel
  lastOrdered: string
}

const mockSafetyStock: SafetyStockRow[] = [
  { id: '1', itemNo: 'ITM-001', itemName: '钛合金轴', itemNameEn: 'Titanium Alloy Shaft', currentStock: 120, safetyStock: 50, reorderPoint: 80, level: 'ok', lastOrdered: '2024-12-01' },
  { id: '2', itemNo: 'ITM-002', itemName: '伺服电机 MG-400', itemNameEn: 'Servo Motor MG-400', currentStock: 15, safetyStock: 20, reorderPoint: 30, level: 'critical', lastOrdered: '2024-11-20' },
  { id: '3', itemNo: 'ITM-003', itemName: 'PCB控制板 v3.2', itemNameEn: 'PCB Control Board v3.2', currentStock: 42, safetyStock: 30, reorderPoint: 50, level: 'low', lastOrdered: '2024-12-05' },
  { id: '4', itemNo: 'ITM-004', itemName: '不锈钢外壳 A型', itemNameEn: 'Stainless Steel Housing Type-A', currentStock: 200, safetyStock: 100, reorderPoint: 150, level: 'ok', lastOrdered: '2024-11-15' },
  { id: '5', itemNo: 'ITM-005', itemName: '密封O型圈', itemNameEn: 'Seal O-Ring', currentStock: 8, safetyStock: 50, reorderPoint: 80, level: 'critical', lastOrdered: '2024-10-28' },
  { id: '6', itemNo: 'ITM-006', itemName: '轴承套件 BK-200', itemNameEn: 'Bearing Set BK-200', currentStock: 35, safetyStock: 25, reorderPoint: 40, level: 'low', lastOrdered: '2024-12-08' },
]

const levelConfig: Record<StockLevel, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  ok: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500', label: '正常', labelEn: 'Normal' },
  low: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500', label: '偏低', labelEn: 'Low' },
  critical: { bg: 'bg-danger-100', text: 'text-danger-700', dot: 'bg-danger-500', label: '告急', labelEn: 'Critical' },
}

export default function SafetyStock() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockSafetyStock.filter(r => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return r.itemNo.toLowerCase().includes(q) || r.itemName.toLowerCase().includes(q) || r.itemNameEn.toLowerCase().includes(q)
  })

  const criticalCount = mockSafetyStock.filter(r => r.level === 'critical').length
  const lowCount = mockSafetyStock.filter(r => r.level === 'low').length

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '安全库存预警' : 'Safety Stock Alerts'}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 text-sm text-danger-600">
                <AlertTriangle className="h-4 w-4" />
                {language === 'zh-CN' ? `${criticalCount} 项告急` : `${criticalCount} critical`}
              </span>
            )}
            {lowCount > 0 && (
              <span className="text-sm text-warning-600">
                {language === 'zh-CN' ? `${lowCount} 项偏低` : `${lowCount} low`}
              </span>
            )}
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          {t('common.export')}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'zh-CN' ? '搜索物料编号、名称...' : 'Search item no., name...'}
          className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料编号' : 'Item No'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '物料名称' : 'Item Name'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '当前库存' : 'Current Stock'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '安全库存' : 'Safety Stock'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 text-right">{language === 'zh-CN' ? '再订货点' : 'Reorder Point'}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500">{language === 'zh-CN' ? '上次订购' : 'Last Ordered'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const config = levelConfig[row.level]
                return (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2">
                      <span className="text-sm font-medium text-primary-600 font-mono">{row.itemNo}</span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-700">
                      {language === 'zh-CN' ? row.itemName : row.itemNameEn}
                    </td>
                    <td className={cn('px-3 py-2 text-sm font-medium text-right', row.level === 'critical' ? 'text-danger-600' : row.level === 'low' ? 'text-warning-600' : 'text-neutral-900')}>
                      {row.currentStock}
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500 text-right">{row.safetyStock}</td>
                    <td className="px-3 py-2 text-sm text-neutral-500 text-right">{row.reorderPoint}</td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
                        {language === 'zh-CN' ? config.label : config.labelEn}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-neutral-500">{row.lastOrdered}</td>
                  </tr>
                )
              })}
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
